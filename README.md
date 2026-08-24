# FixItNow — On-Demand Home Services Marketplace Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=reactquery)](https://tanstack.com/query)
[![Stripe](https://img.shields.io/badge/Stripe_Payments-Elements-635BFF?style=flat-square&logo=stripe)](https://stripe.com/)

> **FixItNow** is a modern, high-performance home services marketplace connecting customers with verified local technicians for plumbing, electrical, HVAC, appliance repair, and home maintenance.

---

## 🏗️ Architecture Overview: BFF Proxy Pattern

This frontend operates under a strict **Backend-for-Frontend (BFF) proxy architecture**:

- **No Direct Browser-to-Backend Calls:** The client-side browser never communicates directly with the external backend server (`https://fixiltnow-backend.onrender.com`).
- **Next.js Route Handlers (`src/app/api/**/route.ts`):** Every API request is proxied server-to-server through Next.js Route Handlers.
- **Secure httpOnly Cookie Authentication:** JWT tokens are stored in an `httpOnly`, `SameSite=Lax` session cookie (`fixitnow_session`). Token strings are never exposed to client-side JavaScript or `localStorage`.

---

## 🛠️ Tech Stack & Key Libraries

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server-Side Rendering, Route Handlers, Edge Middleware |
| **Language** | TypeScript | Strict type safety across components, hooks, & API contracts |
| **Styling** | Tailwind CSS v4 (`@theme`) | Custom dark theme (Warm Charcoal, Copper/Amber glow, Deep Teal) |
| **State & Data Fetching** | TanStack React Query v5 | Cache invalidation, optimistic updates, background refetching |
| **Forms & Validation** | React Hook Form + Zod | Client-side schema validation and error messaging |
| **Payments** | Stripe.js & React Stripe.js | Custom dark-themed Stripe PaymentElement integration |
| **UI Components** | Lucide React & Sonner | Sleek vector icons & toast notifications |

---

## 👥 Role-Based Feature Matrix

### 1. 🛍️ Customer Role
- **Browse & Search Catalog:** Filter services by category, price range, location, and sorting order.
- **Technician Profiles:** View technician bio, hourly rate, average rating, reviews, and active offerings.
- **Service Booking:** Schedule appointments with future-date validation.
- **Stripe Payments:** Pay for accepted bookings securely via dark-themed Stripe Elements.
- **Review System:** Submit star ratings (1-5) and comments on completed bookings.

### 2. 🧰 Technician Role
- **Profile Management:** Upsert professional bio, skill tags, experience years, hourly rate, and location.
- **Service Offerings (CRUD):** List, create, edit, toggle active status, or delete custom service offerings.
- **Availability Scheduler:** Configure weekly working hours and time slots (Sun–Sat).
- **Job Management:** Accept/decline booking requests, start jobs (`IN_PROGRESS`), and mark jobs as `COMPLETED`.

### 3. 🛡️ Admin Role
- **Operations Dashboard:** Platform-wide metrics (Total Users, Technicians, Active Bookings, Platform Revenue).
- **User Administration:** Filter users by role/status, ban malicious users, or restore active accounts.
- **Category Catalog:** Create and manage platform service categories with duplicate check validation.
- **Bookings Oversight:** Read-only audit log of all customer-technician service bookings.
- **Payments & Stripe Log:** Audit log of completed, pending, and failed payment transactions.

---

## 📂 Project Structure

```text
FixItNow_Frontend/
├── src/
│   ├── app/                    # Next.js App Router Pages & Proxy Route Handlers
│   │   ├── (public)/           # Public catalog pages (/services, /technicians/[id])
│   │   ├── api/                # BFF Proxy Route Handlers (/api/auth, /api/bookings, etc.)
│   │   ├── auth/               # Login & Register pages
│   │   ├── dashboard/          # Protected role dashboards (/customer, /technician, /admin)
│   │   └── payment/            # Payment success and cancellation pages
│   ├── components/             # Reusable UI Components
│   │   ├── booking/            # BookingModal, StatusBadge
│   │   ├── catalog/            # ServiceCard, TechnicianCard, FilterSidebar
│   │   ├── layout/             # Navbar, Footer, Logo
│   │   ├── payment/            # CheckoutForm (Stripe Elements)
│   │   ├── review/             # StarRating, ReviewModal
│   │   └── ui/                 # NeonButton with sparkle glow effect
│   ├── hooks/                  # React Query hooks (useAuth, useBookings, useAdmin, etc.)
│   ├── lib/                    # BFF fetch client, session cookies, Stripe client, formatters
│   ├── types/                  # Shared TypeScript interfaces matching backend contracts
│   └── middleware.ts           # Edge middleware for role-based route protection
├── API_INTEGRATION.md          # Comprehensive frontend-to-backend endpoint mapping table
└── PROGRESS_LOG.md             # Complete development log and commit history
```

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# Backend API Base URL (Live Deployed Server)
BACKEND_API_URL=https://fixiltnow-backend.onrender.com

# Stripe Public Key (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51TqyBbEcrg2A3pJe0pBtMF0EH4cpqABi1rcy8tFYoQpY3yPaSh6RA8pIQzbnRYmHAiuF5S8eNTv9pYzTwHoyeuyf00lI5LM0cf
```

> **Note:** Never commit production secret keys. Only public publishable keys belong in `.env.local`.

---

## 🚀 Local Development Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Fahim7600/FixiltNow_Forntend.git
   cd FixiltNow_Forntend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run Production Build:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Live Demo & Test Credentials

- **Live Frontend URL:** [https://fixit-now-sand.vercel.app](https://fixit-now-sand.vercel.app)
- **Admin Test Credentials (Seeded Account):**
  - **Email:** `admin@fixitnow.com`
  - **Password:** `Admin@12345`

---

## 💳 Stripe Payment Testing

When testing payments on `/dashboard/customer/bookings/[id]/pay`:
- **Successful Card:** `4242 4242 4242 4242` (Expiry: any future date, CVC: any 3 digits)
- **Declined Card:** `4000 0000 0000 0002`
