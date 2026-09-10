import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: number;
  variant: ToastVariant;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nextId = 1;
  readonly toasts = signal<ToastMessage[]>([]);

  success(message: string): void {
    this.push('success', message);
  }

  error(message: string): void {
    this.push('error', message);
  }

  warning(message: string): void {
    this.push('warning', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(toast => toast.id !== id));
  }

  private push(variant: ToastVariant, message: string): void {
    const toast: ToastMessage = { id: this.nextId++, variant, message };
    this.toasts.update(list => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), 4000);
  }
}
