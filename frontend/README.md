# FRAY — Youth Fashion E-Commerce Frontend

Angular 18 (standalone components) + Bootstrap frontend for a youth fashion clothing store, built against the REST API contract described in the project spec.

## Stack
- Angular 18, TypeScript, RxJS
- Bootstrap 5 + Bootstrap Icons
- Standalone components, functional guards/interceptors
- Reactive Forms for all non-trivial forms
- Signals for local component/service state

## Getting started

```bash
npm install
npm start          # ng serve, http://localhost:4200
```

Configure your backend URL in:
- `src/environments/environment.development.ts` (used by `ng serve` / dev build)
- `src/environments/environment.ts` (used by production builds)

Both just expose `apiUrl`, e.g. `http://localhost:5000/api/v1`.

```bash
npm run build       # production build to dist/fashion-store
```

## Project layout

```
src/app/
├── core/            # guards, interceptors, services, models, constants — app-wide, no UI
├── shared/          # reusable UI components, pipes, directives
├── layout/          # navbar, footer, main-layout, admin sidebar/topbar/layout
├── features/        # one folder per route area (home, products, cart, checkout,
│                       addresses, orders, profile, auth, testimonials, policies,
│                       shipping, about, admin/*)
├── app.routes.ts     # lazy-loaded route tree, customer + admin sections
├── app.config.ts     # providers: router, HttpClient + auth interceptor
└── app.ts            # root shell (router-outlet + toast host)
```

Every component follows the required 4-file structure (`.ts` / `.html` / `.css` / `.spec.ts`), no inline templates or styles, and no comments in source.

## Notable implementation details

- **Auth**: `AuthService` stores access/refresh tokens in `localStorage`; `authInterceptor`
  attaches the bearer token and retries once via refresh on a 401 before redirecting to login.
- **Guest cart**: `CartService` attaches an `X-Guest-Cart-Id` header for unauthenticated users
  and persists the cart id returned by the backend. Swap this for whatever header/cookie
  scheme your backend actually expects.
- **i18n**: static UI strings live in `core/constants/translations.ts` and are rendered via the
  `translate` pipe; `LanguageService` toggles `<html lang>` / `dir` and persists the choice.
  Product data itself is shown as returned by the API (per the spec, no client-side translation
  of product content).
- **Business rules enforced client-side** (spec §66): out-of-stock/inactive products can't be
  added to cart, quantity is capped to available stock, prices/stock are never treated as
  authoritative — the UI always re-reads them from API responses.
- **API response shape**: all services assume `{ success, message, data }` /
  `{ success: false, message, code }` and unwrap accordingly; centralize any change to that
  contract in one place per service (`unwrap<T>`).

## What's stubbed / needs backend wiring

- `AdminUserListComponent` is a placeholder — the spec didn't define a users endpoint.
- Product-list routes for `/new-arrivals` and `/top-sales` currently reuse the generic
  paginated `/products` endpoint rather than the dedicated home endpoints (those dedicated
  endpoints are used on the homepage sections). Wire them up if you want paginated,
  server-sorted "new arrivals" / "top sales" listing pages.
- `.spec.ts` files are Angular's default generated stubs (no real test coverage was written).
- Image upload in the admin product form posts `FormData` with an `images` field and expects
  the updated product (with Cloudinary URLs) back — adjust field name/shape to match your
  actual backend contract.

## Design

Streetwear-adjacent visual language: warm paper background, near-black ink text, a hot
signal-red accent, hard 2px borders instead of soft shadows on cards, pill-shaped CTA buttons,
Space Grotesk for display type. Tokens live in `src/styles.css` as CSS variables
(`--ink`, `--paper`, `--signal`, `--moss`, `--sun`, `--line`, `--muted`) if you want to retheme.
