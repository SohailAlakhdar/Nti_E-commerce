import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AddressService } from '../../../core/services/address.service';
import { OrderService } from '../../../core/services/order.service';
import { ShippingService } from '../../../core/services/shipping.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Cart } from '../../../core/models/cart.model';
import { Address, AddressPayload } from '../../../core/models/address.model';
import { ShippingPolicy } from '../../../core/models/content.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AddressFormComponent } from '../../addresses/address-form/address-form.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent, AddressFormComponent, TranslatePipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private addressService = inject(AddressService);
  private orderService = inject(OrderService);
  private shippingService = inject(ShippingService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  cart = signal<Cart | null>(null);
  addresses = signal<Address[]>([]);
  shippingPolicy = signal<ShippingPolicy | null>(null);
  loading = signal(true);
  submitting = signal(false);
  selectedAddressId = signal<string | null>(null);
  useNewAddress = signal(false);
  newAddress = signal<AddressPayload | null>(null);

  customerForm = this.fb.nonNullable.group({
    customerName: ['', Validators.required],
    customerPhone: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.cartService.loadCart().subscribe(cart => this.cart.set(cart));
    this.shippingService.getShippingPolicy().subscribe(policy => this.shippingPolicy.set(policy));

    if (this.authService.isAuthenticated()) {
      this.addressService.getAddresses().subscribe({
        next: addresses => {
          this.addresses.set(addresses);
          if (addresses.length === 0) {
            this.useNewAddress.set(true);
          } else {
            this.selectedAddressId.set(addresses[0].id);
          }
          this.loading.set(false);
        },
        error: () => {
          this.useNewAddress.set(true);
          this.loading.set(false);
        }
      });
    } else {
      this.useNewAddress.set(true);
      this.loading.set(false);
    }
  }

  get shippingCost(): number {
    return this.shippingPolicy()?.cost ?? 0;
  }

  get total(): number {
    return (this.cart()?.total ?? 0) + this.shippingCost;
  }

  onAddressFormSave(payload: AddressPayload): void {
    this.newAddress.set(payload);
  }

  selectAddress(id: string): void {
    this.selectedAddressId.set(id);
    this.useNewAddress.set(false);
  }

  toggleNewAddress(): void {
    this.useNewAddress.set(true);
    this.selectedAddressId.set(null);
  }

  placeOrder(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    if (!this.cart() || this.cart()!.items.length === 0) {
      this.notificationService.error('Order creation failed');
      return;
    }
    if (this.useNewAddress() && !this.newAddress()) {
      this.notificationService.error('Please fill in your address');
      return;
    }
    if (!this.useNewAddress() && !this.selectedAddressId()) {
      this.notificationService.error('Please select an address');
      return;
    }

    this.submitting.set(true);
    const payload = {
      ...this.customerForm.getRawValue(),
      addressId: this.useNewAddress() ? undefined : (this.selectedAddressId() ?? undefined),
      address: this.useNewAddress() ? (this.newAddress() ?? undefined) : undefined
    };

    this.orderService.createOrder(payload).subscribe({
      next: order => {
        this.notificationService.success('Order created successfully');
        this.router.navigate(['/order-success', order.id]);
      },
      error: () => {
        this.notificationService.error('Order creation failed');
        this.submitting.set(false);
      }
    });
  }
}
