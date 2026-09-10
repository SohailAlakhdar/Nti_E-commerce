import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.css'
})
export class ErrorStateComponent {
  @Input() message = 'Something went wrong';
  @Output() retry = new EventEmitter<void>();
}
