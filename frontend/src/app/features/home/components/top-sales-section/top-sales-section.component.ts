import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Product } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-top-sales-section',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, LoadingSpinnerComponent, TranslatePipe],
  templateUrl: './top-sales-section.component.html',
  styleUrl: './top-sales-section.component.css'
})
export class TopSalesSectionComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  products = signal<Product[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.productService.getTopSales().subscribe({
      next: products => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onAddToCart(product: Product): void {
    this.cartService.addItem({ productId: product.id, quantity: 1 }).subscribe({
      next: () => this.notificationService.success('Product added to cart'),
      error: () => this.notificationService.error('Product is out of stock')
    });
  }
}
