# 🔑 Login Credentials

## Working User Accounts

### Super Admin
- **Email**: superadmin@finder.com
- **Mobile**: 01700000000
- **Password**: `Testpass@50`
- **Role**: superadmin

### Admin User  
- **Email**: admin@finder.com
- **Mobile**: 01900000000
- **Password**: `Testpass@50`
- **Role**: admin

### Regular User
- **Email**: user@finder.com
- **Mobile**: 01800000000  
- **Password**: `Testpass@50`
- **Role**: user

## Authentication Methods

Your app supports multiple authentication methods:

1. **Email + Password** (all users)
2. **Mobile + Password** (users with mobile numbers)
3. **Google OAuth** (for Google users)

## Admin Login

For admin panel access, use the admin login endpoint with:
- **admin@finder.com** / `Testpass@50` (admin role)
- **superadmin@finder.com** / `Testpass@50` (superadmin role)

---

**Note**: These credentials are created by the seed script (`src/seed-data.ts`).