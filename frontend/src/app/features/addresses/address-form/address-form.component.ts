import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address, AddressPayload } from '../../../core/models/address.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent implements OnChanges {
  @Input() address: Address | null = null;
  @Output() save = new EventEmitter<AddressPayload>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    city: ['', Validators.required],
    area: ['', Validators.required],
    street: ['', Validators.required],
    building: ['', Validators.required],
    floor: [''],
    apartment: [''],
    notes: ['']
  });

  ngOnChanges(): void {
    if (this.address) {
      this.form.patchValue(this.address);
    } else {
      this.form.reset();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue());
  }
}
