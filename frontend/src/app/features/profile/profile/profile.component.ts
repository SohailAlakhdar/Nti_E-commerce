import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  saving = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: [{ value: '', disabled: true }],
    phone: ['']
  });

  ngOnInit(): void {
    this.authService.loadCurrentUser().subscribe(user => {
      if (user) {
        this.form.patchValue(user);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.notificationService.success('Profile updated successfully');
    }, 400);
  }
}
