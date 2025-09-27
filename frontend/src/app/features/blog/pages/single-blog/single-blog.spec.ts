import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBlog } from './single-blog';

describe('SingleBlog', () => {
  let component: SingleBlog;
  let fixture: ComponentFixture<SingleBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleBlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
