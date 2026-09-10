import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product, isProductPurchasable } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorStateComponent, TranslatePipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal(false);
  activeImage = signal(0);
  quantity = signal(1);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.fetch(slug);
    }
  }

  fetch(slug: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.productService.getProductBySlug(slug).subscribe({
      next: product => {
        this.product.set(product);
        this.quantity.set(1);
        this.activeImage.set(0);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  get purchasable(): boolean {
    const product = this.product();
    return !!product && isProductPurchasable(product);
  }

  increaseQuantity(): void {
    const product = this.product();
    if (!product) {
      return;
    }
    this.quantity.update(value => Math.min(value + 1, product.stock));
  }

  decreaseQuantity(): void {
    this.quantity.update(value => Math.max(1, value - 1));
  }

  addToCart(): void {
    const product = this.product();
    if (!product || !this.purchasable) {
      return;
    }
    this.cartService.addItem({ productId: product.id, quantity: this.quantity() }).subscribe({
      next: () => this.notificationService.success('Product added to cart'),
      error: () => this.notificationService.error('Product is out of stock')
    });
  }

  retry(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.fetch(slug);
    }
  }
}
