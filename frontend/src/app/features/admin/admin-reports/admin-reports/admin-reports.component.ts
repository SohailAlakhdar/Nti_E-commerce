import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../../core/services/report.service';
import { CategoryReport, SalesByPeriod, TopProductReport } from '../../../../core/models/content.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.css'
})
export class AdminReportsComponent implements OnInit {
  private reportService = inject(ReportService);

  sales = signal<SalesByPeriod[]>([]);
  topProducts = signal<TopProductReport[]>([]);
  categories = signal<CategoryReport[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.reportService.getSales().subscribe(sales => this.sales.set(sales));
    this.reportService.getTopProducts().subscribe(topProducts => this.topProducts.set(topProducts));
    this.reportService.getCategoryBreakdown().subscribe({
      next: categories => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  maxSales(): number {
    return Math.max(1, ...this.sales().map(item => item.total));
  }

  maxCategoryUnits(): number {
    return Math.max(1, ...this.categories().map(item => item.unitsSold));
  }

  barHeight(value: number, max: number): string {
    return `${Math.max(4, Math.round((value / max) * 100))}%`;
  }
}
