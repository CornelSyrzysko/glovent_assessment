import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {

  message?: string;

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef) {
    this.message = config.data.message;
  }

  closeDialog() {
    this.ref.close();
  }

}
