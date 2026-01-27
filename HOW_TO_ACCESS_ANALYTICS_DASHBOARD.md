# How to Access and Use the Analytics Dashboard

## 🚀 Quick Access

### Step 1: Login as Admin
1. Go to: **http://localhost:8000/login**
2. Login with:
   - **Email:** `transport@transport.com`
   - **Password:** `password`

### Step 2: Navigate to Analytics
After login, you'll be redirected to `/admin/dashboard`. Then:

**Option A: Direct URL**
- Go to: **http://localhost:8000/admin/analytics**

**Option B: Via Navigation Menu**
- Look for "Analytics" in the admin navigation menu
- Click on it to access the dashboard

---

## 📊 What You'll See

The Analytics Dashboard has **5 main tabs**:

### 1. **Overview Tab** (Default)
Shows:
- **Key Metrics Cards:**
  - Total Revenue
  - Active Routes
  - Total Drivers
  - Average Utilization

- **Revenue Trends Chart:**
  - Line chart showing revenue over time
  - Interactive tooltips

- **Capacity Utilization Heatmap:**
  - Visual grid showing route capacity status
  - Color-coded by utilization level:
    - 🟢 Green: Low (< 50%)
    - 🟡 Yellow: Medium (50-80%)
    - 🟠 Orange: High (80-100%)
    - 🔴 Red: Full (100%+)

### 2. **Revenue Tab**
- Detailed revenue trends chart
- Revenue vs Bookings comparison
- Date range filtering

### 3. **Capacity Tab**
- Full capacity heatmap view
- Route-by-route breakdown
- Available seats per route

### 4. **Drivers Tab**
- Driver performance metrics table
- Sortable columns:
  - Driver name
  - Total routes
  - Total bookings
  - Completions
  - Pickups
  - On-time rate
  - Average completion time
- Filter by driver name

### 5. **Routes Tab**
- Route efficiency metrics
- Shows:
  - Route name
  - Capacity vs Active bookings
  - Utilization percentage
  - Average bookings per day
  - Assigned driver

---

## 🎛️ Features

### Date Range Filter
1. Select **Start Date** and **End Date**
2. Click **"Apply Filter"** button
3. All charts and metrics update automatically

### Export Reports
1. Click **"Export Report"** button (top right)
2. Select:
   - **Report Type:** Revenue, Capacity, Driver Performance, or Route Efficiency
   - **Format:** PDF or Excel
   - **Date Range:** Start and end dates
3. Click **"Export"**
4. Report downloads automatically

---

## 🔧 Troubleshooting

### If Dashboard Shows Blank/Empty:

1. **Clear Browser Cache:**
   - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - This forces a hard refresh

2. **Check Browser Console:**
   - Press `F12` to open DevTools
   - Look for errors in the Console tab
   - If you see "Page not found" errors, the assets need rebuilding

3. **Rebuild Assets:**
   ```bash
   npm run build
   php artisan optimize:clear
   ```

4. **Verify You're Logged In:**
   - Make sure you're logged in as an admin user
   - Check that your user has `super_admin` or `transport_admin` role

### If Icons Show 404 Errors:

The PWA icons issue has been fixed. If you still see errors:
1. Hard refresh the page (`Ctrl+Shift+R`)
2. The manifest now uses the existing logo instead of missing icon files

---

## 📍 Direct URLs

- **Analytics Dashboard:** http://localhost:8000/admin/analytics
- **Revenue Metrics API:** http://localhost:8000/admin/analytics/revenue
- **Capacity Metrics API:** http://localhost:8000/admin/analytics/capacity
- **Driver Metrics API:** http://localhost:8000/admin/analytics/drivers
- **Route Metrics API:** http://localhost:8000/admin/analytics/routes

---

## 🎯 What Data is Shown

### Revenue Trends
- Calculated from bookings with status: `active`, `pending`, `awaiting_approval`
- Uses pricing service to calculate actual revenue
- Grouped by day, week, or month

### Capacity Utilization
- Shows all active routes
- Calculates: `(Active Bookings / Total Capacity) × 100`
- Updates in real-time based on current bookings

### Driver Performance
- Based on route completions
- On-time rate: Pickups within 15 minutes of scheduled time
- Average completion time: Time from route start to completion

### Route Efficiency
- Active bookings per route
- Average bookings per day (last 30 days)
- Pickup points count
- Driver assignment status

---

## 💡 Tips

1. **Use Date Filters:** Narrow down data to specific time periods
2. **Export Reports:** Generate PDF/Excel reports for meetings or records
3. **Check Driver Performance:** Use the Drivers tab to identify top performers
4. **Monitor Capacity:** Use the Capacity tab to see which routes need more vehicles
5. **Track Revenue:** Use the Revenue tab to see revenue trends over time

---

## 🔐 Required Permissions

Only users with these roles can access the analytics dashboard:
- `super_admin`
- `transport_admin`

Regular `parent` and `driver` users cannot access this page.

---

## ✅ Quick Test

1. Login: http://localhost:8000/login
   - Email: `transport@transport.com`
   - Password: `password`

2. Navigate: http://localhost:8000/admin/analytics

3. You should see:
   - Dashboard with tabs
   - Key metrics cards
   - Charts and tables
   - Date range filter
   - Export button

If everything loads correctly, you're all set! 🎉

