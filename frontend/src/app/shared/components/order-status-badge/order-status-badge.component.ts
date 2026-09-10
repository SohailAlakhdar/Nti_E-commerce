import { Component, Input, inject } from '@angular/core';
import { OrderStatus } from '../../../core/models/enums';
import { ORDER_STATUS_LABELS } from '../../../core/constants/app.constants';
import { LanguageService } from '../../../core/services/language.service';
import { AppLanguage } from '../../../core/models/enums';

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  imports: [],
  templateUrl: './order-status-badge.component.html',
  styleUrl: './order-status-badge.component.css'
})
export class OrderStatusBadgeComponent {
  @Input({ required: true }) status!: OrderStatus;
  private languageService = inject(LanguageService);

  get label(): string {
    const entry = ORDER_STATUS_LABELS[this.status];
    return this.languageService.currentLanguage() === AppLanguage.Arabic ? entry.ar : entry.en;
  }

  get variant(): string {
    return ORDER_STATUS_LABELS[this.status].variant;
  }
}
