import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  let component: GlobalErrorHandler;
  let fixture: ComponentFixture<GlobalErrorHandler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalErrorHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalErrorHandler);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
