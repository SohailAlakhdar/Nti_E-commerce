import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShippingEditComponent } from './admin-shipping-edit.component';

describe('AdminShippingEditComponent', () => {
  let component: AdminShippingEditComponent;
  let fixture: ComponentFixture<AdminShippingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminShippingEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShippingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
