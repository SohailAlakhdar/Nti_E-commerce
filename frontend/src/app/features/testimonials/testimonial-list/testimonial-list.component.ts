import { Component, OnInit, inject, signal } from '@angular/core';
import { TestimonialService } from '../../../core/services/testimonial.service';
import { Testimonial } from '../../../core/models/content.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { TestimonialFormComponent } from '../testimonial-form/testimonial-form.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-testimonial-list',
  standalone: true,
  imports: [LoadingSpinnerComponent, EmptyStateComponent, TestimonialFormComponent, TranslatePipe],
  templateUrl: './testimonial-list.component.html',
  styleUrl: './testimonial-list.component.css'
})
export class TestimonialListComponent implements OnInit {
  private testimonialService = inject(TestimonialService);

  testimonials = signal<Testimonial[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.testimonialService.getApprovedTestimonials().subscribe({
      next: testimonials => {
        this.testimonials.set(testimonials);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
