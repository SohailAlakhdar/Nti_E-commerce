import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/product.model';
import { Pagination, ProductQueryParams } from '../../../core/models/api-response.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchBoxComponent } from '../../../shared/components/search-box/search-box.component';
import { ProductFiltersComponent, ProductFilterValue } from '../components/product-filters/product-filters.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    ProductCardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    PaginationComponent,
    SearchBoxComponent,
    ProductFiltersComponent,
    TranslatePipe
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  result = signal<Pagination<Product> | null>(null);
  loading = signal(true);
  error = signal(false);
  search = signal('');
  filters = signal<ProductFilterValue>({});
  page = signal(1);
  fixedGender: string | undefined;

  ngOnInit(): void {
    this.fixedGender = this.route.snapshot.data['gender'];

    this.route.queryParamMap.subscribe(params => {
      this.search.set(params.get('search') || '');
      this.page.set(Number(params.get('page')) || 1);
      this.filters.set({
        gender: this.fixedGender || params.get('gender') || undefined,
        subCategory: params.get('subCategory') || undefined,
        minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
        maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined
      });
      this.fetchProducts();
    });
  }

  onSearchChange(value: string): void {
    this.updateQueryParams({ search: value, page: 1 });
  }

  onFiltersChange(filters: ProductFilterValue): void {
    this.updateQueryParams({ ...filters, page: 1 });
  }

  onPageChange(page: number): void {
    this.updateQueryParams({ page });
  }

  retry(): void {
    this.fetchProducts();
  }

  private updateQueryParams(partial: Record<string, unknown>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: partial,
      queryParamsHandling: 'merge'
    });
  }

  private fetchProducts(): void {
    this.loading.set(true);
    this.error.set(false);
    const query: ProductQueryParams = {
      page: this.page(),
      limit: 12,
      search: this.search() || undefined,
      gender: this.filters().gender,
      subCategory: this.filters().subCategory,
      minPrice: this.filters().minPrice,
      maxPrice: this.filters().maxPrice
    };
    this.productService.getProducts(query).subscribe({
      next: result => {
        this.result.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  onAddToCart(product: Product): void {
    this.cartService.addItem({ productId: product.id, quantity: 1 }).subscribe({
      next: () => this.notificationService.success('Product added to cart'),
      error: () => this.notificationService.error('Product is out of stock')
    });
  }
}
