import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArrivalsSectionComponent } from './new-arrivals-section.component';

describe('NewArrivalsSectionComponent', () => {
  let component: NewArrivalsSectionComponent;
  let fixture: ComponentFixture<NewArrivalsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewArrivalsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewArrivalsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
