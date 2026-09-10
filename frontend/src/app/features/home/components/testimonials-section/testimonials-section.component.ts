import { Component, OnInit, inject, signal } from '@angular/core';
import { TestimonialService } from '../../../../core/services/testimonial.service';
import { Testimonial } from '../../../../core/models/content.model';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [TranslatePipe, EmptyStateComponent],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.css'
})
export class TestimonialsSectionComponent implements OnInit {
  private testimonialService = inject(TestimonialService);
  testimonials = signal<Testimonial[]>([]);

  ngOnInit(): void {
    this.testimonialService.getApprovedTestimonials().subscribe({
      next: testimonials => this.testimonials.set(testimonials.slice(0, 3)),
      error: () => this.testimonials.set([])
    });
  }
}
