import { Component, NgZone, ViewChild,  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from 'src/app/models/property';
import { DataService } from 'src/app/services/data-service.service';
import { PropertyType } from '../../models/property';
import {} from 'googlemaps';
import { LoaderService } from 'src/app/components/loader/loader.service';
import { ErrorDialogService } from 'src/app/components/error-dialog/error-dialog.service';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { GeocoderResponse } from 'src/app/models/geocoder_response';
import { Subscription } from 'rxjs';
import { GoogleMap } from '@angular/google-maps';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss'],
  providers: [ MessageService ]
})
export class PropertyFormComponent {
  subscriptions: Subscription[] = [];
  propertyForm!: FormGroup;
  propertyId? : string;
  property! : Property;
  propertyTypes: PropertyType[] = [
    "Full Title",
    "Section Title",
    "Apartment",
    "Office"
  ];
  // we'll be using the same component for update and add.
  // variable to control certain elements depending on state
  isUpdate: boolean = true;

  mapOptions: google.maps.MapOptions = {
    center: { lat: -25.86453495678822, lng: 28.08851699601208 },
    zoom : 14
  }
  marker: any;

  @ViewChild('address')
  public addressElementRef!: ElementRef; // address input field. used for places
  @ViewChild('gmap') public map!: GoogleMap; // google maps html element. used for places


  constructor(private route: ActivatedRoute,
    private dataService: DataService,
    private messageService: MessageService,
    private loader: LoaderService,
    private errorDialog: ErrorDialogService,
    private router: Router,
    private geocodingService: GeocodingService,
    private ngZone: NgZone
  ){}

  ngOnInit() {
    this.propertyId = this.route.snapshot.paramMap.get('id')?? undefined;
    if (this.propertyId != undefined) {
      this.isUpdate = true;
      this.getPropertyDetails(this.propertyId)
    } else {
      this.isUpdate = false;
    }

    this.propertyForm = new FormGroup({
      description: new FormControl(this.property?.description??"", [ Validators.required ]),
      address: new FormControl(this.property?.address??"", [ Validators.required ]),
      unit: new FormControl(this.property?.unit_identifier??"", [ Validators.required ]),
      propertyType: new FormControl(this.property?.property_type??"", [ Validators.required ]),
      standSize: new FormControl(this.property?.stand_size??"", [ Validators.required ]),
      propertySize: new FormControl(this.property?.property_size??"", [ Validators.required ]),
      image: new FormControl(this.property?.image??"")
    });
  }

  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.addressElementRef.nativeElement
    );
    // Align search box to top
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.addressElementRef.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        //set latitude, longitude and zoom
        this.propertyForm.patchValue({
          address: place.formatted_address
        });
        // set marker to selected address
        this.marker = {
          position: {lat: place.geometry.location?.lat(),
            lng:place.geometry.location?.lng()
          }
        }
        this.mapOptions = {
          center: this.marker.position
        }
      });
    });
  }

  getPropertyDetails(propertyId: string) {
    this.loader.showLoader();
    this.subscriptions.push(
      this.dataService.getPropertyById(propertyId).subscribe({
        next: (res)=>{
          this.property = res;

          this.propertyForm.patchValue({
            description: this.property.description,
            address: this.property.address,
            unit: this.property.unit_identifier,
            propertyType: this.property.property_type,
            standSize: this.property.stand_size,
            propertySize: this.property.property_size,
            image: this.property.image
          });
          this.marker = {
            position : {lat: this.property.gps_lat!, lng: this.property.gps_lang!}
          }
          this.mapOptions = {
            center: this.marker.position ,
            zoom : 14
          }

          this.loader.hideLoader();
        },
        error: (error)=>{
          this.errorDialog.showError("Could not find property. Please add a new one.");
          this.isUpdate = false;
          this.loader.hideLoader();
        }
      })
    );

  }

  submitProperty() {
    if (this.propertyForm.valid && this.marker != undefined) {
      if (this.isUpdate) {
        this.updateProperty();
      } else {
        this.addProperty();
      }
    } else {
      this.errorDialog.showError('Some required field are empty. Please fill all fields before savigng')
    }

  }

  updateProperty() {
    this.property.description = this.propertyForm.controls['description'].value;
    this.property.address = this.propertyForm.controls['address'].value;
    this.property.property_size = this.propertyForm.controls['propertySize'].value;
    this.property.stand_size = this.propertyForm.controls['standSize'].value;
    this.property.unit_identifier = this.propertyForm.controls['unit'].value;
    this.property.property_type = this.propertyForm.controls['propertyType'].value;
    this.property.gps_lat = this.marker.position.lat;
    this.property.gps_lang = this.marker.position.lng;
    this.property.image = this.propertyForm.controls['image'].value;

    this.loader.showLoader();
    this.subscriptions.push(
      this.dataService.updateProperty(this.property).subscribe({
        next: (res) => {
          this.loader.hideLoader();
          this.router.navigate(['properties']);
        },
        error: (error) => {
          this.loader.hideLoader();
          this.errorDialog.showError(`Could not update dialog: \n ${error.message}`  );
        }
      })
    );
  }

  addProperty() {
    this.loader.showLoader();
    this.property = new Property(
      false,
      this.propertyForm.controls['description'].value,
      this.propertyForm.controls['image'].value,
      this.propertyForm.controls['address'].value,
      this.propertyForm.controls['unit'].value,
      this.propertyForm.controls['propertyType'].value,
      this.marker.position.lat,
      this.marker.position.lng,
      this.propertyForm.controls['standSize'].value,
      this.propertyForm.controls['propertySize'].value,

    );
    this.subscriptions.push(
      this.dataService.addProperty(this.property).subscribe({
        next: (res) => {
          this.loader.hideLoader();
          this.router.navigate(['properties']);
        },
        error: (error) => {
          this.loader.hideLoader();
          this.errorDialog.showError(`there was an error adding the property. \n ${error.message}` );
        }
      })
    );
  }

  onUpload( event: FileSelectEvent ){

    var reader = new FileReader();

    reader.onload =this.handleFile.bind(this);

    reader.readAsBinaryString(event.files[0]);

    // var url = this.dataService.uploadFileToFirebase(event.files[0]);
    // console.log('downloadurl: ' + url);
  }

  handleFile(event: any) {
    var binaryString = event.target.result;
    this.propertyForm.patchValue({
      image: btoa(binaryString)
    });
  }

  mapClicked(event: google.maps.MapMouseEvent){
    if (event.latLng != undefined) {

      this.geocodingService.geocodeLatLng({lat: event.latLng?.lat(), lng: event.latLng?.lng()}).then((res: GeocoderResponse)=> {
        if (res.status === 'OK' && res.results?.length) {
          const value = res.results[0];
          this.propertyForm.patchValue({
            address: value.formatted_address
          })
        }
      });

      this.marker = {
        position : {lat: event.latLng?.lat(), lng: event.latLng?.lng()}
      }
    }

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
