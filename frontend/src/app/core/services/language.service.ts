import { Injectable, signal } from '@angular/core';
import { AppLanguage } from '../models/enums';
import { LANGUAGE_STORAGE_KEY } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly currentLanguage = signal<AppLanguage>(this.readStoredLanguage());

  constructor() {
    this.applyDirection(this.currentLanguage());
  }

  setLanguage(language: AppLanguage): void {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    this.currentLanguage.set(language);
    this.applyDirection(language);
  }

  toggleLanguage(): void {
    const next = this.currentLanguage() === AppLanguage.English ? AppLanguage.Arabic : AppLanguage.English;
    this.setLanguage(next);
  }

  isRtl(): boolean {
    return this.currentLanguage() === AppLanguage.Arabic;
  }

  private readStoredLanguage(): AppLanguage {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === AppLanguage.Arabic ? AppLanguage.Arabic : AppLanguage.English;
  }

  private applyDirection(language: AppLanguage): void {
    const isArabic = language === AppLanguage.Arabic;
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
  }
}
