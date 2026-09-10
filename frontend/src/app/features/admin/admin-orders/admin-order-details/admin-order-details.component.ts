import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Order } from '../../../../core/models/order.model';
import { OrderStatus } from '../../../../core/models/enums';
import { ORDER_STATUS_LABELS } from '../../../../core/constants/app.constants';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { OrderStatusBadgeComponent } from '../../../../shared/components/order-status-badge/order-status-badge.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ErrorStateComponent, OrderStatusBadgeComponent, ConfirmModalComponent],
  templateUrl: './admin-order-details.component.html',
  styleUrl: './admin-order-details.component.css'
})
export class AdminOrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);

  order = signal<Order | null>(null);
  loading = signal(true);
  error = signal(false);
  pendingStatus = signal<OrderStatus | null>(null);

  statusOptions = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
    value: Number(value) as OrderStatus,
    label: label.en
  }));

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.loading.set(true);
    this.error.set(false);
    this.adminService.getOrderById(id).subscribe({
      next: order => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  requestStatusChange(status: OrderStatus): void {
    if (status === this.order()?.status) {
      return;
    }
    this.pendingStatus.set(status);
  }

  cancelStatusChange(): void {
    this.pendingStatus.set(null);
  }

  confirmStatusChange(): void {
    const order = this.order();
    const status = this.pendingStatus();
    if (!order || status === null) {
      return;
    }
    this.adminService.updateOrderStatus(order.id, status).subscribe({
      next: updated => {
        this.order.set(updated);
        this.pendingStatus.set(null);
        this.notificationService.success('Order status updated');
      },
      error: () => {
        this.pendingStatus.set(null);
        this.notificationService.error('Unable to update order status');
      }
    });
  }
}
