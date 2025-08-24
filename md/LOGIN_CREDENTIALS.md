# 🔑 Login Credentials

## Working User Accounts

### Super Admin
- **Email**: razibmahmud50@gmail.com
- **Mobile**: 01700000000
- **Password**: `superadmin`
- **Role**: superadmin

### Admin User  
- **Email**: testadmin@example.com
- **Mobile**: 01900000000
- **Password**: `aaaaa`
- **Role**: admin

### Regular User
- **Email**: user@example.com
- **Mobile**: 01800000000  
- **Password**: `12345`
- **Role**: user

## Authentication Methods

Your app supports multiple authentication methods:

1. **Email + Password** (all users)
2. **Mobile + Password** (users with mobile numbers)
3. **Google OAuth** (for Google users)

## Admin Login

For admin panel access, use the admin login endpoint with:
- **testadmin@example.com** / `aaaaa` (admin role)
- **razibmahmud50@gmail.com** / `superadmin` (superadmin role)

---

**Note**: These are the actual working passwords as set by the `createSuperAdmin()` method in your AuthService.