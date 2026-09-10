import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPoliciesEditComponent } from './admin-policies-edit.component';

describe('AdminPoliciesEditComponent', () => {
  let component: AdminPoliciesEditComponent;
  let fixture: ComponentFixture<AdminPoliciesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPoliciesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPoliciesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
