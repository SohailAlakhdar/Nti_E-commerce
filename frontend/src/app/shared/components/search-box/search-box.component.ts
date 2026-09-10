import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnDestroy {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  private inputSubject = new Subject<string>();
  private subscription = this.inputSubject.pipe(debounceTime(350), distinctUntilChanged()).subscribe(value => {
    this.valueChange.emit(value);
  });

  onInput(value: string): void {
    this.value = value;
    this.inputSubject.next(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
