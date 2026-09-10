import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { Order } from '../../../../core/models/order.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { OrderStatusBadgeComponent } from '../../../../shared/components/order-status-badge/order-status-badge.component';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent, OrderStatusBadgeComponent],
  templateUrl: './admin-order-list.component.html',
  styleUrl: './admin-order-list.component.css'
})
export class AdminOrderListComponent implements OnInit {
  private adminService = inject(AdminService);

  orders = signal<Order[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.adminService.getOrders().subscribe({
      next: orders => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
