import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ErrorDialogComponent } from './error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {

  ref: DynamicDialogRef | undefined;

  constructor( private dialogService: DialogService) { }

  showError(errorMessage: string) {
    this.ref = this.dialogService.open(ErrorDialogComponent, {
      data: {
        message: errorMessage
      }
    })
  }
}
