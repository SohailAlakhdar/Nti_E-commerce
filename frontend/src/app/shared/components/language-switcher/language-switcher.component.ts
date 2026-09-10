import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { AppLanguage } from '../../../core/models/enums';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  languageService = inject(LanguageService);
  AppLanguage = AppLanguage;

  toggle(): void {
    this.languageService.toggleLanguage();
  }
}
