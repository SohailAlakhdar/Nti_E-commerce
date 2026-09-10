import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { Product } from '../../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-admin-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorStateComponent],
  templateUrl: './admin-product-details.component.html',
  styleUrl: './admin-product-details.component.css'
})
export class AdminProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);

  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal(false);

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
    this.adminService.getProductById(id).subscribe({
      next: product => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
