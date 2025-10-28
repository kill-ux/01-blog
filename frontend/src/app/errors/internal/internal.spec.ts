import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Internal } from './internal';

describe('Internal', () => {
  let component: Internal;
  let fixture: ComponentFixture<Internal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Internal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Internal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
