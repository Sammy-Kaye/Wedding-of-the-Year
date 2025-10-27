# Setup Checklist

Use this checklist to ensure your wedding invitation system is properly configured.

## 📋 Pre-Setup Requirements

- [ ] Node.js v18+ installed (`node --version`)
- [ ] PostgreSQL v14+ installed (`psql --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Git installed (optional, `git --version`)
- [ ] Code editor installed (VS Code, etc.)

## 🗄️ Database Setup

- [ ] PostgreSQL service is running
- [ ] Created database: `wedding_invitation`
- [ ] Can connect to database with credentials
- [ ] Database user has necessary permissions

**Test connection:**
```bash
psql -U postgres -d wedding_invitation -c "SELECT version();"
```

## 📦 Installation

### Frontend
- [ ] Ran `npm install` in root directory
- [ ] No errors during installation
- [ ] `node_modules` folder created

### Backend
- [ ] Ran `npm install` in `server` directory
- [ ] No errors during installation
- [ ] `server/node_modules` folder created

## ⚙️ Configuration

### Backend Environment (`server/.env`)
- [ ] Copied `server/.env.example` to `server/.env`
- [ ] Set `DB_HOST` (default: localhost)
- [ ] Set `DB_PORT` (default: 5432)
- [ ] Set `DB_NAME` (wedding_invitation)
- [ ] Set `DB_USER` (your PostgreSQL username)
- [ ] Set `DB_PASSWORD` (your PostgreSQL password)
- [ ] Set `JWT_SECRET` (32+ random characters)
- [ ] Set `ADMIN_EMAIL`
- [ ] Set `ADMIN_PASSWORD` (strong password)
- [ ] Set `EMAIL_HOST` (e.g., smtp.gmail.com)
- [ ] Set `EMAIL_PORT` (e.g., 587)
- [ ] Set `EMAIL_USER` (your email)
- [ ] Set `EMAIL_PASSWORD` (app password)
- [ ] Set `EMAIL_FROM` (display name and email)
- [ ] Set `FRONTEND_URL` (http://localhost:3001)
- [ ] Set `WEDDING_COUPLE_NAMES`
- [ ] Set `WEDDING_DATE`
- [ ] Set `WEDDING_VENUE`

### Frontend Environment (`.env`)
- [ ] Copied `.env.example` to `.env`
- [ ] Set `VITE_API_URL` (http://localhost:3000/api)

## 🔧 Database Migrations

- [ ] Ran `npm run migrate` in server directory
- [ ] Saw success message for migration
- [ ] No errors in migration output
- [ ] Tables created in database

**Verify tables exist:**
```sql
\dt  -- In psql
```

Should show: guests, check_ins, admin_users, audit_logs, email_logs, migrations

## 👤 Admin User Setup

- [ ] Ran `npm run setup` in server directory
- [ ] Entered admin email
- [ ] Entered admin password
- [ ] Entered admin name
- [ ] Saw success message
- [ ] Admin user created in database

**Verify admin user:**
```sql
SELECT email, name FROM admin_users;
```

## 🚀 Server Startup

### Backend
- [ ] Ran `npm run dev` in server directory
- [ ] Server started on port 3000
- [ ] No errors in console
- [ ] Saw "Server running on port 3000"

**Test health endpoint:**
```bash
curl http://localhost:3000/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### Frontend
- [ ] Ran `npm run dev` in root directory
- [ ] Server started on port 3001
- [ ] No errors in console
- [ ] Saw Vite dev server URL

**Test frontend:**
Open http://localhost:3001 in browser

## ✅ Functionality Testing

### Homepage
- [ ] Homepage loads without errors
- [ ] Wedding details display correctly
- [ ] "RSVP Now" button works
- [ ] "Admin" button works
- [ ] No console errors

### Admin Login
- [ ] Can access login page
- [ ] Can login with admin credentials
- [ ] Redirects to dashboard after login
- [ ] Dashboard loads with stats
- [ ] No authentication errors

### Guest Management
- [ ] Can click "Add Guest" button
- [ ] Can fill out guest form
- [ ] Can create new guest
- [ ] Guest appears in list
- [ ] Unique code generated
- [ ] QR code generated
- [ ] Can search for guest
- [ ] Can edit guest
- [ ] Can delete guest

### RSVP Submission
- [ ] Can access RSVP form
- [ ] Can search for guest by name
- [ ] Can enter unique code
- [ ] Can fill out RSVP form
- [ ] Can submit RSVP (attending)
- [ ] Can submit RSVP (not attending)
- [ ] Form validation works
- [ ] Success message appears

### Email Notifications
- [ ] RSVP confirmation email received
- [ ] Email has correct content
- [ ] Email has wedding details
- [ ] Email not in spam folder
- [ ] Can send invitation email from admin
- [ ] Invitation email received
- [ ] Invitation has QR code

### Check-in System
- [ ] Can access check-in interface
- [ ] Can enter unique code
- [ ] Can check in guest
- [ ] Success message appears
- [ ] Duplicate check-in prevented
- [ ] Check-in appears in list
- [ ] Check-in count updates

### Admin Dashboard
- [ ] Statistics display correctly
- [ ] Total guests count accurate
- [ ] Attending count accurate
- [ ] Not attending count accurate
- [ ] Pending count accurate
- [ ] Plus ones count accurate
- [ ] Checked in count accurate
- [ ] Recent activity shows
- [ ] Can view email logs
- [ ] Can view fraud alerts
- [ ] Can export CSV
- [ ] CSV downloads correctly

### QR Code & PDF
- [ ] QR code displays for guest
- [ ] Can download PDF invitation
- [ ] PDF contains QR code
- [ ] PDF has wedding details
- [ ] QR code scannable

## 🔒 Security Testing

- [ ] Cannot access admin routes without login
- [ ] Invalid login credentials rejected
- [ ] JWT token expires after 24 hours
- [ ] Rate limiting works (try 6+ login attempts)
- [ ] CORS blocks requests from other origins
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized

## 📊 Database Verification

### Check Data
```sql
-- Count guests
SELECT COUNT(*) FROM guests;

-- View recent RSVPs
SELECT name, attending, created_at FROM guests 
WHERE attending IS NOT NULL 
ORDER BY updated_at DESC LIMIT 5;

-- View check-ins
SELECT g.name, c.checked_in_at 
FROM check_ins c 
JOIN guests g ON c.guest_id = g.id 
ORDER BY c.checked_in_at DESC;

-- View audit logs
SELECT action, entity_type, created_at 
FROM audit_logs 
ORDER BY created_at DESC LIMIT 10;

-- View email logs
SELECT email_type, recipient_email, status, sent_at 
FROM email_logs 
ORDER BY sent_at DESC LIMIT 10;
```

## 🐛 Common Issues Checklist

### Database Connection Issues
- [ ] PostgreSQL service running
- [ ] Credentials in `.env` correct
- [ ] Database exists
- [ ] User has permissions
- [ ] No firewall blocking connection

### Email Issues
- [ ] SMTP credentials correct
- [ ] Using app password (not regular password)
- [ ] Email service allows SMTP
- [ ] Not blocked by firewall
- [ ] Checked spam folder

### CORS Issues
- [ ] `FRONTEND_URL` in backend `.env` correct
- [ ] Backend server restarted after env change
- [ ] No typos in URL
- [ ] Ports match (3001 for frontend)

### Authentication Issues
- [ ] `JWT_SECRET` set in backend `.env`
- [ ] Admin user created successfully
- [ ] Password correct
- [ ] Token not expired
- [ ] Browser cookies enabled

## 📱 Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browser (responsive design)

## 🔄 Restart Test

- [ ] Stop both servers
- [ ] Start backend server
- [ ] Start frontend server
- [ ] All functionality still works
- [ ] Data persists in database

## 📝 Documentation Review

- [ ] Read [README.md](README.md)
- [ ] Read [QUICKSTART.md](QUICKSTART.md)
- [ ] Understand API endpoints
- [ ] Know how to backup database
- [ ] Know how to deploy

## 🚢 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No errors in console
- [ ] Email notifications working
- [ ] Database backups configured
- [ ] Environment variables documented
- [ ] Strong passwords set
- [ ] JWT secret is random and secure
- [ ] `.env` files not in git
- [ ] `.gitignore` configured correctly

## 📊 Performance Check

- [ ] Homepage loads in < 2 seconds
- [ ] API responses in < 500ms
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] No console warnings

