import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { TRANSLATIONS } from '../../core/constants/translations';
import { AppLanguage } from '../../core/models/enums';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(key: string): string {
    const entry = TRANSLATIONS[key];
    if (!entry) {
      return key;
    }
    return this.languageService.currentLanguage() === AppLanguage.Arabic ? entry.ar : entry.en;
  }
}
