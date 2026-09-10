import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Product } from '../../../../core/models/product.model';
import { Pagination } from '../../../../core/models/api-response.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent, PaginationComponent, ConfirmModalComponent],
  templateUrl: './admin-product-list.component.html',
  styleUrl: './admin-product-list.component.css'
})
export class AdminProductListComponent implements OnInit {
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);

  result = signal<Pagination<Product> | null>(null);
  loading = signal(true);
  page = signal(1);
  deleteTarget = signal<Product | null>(null);

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.adminService.getProducts({ page: this.page(), limit: 10 }).subscribe({
      next: result => {
        this.result.set(result);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  toggleActive(product: Product): void {
    this.adminService.updateProduct(product.id, { isActive: !product.isActive }).subscribe({
      next: () => {
        this.notificationService.success(product.isActive ? 'Product frozen' : 'Product activated');
        this.fetch();
      },
      error: () => this.notificationService.error('Something went wrong')
    });
  }

  confirmDelete(product: Product): void {
    this.deleteTarget.set(product);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  deleteProduct(): void {
    const target = this.deleteTarget();
    if (!target) {
      return;
    }
    this.adminService.deleteProduct(target.id).subscribe({
      next: () => {
        this.deleteTarget.set(null);
        this.fetch();
      },
      error: () => this.notificationService.error('Unable to delete product')
    });
  }
}
