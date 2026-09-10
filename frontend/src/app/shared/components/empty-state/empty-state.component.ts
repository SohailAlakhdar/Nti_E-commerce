import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  @Input() icon = 'bi-inbox';
  @Input() message = 'Nothing here yet';
  @Input() actionLabel?: string;
  @Input() actionLink?: string;
}
