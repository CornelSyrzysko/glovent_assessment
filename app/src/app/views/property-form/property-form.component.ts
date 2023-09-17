import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from 'src/app/models/property';
import { DataService } from 'src/app/services/data-service.service';
import { PropertyType } from '../../models/property';
import {} from 'googlemaps';
import { LoaderService } from 'src/app/components/loader/loader.service';
import { ErrorDialogService } from 'src/app/components/error-dialog/error-dialog.service';
import { FileBeforeUploadEvent, FileSelectEvent, FileUploadEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss'],
  providers: [ MessageService ]
})
export class PropertyFormComponent {
  propertyForm!: FormGroup;
  propertyId? : string;
  property! : Property;
  propertyTypes: PropertyType[] = [
    "Full Title",
    "Section Title",
    "Apartment",
    "Office"
  ];

  chosenImage?: File;

  // we'll be using the same page for update and add.
  // variable to control certain elements depending on state
  isUpdate: boolean = true;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom : 14
  }
  marker = {
    position: { lat: 38.9987208, lng: -77.2538699 },
  }

  constructor(private route: ActivatedRoute,
    private dataService: DataService,
    private messageService: MessageService,
    private loader: LoaderService,
    private errorDialog: ErrorDialogService,
    private router: Router){}

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
    });
  }

  getPropertyDetails(propertyId: string) {
    this.loader.showLoader();
    this.dataService.getPropertyById(propertyId).subscribe({
      next: (res)=>{
        this.property = res;

        this.propertyForm.setValue({
          description: this.property.description,
          address: this.property.address,
          unit: this.property.unit_identifier,
          propertyType: this.property.property_type,
          standSize: this.property.stand_size,
          propertySize: this.property.property_size
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
  }

  submitProperty() {
    if (this.propertyForm.valid) {
      if (this.isUpdate) {
        this.updateProperty();
      } else {
        this.addProperty();
      }
    } else {
      console.warn('form invalid')
    }

  }

  updateProperty() {
    this.property.description = this.propertyForm.controls['description'].value;
    this.property.address = this.propertyForm.controls['address'].value;
    this.property.property_size = this.propertyForm.controls['propertySize'].value;
    this.property.stand_size = this.propertyForm.controls['standSize'].value;
    this.property.unit_identifier = this.propertyForm.controls['unit'].value;
    this.property.property_type = this.propertyForm.controls['propertyType'].value;

    this.loader.showLoader();
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
  }

  addProperty() {
    this.loader.showLoader();
    this.property = new Property(
      false,
      this.propertyForm.controls['description'].value,
      this.chosenImage!,
      this.propertyForm.controls['address'].value,
      this.propertyForm.controls['unit'].value,
      this.propertyForm.controls['propertyType'].value,
      0, 0,
      this.propertyForm.controls['standSize'].value,
      this.propertyForm.controls['propertySize'].value
    );

    console.log(this.property);
    this.dataService.addProperty(this.property).subscribe({
      next: (res) => {
        this.loader.hideLoader();

      },
      error: (error) => {

      }
    })
  }

  onUpload( event: FileSelectEvent ){
    console.log("UPLOAD EVENT: " +event.files[0].name);
    const formData = new FormData();
    formData.append('image', event.files[0]);
    this.chosenImage = event.files[0];
  }

}
