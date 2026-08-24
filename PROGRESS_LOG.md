# Progress Log - FixItNow Frontend

## Project Commit Counter: 36 commits total

---

## [2026-08-24] - Prompt 5: Booking Creation, Status Badges & Role Dashboards

### Completed Tasks
- **Task 1: Booking Proxy Route Handlers**: Created proxy Route Handlers under `src/app/api/bookings/`:
  - `POST /api/bookings`: Forwards serviceId, scheduledDate, and notes to backend `POST /api/bookings` (auth: CUSTOMER only).
  - `GET /api/bookings`: Forwards caller's booking list query to backend `GET /api/bookings`.
  - `GET /api/bookings/[id]`: Forwards single booking detail query to backend `GET /api/bookings/:id`.
  - `PATCH /api/technician-bookings/[id]`: Forwards status updates to backend `PATCH /api/technician/bookings/:id` (auth: TECHNICIAN only).
  *(Commit: `feat: add booking proxy Route Handlers`)*
- **Task 2: Types & React Query Hooks**: Created `src/types/booking.ts` and `src/hooks/useBookings.ts` containing `useMyBookings()`, `useBooking(id)`, `useCreateBooking()`, and `useUpdateBookingStatus()` with automatic query cache invalidation. *(Commit: `feat: add booking types and React Query hooks`)*
- **Task 3: Status Badge Component**: Created `src/components/booking/StatusBadge.tsx` mapping `REQUESTED`, `ACCEPTED`, `DECLINED`, `PAID`, `IN_PROGRESS`, `COMPLETED`, and `CANCELLED` statuses to design system token colors. *(Commit: `feat: add booking StatusBadge component`)*
- **Task 4: Booking Creation Modal**: Created `src/components/booking/BookingModal.tsx` with native future datetime validation (`<input type="datetime-local">`) and notes textarea. Wired into `src/app/(public)/technicians/[id]/page.tsx` for CUSTOMER role bookings. *(Commit: `feat: add booking creation modal with future-date validation`)*
- **Task 5: Customer Bookings Dashboard**: Replaced placeholder in `src/app/dashboard/customer/page.tsx` with interactive bookings table, `StatusBadge`, formatted pricing, and "Pay Now" action linking to stub payment page. *(Commit: `feat: build customer bookings dashboard`)*
- **Task 6: Technician Bookings Dashboard**: Replaced placeholder in `src/app/dashboard/technician/page.tsx` with incoming jobs table and status transition actions (`Accept`, `Decline`, `Start Job`, `Mark Completed`). Surfaces backend HTTP 400 error messages directly via toasts. *(Commit: `feat: build technician bookings dashboard with status actions`)*
- **Task 7: Dashboard Overview Stats**: Added client-side computed overview stat cards:
  - Customer: Total Bookings, Upcoming Jobs, Completed Jobs.
  - Technician: Total Bookings, Pending Requests, Total Earnings.
  *(Commit: `feat: add dashboard overview stat cards`)*
- **Task 8: Stub Payment Page**: Created `src/app/dashboard/customer/bookings/[id]/pay/page.tsx` displaying booking summary and a disabled "Payment integration coming soon" button placeholder. *(Commit: `chore: add stub payment page placeholder`)*

---

## [2026-08-24] - Prompt 4: Public Catalog Pages, Filters & Technician Profiles

### Completed Tasks
- **Tasks 1-9**: Created proxy Route Handlers (`services`, `technicians`, `categories`), `formatCurrency()` / `formatRating()` helpers, `useCatalog` React Query hooks, shared catalog UI components (`ServiceCard`, `TechnicianCard`, `FilterSidebar`, `SkeletonCard`, `Pagination`), updated Home page, `/services` page, and `/technicians/[id]` profile pages.

---

## [2026-08-24] - Prompt 3: Authentication System, Session Cookies & Route Protection

### Completed Tasks
- **Tasks 1-10**: Installed form handling, created auth types, session cookie helpers (`fixitnow_session`), proxy Route Handlers (`register`, `login`, `logout`, `me`), React Query `AuthProvider` & `useAuth()`, Navbar integration, Register & Login pages with Zod validation, role dashboard placeholders, and edge middleware route protection.

---

## [2026-08-24] - Prompt 2: Design System, Logo, NeonButton, Navbar, Footer

### Completed Tasks
- **Tasks 1-7**: Configured Tailwind CSS v4 `@theme` design tokens, smooth scrolling, SVG Logo, `NeonButton` with sparkle hover effect, Navbar, Footer, and Root Layout integration.

---

## [2026-08-24] - Prompt 1: Project Scaffolding & BFF Foundation

### Completed Tasks
- **Tasks 1-5**: Initialized Next.js 16 (App Router), environment files, folder structure, BFF client helper `backend-client.ts`, and `/api/health` Route Handler proof-of-life.
