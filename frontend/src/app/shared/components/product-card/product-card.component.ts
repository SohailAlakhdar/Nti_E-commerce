import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, isProductPurchasable } from '../../../core/models/product.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  get purchasable(): boolean {
    return isProductPurchasable(this.product);
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.purchasable) {
      this.addToCart.emit(this.product);
    }
  }
}
