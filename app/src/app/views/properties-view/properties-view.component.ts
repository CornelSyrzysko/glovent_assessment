import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data-service.service';
import { Property } from '../../models/property';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { LoaderService } from 'src/app/components/loader/loader.service';
import { ErrorDialogService } from 'src/app/components/error-dialog/error-dialog.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-properties-view',
  templateUrl: './properties-view.component.html',
  styleUrls: ['./properties-view.component.scss'],
  providers: [ConfirmationService]
})
export class PropertiesViewComponent {
  errorMessage: string = "";

  properties!: Property[];

  searchValue: string= "";
  debounceTime = 500;

  inputValue = new Subject<string>();

  // this is a trigger for when a user types into the search input field.
  trigger = this.inputValue.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  );

  subscriptions: Subscription[] = [];

  constructor( private dataService: DataService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private loader: LoaderService,
    private errorDialog: ErrorDialogService,
    private _sanitizer: DomSanitizer
    ) {}

  ngOnInit() {
    this.loader.showLoader();
    const subscription = this.trigger.subscribe(currentValue => { // since we are subscribing to something that might not end,
      this.filterProperties(currentValue);
    });
    this.subscriptions.push(subscription);

    this.getProperties();
  }

  getProperties() {
    this.dataService.getProperties().subscribe({ // trigger the endpoint to get all the properties
      next: (res)=> {
        this.properties = res.filter((el)=>{return !el.deleted}); // only get the properties not marked as deleted
                                                          // normally this filtering will be done by the backend
        this.loader.hideLoader();
        console.log('result: ' + this.properties);
      },
      error: (error) => { // if the api returns an error.
        // this.isLoading = false;
        this.errorMessage = error;
        console.log(this.errorMessage);
      }
    });
  }

  // AIzaSyDnQa98YaobrBBL2FX_RX1iRPaLgs643qc


  onInput(e: any) {
    this.inputValue.next(e.target.value);
  }

  filterProperties(value: string) {
    //this can also be done by filtering local data. Our backend allows for easy, effortless filtering so we'll use that
    this.dataService.filterProperties(value).subscribe({
      next: (res)=> {
        this.properties = res.filter((el)=>{return !el.deleted});;
      },
      error: (error) => {

      }
    })
  }

  editProperty(propertyID: number) {
    // this.
  }

  deleteProperty(propertyDetails: Property) {
    console.log('show confirmation');
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this property?",
      header: "Delete Property",
      icon: 'pi pi-question-circle',
      accept: () => {
        this.loader.showLoader();
        propertyDetails.deleted = true;
        this.dataService.deleteProperty(propertyDetails).subscribe({
          next: (res) => {
            console.log('property deleted')
            this.getProperties();
          },
          error: (error: Error) => {
            console.error(`error message : ${error.message}`);
            this.loader.hideLoader();
            this.errorDialog.showError('Failed to delete property.')
          }
        })
      }
    });


  }

  addProperty () {
    this.router.navigate(['/add-property', 'add'])
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


}
