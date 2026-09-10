import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.css'
})
export class CategoriesSectionComponent {
}
