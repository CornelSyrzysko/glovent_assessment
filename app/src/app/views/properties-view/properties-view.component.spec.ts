import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesViewComponent } from './properties-view.component';

describe('PropertiesViewComponent', () => {
  let component: PropertiesViewComponent;
  let fixture: ComponentFixture<PropertiesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertiesViewComponent]
    });
    fixture = TestBed.createComponent(PropertiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
