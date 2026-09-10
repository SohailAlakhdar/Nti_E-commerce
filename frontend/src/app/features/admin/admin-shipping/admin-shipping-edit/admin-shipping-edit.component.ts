import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShippingService } from '../../../../core/services/shipping.service';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-shipping-edit',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './admin-shipping-edit.component.html',
  styleUrl: './admin-shipping-edit.component.css'
})
export class AdminShippingEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private shippingService = inject(ShippingService);
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);

  loading = signal(true);
  saving = signal(false);

  form = this.fb.nonNullable.group({
    cost: [0, [Validators.required, Validators.min(0)]],
    estimatedDeliveryDays: ['', Validators.required],
    information: ['', Validators.required]
  });

  ngOnInit(): void {
    this.shippingService.getShippingPolicy().subscribe({
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
    this.adminService.updateShippingPolicy(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.notificationService.success('Shipping information updated');
      },
      error: () => {
        this.saving.set(false);
        this.notificationService.error('Something went wrong');
      }
    });
  }
}
