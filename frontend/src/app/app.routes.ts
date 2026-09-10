import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/home/home/home.component').then(m => m.HomeComponent) },
      { path: 'products', loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
      { path: 'products/:slug', loadComponent: () => import('./features/products/product-details/product-details.component').then(m => m.ProductDetailsComponent) },
      { path: 'men', loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent), data: { gender: 'MEN' } },
      { path: 'women', loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent), data: { gender: 'WOMEN' } },
      { path: 'new-arrivals', loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent), data: { view: 'new-arrivals' } },
      { path: 'top-sales', loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent), data: { view: 'top-sales' } },
      { path: 'cart', loadComponent: () => import('./features/cart/cart/cart.component').then(m => m.CartComponent) },
      { path: 'checkout', loadComponent: () => import('./features/checkout/checkout/checkout.component').then(m => m.CheckoutComponent) },
      { path: 'order-success/:id', loadComponent: () => import('./features/orders/order-success/order-success.component').then(m => m.OrderSuccessComponent) },
      { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent) },
      { path: 'orders/:id', canActivate: [authGuard], loadComponent: () => import('./features/orders/order-details/order-details.component').then(m => m.OrderDetailsComponent) },
      { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./features/profile/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'addresses', canActivate: [authGuard], loadComponent: () => import('./features/addresses/address-list/address-list.component').then(m => m.AddressListComponent) },
      { path: 'testimonials', loadComponent: () => import('./features/testimonials/testimonial-list/testimonial-list.component').then(m => m.TestimonialListComponent) },
      { path: 'shipping', loadComponent: () => import('./features/shipping/shipping/shipping.component').then(m => m.ShippingComponent) },
      { path: 'policies', loadComponent: () => import('./features/policies/policies/policies.component').then(m => m.PoliciesComponent) },
      { path: 'about', loadComponent: () => import('./features/about/about/about.component').then(m => m.AboutComponent) },
      { path: 'auth/login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'auth/register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) }
    ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'products', loadComponent: () => import('./features/admin/admin-products/admin-product-list/admin-product-list.component').then(m => m.AdminProductListComponent) },
      { path: 'products/add', loadComponent: () => import('./features/admin/admin-products/admin-product-form/admin-product-form.component').then(m => m.AdminProductFormComponent) },
      { path: 'products/:id/edit', loadComponent: () => import('./features/admin/admin-products/admin-product-form/admin-product-form.component').then(m => m.AdminProductFormComponent) },
      { path: 'products/:id', loadComponent: () => import('./features/admin/admin-products/admin-product-details/admin-product-details.component').then(m => m.AdminProductDetailsComponent) },
      { path: 'orders', loadComponent: () => import('./features/admin/admin-orders/admin-order-list/admin-order-list.component').then(m => m.AdminOrderListComponent) },
      { path: 'orders/:id', loadComponent: () => import('./features/admin/admin-orders/admin-order-details/admin-order-details.component').then(m => m.AdminOrderDetailsComponent) },
      { path: 'testimonials', loadComponent: () => import('./features/admin/admin-testimonials/admin-testimonial-list/admin-testimonial-list.component').then(m => m.AdminTestimonialListComponent) },
      { path: 'shipping', loadComponent: () => import('./features/admin/admin-shipping/admin-shipping-edit/admin-shipping-edit.component').then(m => m.AdminShippingEditComponent) },
      { path: 'policies', loadComponent: () => import('./features/admin/admin-policies/admin-policies-edit/admin-policies-edit.component').then(m => m.AdminPoliciesEditComponent) },
      { path: 'about', loadComponent: () => import('./features/admin/admin-about/admin-about-edit/admin-about-edit.component').then(m => m.AdminAboutEditComponent) },
      { path: 'reports', loadComponent: () => import('./features/admin/admin-reports/admin-reports/admin-reports.component').then(m => m.AdminReportsComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/admin-users/admin-user-list/admin-user-list.component').then(m => m.AdminUserListComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
