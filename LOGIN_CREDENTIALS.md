# Login Credentials - Quick Reference

## ✅ Available Accounts

### Admin Accounts (Access to `/admin/dashboard`)

1. **Super Admin**
   - Email: `support@ontimetransportwa.com`
   - Password: `password`
   - Role: `super_admin`

2. **Transport Admin** (Just Created)
   - Email: `transport@transport.com`
   - Password: `password`
   - Role: `transport_admin`

3. **Transport Admin (Alternative)**
   - Email: `taaltouray@usgamneeds.com`
   - Password: `password`
   - Role: `transport_admin`

### Driver Accounts (Access to `/driver/dashboard`)

- Email: `john.driver@transport.com`
- Password: `password`

- Email: `jane.smith@transport.com`
- Password: `password`

- Email: `mike.johnson@transport.com`
- Password: `password`

### Parent Accounts (Access to `/parent/dashboard`)

- Email: `sarah.johnson@example.com`
- Password: `password`

- Email: `david.brown@example.com`
- Password: `password`

- Email: `emily.davis@example.com`
- Password: `password`

---

## 🔑 Quick Login

**For Admin Access:**
- Email: `transport@transport.com`
- Password: `password`

**Login URL:** http://localhost:8000/login

---

## ⚠️ Security Note

**All accounts use the default password `password` for testing.**

**Before deploying to production, change all passwords!**

---

## 🧪 Test Different Roles

1. **Admin Testing**: Use `transport@transport.com` / `password`
   - Access: Analytics dashboard, all admin features
   - URL after login: `/admin/dashboard`

2. **Driver Testing**: Use `john.driver@transport.com` / `password`
   - Access: Driver roster, route information
   - URL after login: `/driver/dashboard`

3. **Parent Testing**: Use `sarah.johnson@example.com` / `password`
   - Access: Bookings, students, payments
   - URL after login: `/parent/dashboard`

