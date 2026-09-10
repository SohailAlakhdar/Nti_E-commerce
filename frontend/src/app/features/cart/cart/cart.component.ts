import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Cart, CartItem } from '../../../core/models/cart.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  cart = signal<Cart | null>(null);
  loading = signal(true);
  error = signal(false);
  updatingItemId = signal<string | null>(null);

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.error.set(false);
    this.cartService.loadCart().subscribe({
      next: cart => {
        this.cart.set(cart);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity >= item.product.stock) {
      this.notificationService.warning('No more stock available');
      return;
    }
    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      return;
    }
    this.updateQuantity(item, item.quantity - 1);
  }

  private updateQuantity(item: CartItem, quantity: number): void {
    this.updatingItemId.set(item.itemId);
    this.cartService.updateItem(item.itemId, { quantity }).subscribe({
      next: cart => {
        this.cart.set(cart);
        this.updatingItemId.set(null);
      },
      error: () => {
        this.notificationService.error('Unable to update quantity');
        this.updatingItemId.set(null);
      }
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.itemId).subscribe({
      next: cart => {
        this.cart.set(cart);
        this.notificationService.info('Product removed from cart');
      },
      error: () => this.notificationService.error('Unable to remove product')
    });
  }
}
