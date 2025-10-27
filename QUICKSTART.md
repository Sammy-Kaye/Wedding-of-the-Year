# Quick Start Guide

Get the Wedding Invitation System running in 5 minutes!

## Prerequisites

- Node.js v18+ installed
- PostgreSQL v14+ installed and running
- Git installed

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 2. Setup PostgreSQL Database (1 minute)

Open PostgreSQL and create database:

```sql
CREATE DATABASE wedding_invitation;
```

Or use command line:
```bash
# Windows
psql -U postgres -c "CREATE DATABASE wedding_invitation;"

# Mac/Linux
createdb wedding_invitation
```

### 3. Configure Environment (1 minute)

**Backend configuration:**
```bash
cd server
cp .env.example .env
```

Edit `server/.env` - **MINIMUM required settings:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wedding_invitation
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=change_this_to_random_string_min_32_chars

ADMIN_EMAIL=admin@wedding.com
ADMIN_PASSWORD=admin123

# Email (optional for testing, required for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Frontend configuration:**
```bash
# In root directory
cp .env.example .env
```

The default `.env` is fine for local development:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Initialize Database (30 seconds)

```bash
cd server
npm run migrate
```

You should see:
```
✓ Migration 001_initial_schema.sql completed successfully
✓ All migrations completed successfully
```

### 5. Create Admin User (30 seconds)

```bash
# Still in server directory
npm run setup
```

Follow the prompts:
```
Admin email: admin@wedding.com
Admin password: your_secure_password
Admin name: Admin
```

### 6. Start the Application (30 seconds)

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

You should see:
```
Server running on port 3000
Environment: development
Frontend URL: http://localhost:3001
```

**Terminal 2 - Start Frontend:**
```bash
# In root directory
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
```

### 7. Access the Application

Open your browser:

- **Homepage**: http://localhost:3001/
- **Admin Login**: Click "Admin" button on homepage
  - Email: admin@wedding.com
  - Password: (what you set in step 5)

## First Steps After Setup

### 1. Add Your First Guest

1. Login to admin dashboard
2. Click "Add Guest" button
3. Fill in guest details:
   - Name: John Doe
   - Email: john@example.com (optional)
   - Phone: +1234567890 (optional)
   - Plus One: Yes/No
4. Click "Create Guest"

A unique code and QR code will be automatically generated!

### 2. Test RSVP Flow

1. Copy the unique code from the guest you created
2. Go to homepage: http://localhost:3001/
3. Click "RSVP Now"
4. Search for the guest name or enter the unique code
5. Fill out RSVP form
6. Submit

### 3. Test Check-in

1. Go to admin dashboard
2. Click "Check-in" tab
3. Enter the guest's unique code
4. Click "Check In"

### 4. View Dashboard Stats

The admin dashboard shows:
- Total guests
- Attending/Not attending/Pending
- Plus ones
- Checked in guests
- Recent activity

## Troubleshooting

### Database Connection Error

**Error:** `connection refused` or `authentication failed`

**Fix:**
1. Verify PostgreSQL is running
2. Check credentials in `server/.env`
3. Test connection:
   ```bash
   psql -U postgres -d wedding_invitation
   ```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Fix:**
1. Kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F

   # Mac/Linux
   lsof -ti:3000 | xargs kill -9
   ```
2. Or change port in `server/.env`:
   ```env
   PORT=3001
   ```

### Migration Errors

**Error:** `relation "guests" already exists`

**Fix:** Database already has tables. Either:
1. Drop and recreate database:
   ```sql
   DROP DATABASE wedding_invitation;
   CREATE DATABASE wedding_invitation;
   ```
2. Then run migrations again

### Frontend Can't Connect to Backend

**Error:** `Network Error` or `Failed to fetch`

**Fix:**
1. Verify backend is running on port 3000
2. Check `VITE_API_URL` in `.env`
3. Check browser console for CORS errors
4. Restart both servers

## Next Steps

### Customize Your Wedding Details

Edit `server/.env`:
```env
WEDDING_COUPLE_NAMES=Your Names
WEDDING_DATE=2024-12-31
WEDDING_VENUE=Your Venue Name
```

### Setup Email Notifications

For Gmail:
1. Enable 2-factor authentication
2. Generate App Password:
   - Google Account → Security → App passwords
3. Update `server/.env`:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   ```

### Import Guest List

Use the admin dashboard to:
1. Add guests one by one, or
2. Use the API to bulk import (see API docs)

### Send Invitations

1. Add guests with email addresses
2. In admin dashboard, click "Send Invitation" for each guest
3. Guests receive email with unique code and QR code

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh browser
- Backend: Using nodemon, changes auto-restart server

### Database GUI Tools

Recommended tools to view database:
- **pgAdmin**: Full-featured PostgreSQL GUI
- **DBeaver**: Universal database tool
- **TablePlus**: Modern database GUI (Mac/Windows)

### API Testing

Use these tools to test API endpoints:
- **Postman**: Full-featured API client
- **Insomnia**: Lightweight API client
- **curl**: Command-line tool
- **Thunder Client**: VS Code extension

Example curl request:
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wedding.com","password":"your_password"}'
```

### View Logs

**Backend logs:** Check Terminal 1 (server console)
**Frontend logs:** Check browser console (F12)
**Database logs:** Check PostgreSQL logs

## Common Tasks

### Reset Database

```bash
# Drop all tables and recreate
psql -U postgres -c "DROP DATABASE wedding_invitation;"
psql -U postgres -c "CREATE DATABASE wedding_invitation;"
cd server
npm run migrate
npm run setup
```

### Create Additional Admin Users

```bash
cd server
npm run setup
# Or use API endpoint
```

### Backup Database

```bash
pg_dump -U postgres wedding_invitation > backup.sql
```

### Restore Database

```bash
psql -U postgres wedding_invitation < backup.sql
```

## Ready for Production?

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment guide.

## Need Help?

1. Check the main [README.md](README.md)
2. Review [server/README.md](server/README.md) for API docs
3. Check logs for error messages
4. Verify all environment variables are set

---

**You're all set! Enjoy managing your wedding invitations! 🎉**
