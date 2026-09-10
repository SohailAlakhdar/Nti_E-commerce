# Youth Fashion Store — Backend API

Production-oriented REST API for a men's & women's fashion e-commerce store
(target audience ~18–35). Node.js + Express + MongoDB, modular layered
architecture (controllers → services → models), JWT auth (access +
refresh, separate signing secrets for users vs admins), Cloudinary image
storage, Winston logging, node-cache caching, and Cash-on-Delivery
checkout with race-safe stock handling.

## Requirements

- Node.js 18+
- MongoDB 6+ (replica set required for multi-document transactions — a
  local single-node replica set works fine; see below)
- A Cloudinary account (free tier is enough)

## Installation

```bash
cd backend
npm install
cp .env.example .env
# fill in .env — see "Environment variables" below
```

## MongoDB setup

Transactions (used for checkout and order-status changes) require MongoDB
to be running as a replica set, even a single-node one for local dev:

```bash
mongod --replSet rs0 --dbpath /path/to/data
# then, once, in a mongo shell:
rs.initiate()
```

Set `MONGO_URI` to something like:
`mongodb://localhost:27017/youth-fashion?replicaSet=rs0`

In production, MongoDB Atlas clusters are replica sets by default, so no
extra setup is needed there.

## Cloudinary setup

Create a free account at cloudinary.com, then copy your Cloud Name, API
Key, and API Secret from the dashboard into `CLOUD_NAME`, `API_KEY`, and
`API_SECRET` in `.env`.

## Environment variables

See `.env.example` for the full list. Key groups:

- `MONGO_URI` — connection string (replica set, see above)
- `CLOUD_NAME` / `API_KEY` / `API_SECRET` — Cloudinary credentials
- `ACCESS_USER_TOKEN_SIGNATURE` / `REFRESH_USER_TOKEN_SIGNATURE` — JWT
  secrets used for normal customer tokens
- `ACCESS_SYSTEM_TOKEN_SIGNATURE` / `REFRESH_SYSTEM_TOKEN_SIGNATURE` — JWT
  secrets used for admin tokens (kept separate from user secrets so a
  leaked user secret can never mint a valid admin token)
- `ACCESS_TOKEN_EXPIRES_IN` / `REFRESH_TOKEN_EXPIRES_IN` — e.g. `15m`, `30d`
- `ALLOWED_ORIGINS` — comma-separated list of allowed CORS origins
- `CACHE_TTL` — seconds, default 300
- `SEED_ADMIN_*` — used only by `npm run seed:admin`, never hardcoded

Generate strong random values for all four JWT signature variables, e.g.:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Running locally

```bash
npm run dev     # nodemon, auto-restarts on file changes
npm start       # plain node, for production-like runs
```

The API is served under `http://localhost:5000/api/v1`. Health check:
`GET /health`.

## Admin setup

```bash
npm run seed:admin
```

Reads `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PHONE`,
`SEED_ADMIN_PASSWORD` from `.env` and creates (or promotes an existing
user to) an `ADMIN`. Log in via `POST /api/v1/auth/login` with those
credentials to get an admin access token.

## API structure

All endpoints are versioned under `/api/v1`. Highlights:

```
/api/v1/auth/{register,login,refresh,logout,me}
/api/v1/addresses                      (auth required)
/api/v1/products                       (public list/detail, admin write)
/api/v1/cart                           (works for guests and users)
/api/v1/orders                         (checkout works for guests too)
/api/v1/admin/orders                   (admin)
/api/v1/shipping                       (public read, admin write)
/api/v1/policies                       (public read, admin write)
/api/v1/about                          (public read, admin write)
/api/v1/testimonials                   (public read approved, auth to submit)
/api/v1/admin/testimonials             (admin)
/api/v1/home/{new-arrivals,top-sales}  (public)
/api/v1/admin/reports/{overview,sales,top-products,categories}
```

Products support filtering (`gender`, `subCategory`, `minPrice`,
`maxPrice`, `search`, `isActive`) and pagination (`page`, `limit`).

## Authentication

- Passwords are hashed with bcryptjs, never stored or logged in plain
  text.
- Access tokens are short-lived and sent in the `Authorization: Bearer`
  header; refresh tokens are long-lived, stored hashed in MongoDB, sent as
  an httpOnly cookie, and rotated on every use.
- Guest shopping (cart + checkout) uses a separate httpOnly session cookie
  (`guest_cart_sid`); on login, the guest cart is merged into the user's
  cart, capped at live stock per item.

## Key business rules enforced server-side

- Stock is never trusted from the client; checkout always re-reads price
  and stock from MongoDB and decrements stock atomically inside a
  transaction (`stock: { $gte: quantity }` guard) to prevent overselling
  under concurrent orders.
- Orders store an immutable snapshot of product name/price/quantity, so
  they stay valid even if the product is later edited, frozen, or removed.
- Only `DELIVERED` orders count as completed sales in reports and
  top-sales.
- Testimonials require admin approval (`isApproved` defaults to `false`
  and is never accepted from client input).
- Products are soft-deleted (`isActive: false`, `freezedAt` set) rather
  than destroyed, to preserve historical order integrity.

## Available npm scripts

- `npm run dev` — start with nodemon
- `npm start` — start with node
- `npm run seed:admin` — create/promote an admin user from `.env`
- `npm run lint` — run eslint

## Notes on caching

Read-heavy public data (products, shipping policy, policies, testimonials,
new arrivals, top sales, about page) is cached in-process via `node-cache`
with a default TTL of `CACHE_TTL` seconds. Every mutation that affects
cached data explicitly invalidates the relevant cache keys — checkout
stock changes are never cached.
