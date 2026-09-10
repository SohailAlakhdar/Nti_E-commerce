import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GENDER_OPTIONS, SUBCATEGORY_OPTIONS } from '../../../../core/constants/app.constants';
import { LanguageService } from '../../../../core/services/language.service';
import { AppLanguage } from '../../../../core/models/enums';
import { inject } from '@angular/core';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

export interface ProductFilterValue {
  gender?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.css'
})
export class ProductFiltersComponent {
  @Input() filters: ProductFilterValue = {};
  @Output() filtersChange = new EventEmitter<ProductFilterValue>();

  private languageService = inject(LanguageService);

  genderOptions = GENDER_OPTIONS;
  subCategoryOptions = SUBCATEGORY_OPTIONS;

  labelFor(entry: { en: string; ar: string }): string {
    return this.languageService.currentLanguage() === AppLanguage.Arabic ? entry.ar : entry.en;
  }

  update(partial: Partial<ProductFilterValue>): void {
    this.filtersChange.emit({ ...this.filters, ...partial });
  }

  clear(): void {
    this.filtersChange.emit({});
  }
}
