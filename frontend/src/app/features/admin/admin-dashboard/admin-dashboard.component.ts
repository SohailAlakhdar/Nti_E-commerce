import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../core/services/report.service';
import { ReportOverview } from '../../../core/models/content.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private reportService = inject(ReportService);

  overview = signal<ReportOverview | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.reportService.getOverview().subscribe({
      next: overview => {
        this.overview.set(overview);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
