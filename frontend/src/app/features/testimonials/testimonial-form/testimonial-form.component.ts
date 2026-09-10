import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestimonialService } from '../../../core/services/testimonial.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-testimonial-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './testimonial-form.component.html',
  styleUrl: './testimonial-form.component.css'
})
export class TestimonialFormComponent {
  private fb = inject(FormBuilder);
  private testimonialService = inject(TestimonialService);
  private notificationService = inject(NotificationService);

  @Output() submitted = new EventEmitter<void>();

  submitting = signal(false);
  submittedOnce = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    message: ['', [Validators.required, Validators.maxLength(500)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.testimonialService.submitTestimonial(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submittedOnce.set(true);
        this.form.reset();
        this.submitted.emit();
      },
      error: () => {
        this.submitting.set(false);
        this.notificationService.error('Something went wrong');
      }
    });
  }
}
