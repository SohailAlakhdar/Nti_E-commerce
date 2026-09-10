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
  selector: 'app-new-arrivals-section',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, LoadingSpinnerComponent, TranslatePipe],
  templateUrl: './new-arrivals-section.component.html',
  styleUrl: './new-arrivals-section.component.css'
})
export class NewArrivalsSectionComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  products = signal<Product[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.productService.getNewArrivals().subscribe({
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
