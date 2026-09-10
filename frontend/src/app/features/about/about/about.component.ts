import { Component, OnInit, inject, signal } from '@angular/core';
import { AboutService } from '../../../core/services/about.service';
import { AboutContent } from '../../../core/models/content.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LoadingSpinnerComponent, TranslatePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  private aboutService = inject(AboutService);

  about = signal<AboutContent | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.aboutService.getAbout().subscribe({
      next: about => {
        this.about.set(about);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
