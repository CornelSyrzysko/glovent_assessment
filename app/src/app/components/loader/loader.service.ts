import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoaderComponent } from './loader.component';


@Injectable({
  providedIn: 'root',
})
export class LoaderService { // This service is to control when the loader displays or doesn't

  // It's better to use a global service, where the service can check whether the loader is
  // displaying or not, to prevent loader instances from being stacked.

  loaderVisible : boolean = false;

  ref: DynamicDialogRef | undefined;

  constructor(public dialogService: DialogService) { }

  showLoader() {
    if (!this.loaderVisible) {
      this.loaderVisible = true;
      this.ref = this.dialogService.open(LoaderComponent, {
        closable: false,

      });
    }
  }

  hideLoader() {
    if (this.loaderVisible) {
      this.loaderVisible = false;
      this.ref?.close();
    }
  }
}
