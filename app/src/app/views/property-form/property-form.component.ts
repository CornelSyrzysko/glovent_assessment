import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Property } from 'src/app/models/property';
import { DataService } from 'src/app/services/data-service.service';
import { PropertyType } from '../../models/property';
import {} from 'googlemaps';


@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent {
  isLoading : boolean = true;
  propertyForm!: FormGroup;

  propertyId! : string;

  property! : Property;

  propertyTypes: PropertyType[] = [
    "Full Title",
    "Section Title",
    "Apartment",
    "Office"
  ];

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


  constructor(private route: ActivatedRoute, private dataService: DataService){}

  ngOnInit() {

    this.propertyId = this.route.snapshot.paramMap.get('id')??'add';
    if (this.propertyId != 'add') {
      this.isUpdate = true;
      this.dataService.getPropertyById(this.propertyId).subscribe({
        next: (res)=>{
          // this.property = res;
          this.isLoading = false;
        },
        error: (error)=>{}
      })
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

    console.log(this.propertyTypes);
  }

  ngAfterViewInit() {

  }

  addProperty() {
    if (this.propertyForm.valid) {
      // this.property?.description = this.propertyForm;
    }
  }

  updateProperty() {
    if (this.propertyForm.valid) {}
  }

}




