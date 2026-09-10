import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PolicyService } from '../../../../core/services/policy.service';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-policies-edit',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './admin-policies-edit.component.html',
  styleUrl: './admin-policies-edit.component.css'
})
export class AdminPoliciesEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private policyService = inject(PolicyService);
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);

  loading = signal(true);
  saving = signal(false);

  form = this.fb.nonNullable.group({
    returnPolicy: ['', Validators.required],
    exchangePolicy: ['', Validators.required],
    privacyPolicy: ['', Validators.required],
    termsAndConditions: ['', Validators.required]
  });

  ngOnInit(): void {
    this.policyService.getPolicies().subscribe({
      next: policy => {
        this.form.patchValue(policy);
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
    this.adminService.updatePolicies(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.notificationService.success('Policies updated');
      },
      error: () => {
        this.saving.set(false);
        this.notificationService.error('Something went wrong');
      }
    });
  }
}
