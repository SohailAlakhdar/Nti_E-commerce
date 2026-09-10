import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingService } from '../../../core/services/shipping.service';
import { ShippingPolicy } from '../../../core/models/content.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, TranslatePipe],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css'
})
export class ShippingComponent implements OnInit {
  private shippingService = inject(ShippingService);

  policy = signal<ShippingPolicy | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.shippingService.getShippingPolicy().subscribe({
      next: policy => {
        this.policy.set(policy);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
