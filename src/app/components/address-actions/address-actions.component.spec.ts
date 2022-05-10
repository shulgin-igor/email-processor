import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressActionsComponent } from './address-actions.component';

describe('AddressActionsComponent', () => {
  let component: AddressActionsComponent;
  let fixture: ComponentFixture<AddressActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
