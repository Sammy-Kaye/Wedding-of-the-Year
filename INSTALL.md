# Installation Guide

Quick installation guide for users who clone this repository from GitHub.

## Prerequisites

Before you begin, ensure you have:

- **Node.js v18+** - [Download](https://nodejs.org/)
- **PostgreSQL v14+** - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)
- **Git** (to clone the repository)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/wedding-invitation.git
cd wedding-invitation
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

**Expected output:** "added XXX packages" with no errors

### 3. Setup PostgreSQL Database

**Option A: Command Line**
```bash
# Windows (in PowerShell or CMD)
psql -U postgres -c "CREATE DATABASE wedding_invitation;"

# Mac/Linux
createdb wedding_invitation
```

**Option B: pgAdmin**
1. Open pgAdmin
2. Right-click "Databases"
3. Create → Database
4. Name: `wedding_invitation`
5. Click "Save"

### 4. Configure Environment Variables

**Backend Configuration:**
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your settings:
```env
# Database (REQUIRED)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wedding_invitation
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD

# Security (REQUIRED - generate random string)
JWT_SECRET=your_random_32_character_secret_here

# Admin Credentials (REQUIRED)
ADMIN_EMAIL=admin@wedding.com
ADMIN_PASSWORD=your_secure_admin_password

# Email Service (REQUIRED for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=Wedding Invitation <your_email@gmail.com>

# Frontend URL (default is fine for local dev)
FRONTEND_URL=http://localhost:3001

# Wedding Details (customize these)
WEDDING_COUPLE_NAMES=John & Jane
WEDDING_DATE=2024-12-31
WEDDING_VENUE=Beautiful Garden Venue
```

**Frontend Configuration:**
```bash
cd ..
cp .env.example .env
```

The default `.env` is fine for local development:
```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Run Database Migrations

```bash
cd server
npm run migrate
```

**Expected output:**
```
✓ Migration 001_initial_schema.sql completed successfully
✓ All migrations completed successfully
```

### 6. Create Admin User

```bash
npm run setup
```

Follow the prompts:
```
Admin email: admin@wedding.com
Admin password: [enter secure password]
Admin name: Admin User
```

**Expected output:**
```
✓ Admin user created successfully!
```

### 7. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Expected output:**
```
Server running on port 3000
Environment: development
Frontend URL: http://localhost:3001
```

**Terminal 2 - Start Frontend:**
```bash
# From root directory
npm run dev
```

**Expected output:**
```
VITE v7.x.x ready in xxx ms
➜ Local: http://localhost:3001/
```

### 8. Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3001
- **Admin Dashboard**: Click "Admin" button and login

## Verification

Test that everything works:

1. **Homepage loads** - Should see wedding invitation
2. **Admin login** - Use credentials from step 6
3. **Create guest** - Add a test guest in admin dashboard
4. **Submit RSVP** - Test the RSVP form
5. **Check email** - Verify confirmation email received

## Troubleshooting

### Database Connection Error

**Error:** `connection refused` or `authentication failed`

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   services.msc  # Check PostgreSQL service
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```
2. Check credentials in `server/.env`
3. Test connection:
   ```bash
   psql -U postgres -d wedding_invitation
   ```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Migration Errors

**Error:** `relation "guests" already exists`

**Solution:** Database already has tables. Drop and recreate:
```sql
DROP DATABASE wedding_invitation;
CREATE DATABASE wedding_invitation;
```
Then run migrations again.

### Email Not Sending

**Error:** Email confirmations not received

**Solution:**
1. For Gmail, use App Password (not regular password):
   - Google Account → Security → 2-Step Verification → App passwords
2. Check spam folder
3. Verify SMTP settings in `server/.env`
4. Test email service separately

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:** Dependencies not installed:
```bash
# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install

# Or for frontend
cd ..
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After successful installation:

1. **Customize** - Update wedding details in `server/.env`
2. **Add Guests** - Use admin dashboard to add your guest list
3. **Test** - Send test invitations and RSVPs
4. **Deploy** - See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Quick Commands Reference

```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from root directory)
npm run dev

# Run migrations
cd server && npm run migrate

# Create admin user
cd server && npm run setup

# View database
psql -U postgres -d wedding_invitation

# Check logs
# Backend: Terminal where server is running
# Frontend: Browser console (F12)
```

## Getting Help

1. Check [QUICKSTART.md](QUICKSTART.md) for detailed setup
2. Review [README.md](README.md) for full documentation
3. Check [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) for verification
4. Review error messages in terminal/console

## System Requirements

- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 500MB for dependencies
- **OS**: Windows 10+, macOS 10.15+, or Linux
- **Browser**: Chrome, Firefox, Safari, or Edge (latest version)

---

**Installation complete! Your wedding invitation system is ready to use! 🎉**
