import { Component, OnInit, inject, signal } from '@angular/core';
import { AddressService } from '../../../core/services/address.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Address, AddressPayload } from '../../../core/models/address.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { AddressFormComponent } from '../address-form/address-form.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [LoadingSpinnerComponent, EmptyStateComponent, ConfirmModalComponent, AddressFormComponent, TranslatePipe],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.css'
})
export class AddressListComponent implements OnInit {
  private addressService = inject(AddressService);
  private notificationService = inject(NotificationService);

  addresses = signal<Address[]>([]);
  loading = signal(true);
  showForm = signal(false);
  editingAddress = signal<Address | null>(null);
  deleteTarget = signal<Address | null>(null);

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.addressService.getAddresses().subscribe({
      next: addresses => {
        this.addresses.set(addresses);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openAddForm(): void {
    this.editingAddress.set(null);
    this.showForm.set(true);
  }

  openEditForm(address: Address): void {
    this.editingAddress.set(address);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingAddress.set(null);
  }

  save(payload: AddressPayload): void {
    const editing = this.editingAddress();
    const request = editing
      ? this.addressService.updateAddress(editing.id, payload)
      : this.addressService.createAddress(payload);

    request.subscribe({
      next: () => {
        this.notificationService.success('Address updated successfully');
        this.closeForm();
        this.fetch();
      },
      error: () => this.notificationService.error('Unable to save address')
    });
  }

  confirmDelete(address: Address): void {
    this.deleteTarget.set(address);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  deleteAddress(): void {
    const target = this.deleteTarget();
    if (!target) {
      return;
    }
    this.addressService.deleteAddress(target.id).subscribe({
      next: () => {
        this.deleteTarget.set(null);
        this.fetch();
      },
      error: () => this.notificationService.error('Unable to delete address')
    });
  }
}
