import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[appBackButton]'
})
export class BackButtonDirective {
  // Can be added to any button to make it a back button
  constructor(private location: Location) { }

    @HostListener('click')
    onClick() {
        this.location.back();
    }

}
