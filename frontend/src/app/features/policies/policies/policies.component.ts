import { Component, OnInit, inject, signal } from '@angular/core';
import { PolicyService } from '../../../core/services/policy.service';
import { Policy } from '../../../core/models/content.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [LoadingSpinnerComponent, TranslatePipe],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css'
})
export class PoliciesComponent implements OnInit {
  private policyService = inject(PolicyService);

  policy = signal<Policy | null>(null);
  loading = signal(true);
  activeTab = signal<'return' | 'exchange' | 'privacy' | 'terms'>('return');

  ngOnInit(): void {
    this.policyService.getPolicies().subscribe({
      next: policy => {
        this.policy.set(policy);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