## 🎯 Final Verification

Before going live:

- [ ] Test with real email addresses
- [ ] Test with real phone numbers (if using SMS)
- [ ] Test QR code scanning with phone
- [ ] Test PDF download on mobile
- [ ] Test all forms with validation
- [ ] Test with multiple concurrent users
- [ ] Backup database
- [ ] Document admin credentials securely
- [ ] Set up monitoring/alerts
- [ ] Have rollback plan ready

## ✨ Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] CDN configured
- [ ] Database backups automated
- [ ] Monitoring dashboard setup
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Custom email templates
- [ ] Branding/styling customized

## 📞 Support Contacts

Document these for your team:

- [ ] Database admin contact
- [ ] Email service support
- [ ] Hosting provider support
- [ ] Domain registrar support
- [ ] Technical lead contact

## 🎉 Go-Live Checklist

Day of launch:

- [ ] All systems operational
- [ ] Database backed up
- [ ] Admin credentials ready
- [ ] Email service tested
- [ ] Monitoring active
- [ ] Team briefed
- [ ] Support plan ready
- [ ] Rollback plan ready

---

## Status Summary

**Setup Complete When:**
- All checkboxes in "Functionality Testing" are checked ✅
- No errors in console
- Database has data
- Emails sending successfully
- Admin dashboard accessible

**Ready for Production When:**
- All checkboxes in "Pre-Deployment Checklist" are checked ✅
- Tested with real data
- Backups configured
- Monitoring active

---

**Current Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

Mark your overall status here: _______

**Notes:**
_______________________________________________________
_______________________________________________________
_______________________________________________________
