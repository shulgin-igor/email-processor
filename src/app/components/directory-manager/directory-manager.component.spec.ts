import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryManagerComponent } from './directory-manager.component';

describe('DirectoryManagerComponent', () => {
  let component: DirectoryManagerComponent;
  let fixture: ComponentFixture<DirectoryManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectoryManagerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
