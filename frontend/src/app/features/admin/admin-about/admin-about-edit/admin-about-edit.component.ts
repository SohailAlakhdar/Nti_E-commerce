import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AboutService } from '../../../../core/services/about.service';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-about-edit',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './admin-about-edit.component.html',
  styleUrl: './admin-about-edit.component.css'
})
export class AdminAboutEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private aboutService = inject(AboutService);
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);

  loading = signal(true);
  saving = signal(false);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    mission: ['']
  });

  ngOnInit(): void {
    this.aboutService.getAbout().subscribe({
      next: about => {
        this.form.patchValue(about);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.adminService.updateAbout(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.notificationService.success('About content updated');
      },
      error: () => {
        this.saving.set(false);
        this.notificationService.error('Something went wrong');
      }
    });
  }
}
