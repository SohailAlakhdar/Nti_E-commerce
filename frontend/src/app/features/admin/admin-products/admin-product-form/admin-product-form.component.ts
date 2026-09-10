import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { GENDER_OPTIONS, SUBCATEGORY_OPTIONS } from '../../../../core/constants/app.constants';
import { Product } from '../../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, TranslatePipe],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.css'
})
export class AdminProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  genderOptions = GENDER_OPTIONS;
  subCategoryOptions = SUBCATEGORY_OPTIONS;

  productId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);
  uploading = signal(false);
  uploadError = signal(false);
  existingImages = signal<string[]>([]);
  pendingFiles = signal<File[]>([]);
  pendingPreviews = signal<string[]>([]);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    gender: [this.genderOptions[0].value, Validators.required],
    subCategory: [this.subCategoryOptions[0].value, Validators.required],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId.set(id);
      this.loading.set(true);
      this.adminService.getProductById(id).subscribe({
        next: (product: Product) => {
          this.form.patchValue(product);
          this.existingImages.set(product.images);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.pendingFiles.update(list => [...list, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.pendingPreviews.update(list => [...list, reader.result as string]);
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removePendingImage(index: number): void {
    this.pendingFiles.update(list => list.filter((_, i) => i !== index));
    this.pendingPreviews.update(list => list.filter((_, i) => i !== index));
  }

  removeExistingImage(url: string): void {
    const id = this.productId();
    if (!id) {
      return;
    }
    this.adminService.deleteProductImage(id, url).subscribe({
      next: product => this.existingImages.set(product.images),
      error: () => this.notificationService.error('Unable to delete image')
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const payload = this.form.getRawValue();
    const id = this.productId();

    const request = id
      ? this.adminService.updateProduct(id, payload)
      : this.adminService.createProduct({ ...payload, images: [] });

    request.subscribe({
      next: (product: Product) => {
        if (this.pendingFiles().length > 0) {
          this.uploadImages(product.id);
        } else {
          this.finishSave();
        }
      },
      error: () => {
        this.saving.set(false);
        this.notificationService.error('Something went wrong');
      }
    });
  }

  private uploadImages(productId: string): void {
    this.uploading.set(true);
    this.uploadError.set(false);
    this.adminService.uploadProductImages(productId, this.pendingFiles()).subscribe({
      next: () => {
        this.uploading.set(false);
        this.finishSave();
      },
      error: () => {
        this.uploading.set(false);
        this.uploadError.set(true);
        this.saving.set(false);
      }
    });
  }

  private finishSave(): void {
    this.saving.set(false);
    this.notificationService.success('Product saved successfully');
    this.router.navigateByUrl('/admin/products');
  }
}
