import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAboutEditComponent } from './admin-about-edit.component';

describe('AdminAboutEditComponent', () => {
  let component: AdminAboutEditComponent;
  let fixture: ComponentFixture<AdminAboutEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAboutEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAboutEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
