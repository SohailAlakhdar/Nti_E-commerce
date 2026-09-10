import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [LanguageSwitcherComponent],
  templateUrl: './admin-topbar.component.html',
  styleUrl: './admin-topbar.component.css'
})
export class AdminTopbarComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
