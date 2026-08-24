# FixItNow Frontend — API Integration Endpoint Mapping

> **Architecture Note (BFF Proxy Pattern):**  
> The browser **NEVER** calls the backend directly (`https://fixiltnow-backend.onrender.com`). Every backend API call passes through a Next.js App Router Proxy Route Handler (`src/app/api/**/route.ts`), which forwards requests server-to-server and automatically attaches the `fixitnow_session` httpOnly JWT cookie.

---

## 1. Authentication Endpoints

| Frontend Route / Component | Proxy Route Handler | Backend Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src/app/auth/register/page.tsx` | `src/app/api/auth/register/route.ts` | `/api/auth/register` | `POST` | Public | Registers a new Customer or Technician account. |
| `src/app/auth/login/page.tsx` | `src/app/api/auth/login/route.ts` | `/api/auth/login` | `POST` | Public | Authenticates user credentials & sets httpOnly session cookie. |
| `src/lib/auth-context.tsx` | `src/app/api/auth/logout/route.ts` | `/api/auth/logout` | `POST` | Authenticated | Clears the session cookie. |
| `src/lib/auth-context.tsx` | `src/app/api/auth/me/route.ts` | `/api/auth/me` | `GET` | Authenticated | Restores active user session profile on page reload. |

---

## 2. Public Catalog & Technician Endpoints

| Frontend Route / Component | Proxy Route Handler | Backend Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src/app/page.tsx` & `/services` | `src/app/api/services/route.ts` | `/api/services` | `GET` | Public | Fetches service catalog with search, price, location, & category filters. |
| `src/app/page.tsx` & `/services` | `src/app/api/technicians/route.ts` | `/api/technicians` | `GET` | Public | Lists active technicians with rating and location filters. |
| `src/app/(public)/technicians/[id]` | `src/app/api/technicians/[id]/route.ts` | `/api/technicians/:id` | `GET` | Public | Retrieves technician profile, services, and customer reviews. |
| `src/components/catalog/FilterSidebar.tsx` | `src/app/api/categories/route.ts` | `/api/categories` | `GET` | Public | Lists all active service categories. |

---

## 3. Customer Endpoints

| Frontend Route / Component | Proxy Route Handler | Backend Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src/components/booking/BookingModal.tsx` | `src/app/api/bookings/route.ts` | `/api/bookings` | `POST` | Customer | Creates a new service booking with future datetime validation. |
| `src/app/dashboard/customer/page.tsx` | `src/app/api/bookings/route.ts` | `/api/bookings` | `GET` | Customer | Retrieves the customer's own booking history. |
| `src/app/dashboard/customer/bookings/[id]/pay` | `src/app/api/bookings/[id]/route.ts` | `/api/bookings/:id` | `GET` | Customer | Fetches booking details and validates status prior to checkout. |
| `src/app/dashboard/customer/bookings/[id]/pay` | `src/app/api/payments/create/route.ts` | `/api/payments/create` | `POST` | Customer | Initiates Stripe PaymentIntent and returns `clientSecret`. |
| `src/components/review/ReviewModal.tsx` | `src/app/api/reviews/route.ts` | `/api/reviews` | `POST` | Customer | Submits rating (1-5) and comment on completed bookings. |

---

## 4. Technician Self-Service Endpoints

| Frontend Route / Component | Proxy Route Handler | Backend Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src/app/dashboard/technician/page.tsx` | `src/app/api/bookings/route.ts` | `/api/bookings` | `GET` | Technician | Retrieves incoming job requests and assigned bookings. |
| `src/app/dashboard/technician/page.tsx` | `src/app/api/technician-bookings/[id]` | `/api/technician-bookings/:id` | `PATCH` | Technician | Transitions booking status (`ACCEPTED`, `DECLINED`, `IN_PROGRESS`, `COMPLETED`). |
| `src/app/dashboard/technician/profile` | `src/app/api/technician/profile/route.ts` | `/api/technician/profile` | `GET`, `PUT` | Technician | Fetches and upserts bio, skills, hourly rate, and location. |
| `src/app/dashboard/technician/services` | `src/app/api/technician/services/route.ts` | `/api/technician/services` | `GET`, `POST` | Technician | Lists and creates service offerings. |
| `src/app/dashboard/technician/services` | `src/app/api/technician/services/[id]/route.ts` | `/api/technician/services/:id` | `PATCH`, `DELETE` | Technician | Updates or deletes specific service offerings. |
| `src/app/dashboard/technician/availability` | `src/app/api/technician/availability/route.ts` | `/api/technician/availability` | `GET`, `POST` | Technician | Lists and adds weekly availability time slots. |
| `src/app/dashboard/technician/availability` | `src/app/api/technician/availability/[id]/route.ts` | `/api/technician/availability/:id` | `DELETE` | Technician | Removes specific availability time slots. |

---

## 5. Admin Platform Operations Endpoints

| Frontend Route / Component | Proxy Route Handler | Backend Endpoint | HTTP Method | Auth Required | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `src/app/dashboard/admin/page.tsx` | `src/app/api/admin/users/route.ts` | `/api/admin/users` | `GET` | Admin | Fetches total user counts for platform dashboard stats. |
| `src/app/dashboard/admin/users` | `src/app/api/admin/users/route.ts` | `/api/admin/users` | `GET` | Admin | Lists platform users with role, status, and pagination filters. |
| `src/app/dashboard/admin/users` | `src/app/api/admin/users/[id]/route.ts` | `/api/admin/users/:id` | `PATCH` | Admin | Updates user status (`ACTIVE` or `BANNED`). |
| `src/app/dashboard/admin/categories` | `src/app/api/admin/categories/route.ts` | `/api/admin/categories` | `GET`, `POST` | Admin | Lists and creates new service categories. |
| `src/app/dashboard/admin/bookings` | `src/app/api/admin/bookings/route.ts` | `/api/admin/bookings` | `GET` | Admin | Platform-wide read-only audit log of all bookings. |
| `src/app/dashboard/admin/payments` | `src/app/api/admin/payments/route.ts` | `/api/admin/payments` | `GET` | Admin | Audit log of all completed, pending, and failed payment intents. |
