import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Discover } from './discover';

describe('Discover', () => {
  let component: Discover;
  let fixture: ComponentFixture<Discover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Discover]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Discover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
