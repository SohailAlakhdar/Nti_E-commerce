import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestimonialListComponent } from './admin-testimonial-list.component';

describe('AdminTestimonialListComponent', () => {
  let component: AdminTestimonialListComponent;
  let fixture: ComponentFixture<AdminTestimonialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTestimonialListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTestimonialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
