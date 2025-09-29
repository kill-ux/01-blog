import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProfile } from './dialog-profile';

describe('DialogProfile', () => {
  let component: DialogProfile;
  let fixture: ComponentFixture<DialogProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
