import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogHome } from './blog-home';

describe('BlogHome', () => {
  let component: BlogHome;
  let fixture: ComponentFixture<BlogHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
