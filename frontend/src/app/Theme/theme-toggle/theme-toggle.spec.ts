import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  let component: ThemeToggle;
  let fixture: ComponentFixture<ThemeToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
