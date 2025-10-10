import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildBlog } from './child-blog';

describe('ChildBlog', () => {
  let component: ChildBlog;
  let fixture: ComponentFixture<ChildBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildBlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildBlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
