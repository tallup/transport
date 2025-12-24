# Project Rebuild Specification: U.S. Student Transport System

## 1. Stack & Architecture

- **Backend**: Laravel 11 (PHP 8.3+)
- **Admin/Driver Panel**: Filament PHP v3 (for high-speed internal CRUD)
- **Parent Portal**: React + Inertia.js (for a premium, app-like mobile experience)
- **Styling**: Tailwind CSS + Shadcn/ui for React components
- **Payments**: Laravel Cashier (Stripe)
- **Database**: PostgreSQL with seat-capacity constraints

## 2. Core Modules to Scaffold

### A. The Admin Panel (Filament)

- **Student Management**: Profile creation with emergency contact storage
- **Route & Fleet**: Pickup/drop-off configuration and seat/capacity control logic per vehicle (Bus/Van)
- **Calendar**: A custom resource to set school days, holidays, and closures
- **Finance Dashboard**: Revenue reporting (paid/outstanding) and manual booking overrides
- **Exports**: Enable Excel/CSV exports for all rosters and financial logs

### B. The Driver Panel (Simplified Filament)

- Create a dedicated Filament Panel restricted to the driver role
- **Daily Rosters**: A read-only view of students grouped by pickup point for the driver's assigned route

### C. The Parent Portal (React + Inertia)

- **Student Onboarding**: A React-based multi-step form to register and create student profiles
- **Transport Booking**: A selector for routes and pickup points with real-time seat availability checks
- **Stripe Integration**: Use Stripe Elements for U.S. PCI-compliant checkout
- **Plan Selection**: Logic for Weekly, Bi-Weekly, Monthly, Semester, and Annual pricing

## 3. Data Schema & Relationships

- **Users**: `id`, `email`, `role` (enum: super_admin, transport_admin, driver, parent)
- **Students**: `id`, `parent_id` (FK), `name`, `school`, `emergency_phone`
- **Routes**: `id`, `name`, `driver_id` (FK), `vehicle_id` (FK), `capacity`
- **Bookings**: `id`, `student_id` (FK), `route_id` (FK), `plan_type`, `status`

## 4. Key Logic & Business Rules

- **Capacity Guard**: Implement a Global Scope or custom validation to prevent bookings if a route is at 100% seat capacity
- **Audit Logs**: Track all financial changes using `spatie/laravel-activitylog`
- **Notifications**: Configure Laravel Mail to trigger on successful booking and 7-day renewal reminders

## 5. Deployment Readiness (Laravel Forge)

- Ensure the app is configured for AWS (us-east-1)
- Setup Redis for session handling and real-time responsiveness
- Enable HTTPS/SSL enforcement globally

## Immediate Cursor Instructions

1. **Initialize Project**: Start by running `laravel new . --inertia` and install Filament v3
2. **Migration Build**: Reference the schema above to create all database tables
3. **Filament Resources**: Scaffold the `StudentResource` and `RouteResource` first
4. **React Frontend**: Build the `Dashboard.tsx` for parents, pulling data via Inertia props

