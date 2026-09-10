import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Testimonial } from '../../../../core/models/content.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-testimonial-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent, ConfirmModalComponent],
  templateUrl: './admin-testimonial-list.component.html',
  styleUrl: './admin-testimonial-list.component.css'
})
export class AdminTestimonialListComponent implements OnInit {
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);

  testimonials = signal<Testimonial[]>([]);
  loading = signal(true);
  deleteTarget = signal<Testimonial | null>(null);

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.adminService.getTestimonials().subscribe({
      next: testimonials => {
        this.testimonials.set(testimonials);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  approve(testimonial: Testimonial): void {
    this.adminService.approveTestimonial(testimonial.id).subscribe({
      next: () => {
        this.notificationService.success('Testimonial approved');
        this.fetch();
      },
      error: () => this.notificationService.error('Something went wrong')
    });
  }

  confirmDelete(testimonial: Testimonial): void {
    this.deleteTarget.set(testimonial);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  deleteTestimonial(): void {
    const target = this.deleteTarget();
    if (!target) {
      return;
    }
    this.adminService.deleteTestimonial(target.id).subscribe({
      next: () => {
        this.deleteTarget.set(null);
        this.fetch();
      },
      error: () => this.notificationService.error('Unable to delete testimonial')
    });
  }
}
