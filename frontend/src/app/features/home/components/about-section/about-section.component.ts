import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AboutService } from '../../../../core/services/about.service';
import { AboutContent } from '../../../../core/models/content.model';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.css'
})
export class AboutSectionComponent implements OnInit {
  private aboutService = inject(AboutService);
  about = signal<AboutContent | null>(null);

  ngOnInit(): void {
    this.aboutService.getAbout().subscribe({
      next: about => this.about.set(about),
      error: () => this.about.set(null)
    });
  }
}
