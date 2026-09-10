import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSalesSectionComponent } from './top-sales-section.component';

describe('TopSalesSectionComponent', () => {
  let component: TopSalesSectionComponent;
  let fixture: ComponentFixture<TopSalesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSalesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSalesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
