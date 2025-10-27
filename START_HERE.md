# 🎊 START HERE - Wedding Invitation System

Welcome! You now have a complete, production-ready wedding invitation system with full backend support.

## 🎯 What You Have

A **full-stack wedding invitation management system** featuring:

- ✅ **PostgreSQL Database** - Persistent, reliable data storage
- ✅ **RESTful API** - Complete backend with 20+ endpoints
- ✅ **Admin Dashboard** - Manage guests, RSVPs, and check-ins
- ✅ **Email Notifications** - Automated invitations and confirmations
- ✅ **QR Code System** - Generate and scan QR codes
- ✅ **Security** - JWT authentication, rate limiting, audit logging
- ✅ **Deployment Ready** - Works with Railway, Render, Vercel, Netlify

## 📚 Documentation Guide

### New to the System? Start Here:

1. **[QUICKSTART.md](QUICKSTART.md)** ⭐ **START HERE**
   - 5-minute setup guide
   - Step-by-step instructions
   - Get running locally in minutes

2. **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)**
   - Comprehensive checklist
   - Verify everything works
   - Testing guide

### Understanding the System:

3. **[README.md](README.md)**
   - Complete project overview
   - Features and architecture
   - Technology stack

4. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**
   - What has been implemented
   - File structure
   - Feature comparison

5. **[server/README.md](server/README.md)**
   - API documentation
   - Endpoint reference
   - Backend configuration

### Migrating from localStorage?

6. **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)**
   - Step-by-step migration
   - Data import instructions
   - Code comparison

### Ready to Deploy?

7. **[DEPLOYMENT.md](DEPLOYMENT.md)**
   - Production deployment guide
   - Platform recommendations
   - Security checklist

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
cd server && npm install && cd ..
```

### 2. Setup Database
```bash
# Create PostgreSQL database
createdb wedding_invitation

# Run migrations
cd server
npm run migrate
```

### 3. Configure Environment
```bash
# Backend
cd server
cp .env.example .env
# Edit .env with your settings

# Frontend
cd ..
cp .env.example .env
```

### 4. Create Admin User
```bash
cd server
npm run setup
```

### 5. Start Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 6. Access Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **Admin Login**: Click "Admin" button on homepage

## 📁 Project Structure

```
wedding-invitation/
├── server/              # Backend (Node.js + Express + PostgreSQL)
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, validation
│   ├── migrations/     # Database schema
│   ├── utils/          # Email, QR codes
│   └── server.js       # Main server
├── src/
│   ├── services/       # API client
│   └── main.jsx        # React entry
├── wedding-invitation-system-enhanced.tsx  # Main component
└── Documentation files (this and others)
```

## 🔑 Key Features

### For Guests
- Search and submit RSVP
- Receive email confirmations
- Download PDF invitations with QR codes
- Specify dietary restrictions and special requests

### For Admins
- Manage guest list (create, edit, delete)
- Send invitation emails
- Track RSVPs in real-time
- Check in guests with QR codes
- View statistics and analytics
- Export guest lists to CSV
- Monitor fraud alerts

### Technical
- JWT authentication for admin access
- Email notifications (invitations, confirmations)
- QR code generation and scanning
- Audit logging for all actions
- Rate limiting and security
- Database backups and migrations

## 🎓 Learning Path

### Beginner
1. Follow [QUICKSTART.md](QUICKSTART.md)
2. Test basic features (create guest, submit RSVP)
3. Explore admin dashboard

### Intermediate
1. Read [README.md](README.md) for full overview
2. Review API endpoints in [server/README.md](server/README.md)
3. Customize email templates
4. Modify frontend styling

### Advanced
1. Study database schema (`server/migrations/001_initial_schema.sql`)
2. Extend API with custom endpoints
3. Deploy to production ([DEPLOYMENT.md](DEPLOYMENT.md))
4. Set up monitoring and backups

## ⚙️ Configuration

### Minimum Required Settings

**Backend** (`server/.env`):
```env
# Database
DB_HOST=localhost
DB_NAME=wedding_invitation
DB_USER=postgres
DB_PASSWORD=your_password

# Security
JWT_SECRET=random_32_char_string

# Admin
ADMIN_EMAIL=admin@wedding.com
ADMIN_PASSWORD=secure_password

# Email (for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

## 🧪 Testing Your Setup

### Quick Test Checklist
- [ ] Both servers start without errors
- [ ] Can login to admin dashboard
- [ ] Can create a test guest
- [ ] Can submit test RSVP
- [ ] Email confirmation received
- [ ] Can check in guest
- [ ] Dashboard shows statistics

### Full Test
See [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) for comprehensive testing.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Verify PostgreSQL is running
pg_isready

# Check credentials in server/.env
```

**Port Already in Use**
```bash
# Kill process on port 3000 (backend)
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill -9
```

**Email Not Sending**
- Check SMTP credentials in `server/.env`
- Use app password (not regular password) for Gmail
- Check spam folder

**CORS Errors**
- Verify `FRONTEND_URL` in `server/.env`
- Restart backend server after changing `.env`

## 📞 Getting Help

1. **Check Documentation**
   - Start with [QUICKSTART.md](QUICKSTART.md)
   - Review [README.md](README.md)
   - Check [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)

2. **Check Logs**
   - Backend: Terminal where server is running
   - Frontend: Browser console (F12)
   - Database: PostgreSQL logs

3. **Verify Configuration**
   - All environment variables set
   - Database created and accessible
   - Migrations completed successfully

## 🚢 Deployment

When ready for production:

1. **Read** [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Choose platform**: Railway (recommended), Render, or Heroku
3. **Deploy backend** with PostgreSQL database
4. **Deploy frontend** to Vercel or Netlify
5. **Configure** environment variables
6. **Test** thoroughly before going live

### Recommended Stack
- **Backend**: Railway (includes PostgreSQL)
- **Frontend**: Vercel
- **Cost**: $0-15/month

## 📊 What's Next?

### Immediate (Today)
1. ✅ Follow [QUICKSTART.md](QUICKSTART.md) to get running
2. ✅ Create test guest and submit RSVP
3. ✅ Verify email notifications work

### Short-term (This Week)
1. Customize wedding details in `server/.env`
2. Add your guest list
3. Customize email templates
4. Test with real email addresses

### Medium-term (Before Wedding)
1. Deploy to production
2. Send invitations to guests
3. Monitor RSVPs
4. Prepare check-in devices

### Long-term (After Wedding)
1. Export final guest list
2. Backup database
3. Archive the system

## 🎨 Customization

### Easy Customizations
- Wedding details (names, date, venue) in `server/.env`
- Email templates in `server/utils/emailService.js`
- Frontend colors in `tailwind.config.js`

### Advanced Customizations
- Add custom fields to database schema
- Create new API endpoints
- Extend frontend components
- Add SMS notifications (Twilio)

## 📖 Additional Resources

### Documentation Files
- `README.md` - Main documentation
- `QUICKSTART.md` - Quick setup guide ⭐
- `DEPLOYMENT.md` - Production deployment
- `MIGRATION_GUIDE.md` - localStorage migration
- `IMPLEMENTATION_SUMMARY.md` - What's implemented
- `SETUP_CHECKLIST.md` - Testing checklist
- `server/README.md` - API documentation

### Code Files
- `server/server.js` - Main backend server
- `server/routes/` - API endpoints
- `src/services/api.ts` - Frontend API client
- `wedding-invitation-system-enhanced.tsx` - Main React component

## ✨ Features at a Glance

| Feature | Status | Documentation |
|---------|--------|---------------|
| Guest Management | ✅ Ready | server/routes/guests.js |
| RSVP System | ✅ Ready | server/routes/rsvp.js |
| Check-in System | ✅ Ready | server/routes/checkin.js |
| Admin Dashboard | ✅ Ready | server/routes/admin.js |
| Email Notifications | ✅ Ready | server/utils/emailService.js |
| QR Codes | ✅ Ready | server/utils/qrCodeGenerator.js |
| Authentication | ✅ Ready | server/middleware/auth.js |
| Database | ✅ Ready | server/migrations/ |
| API Client | ✅ Ready | src/services/api.ts |
| Documentation | ✅ Ready | All .md files |

## 🎯 Success Metrics

Your system is ready when:
- ✅ All servers start without errors
- ✅ Admin can login
- ✅ Guests can be created
- ✅ RSVPs can be submitted
- ✅ Emails are received
- ✅ Check-ins work
- ✅ Dashboard shows data

## 🎉 Ready to Begin?

**Next Step**: Open [QUICKSTART.md](QUICKSTART.md) and follow the 5-minute setup!

```bash
# Quick command to get started
npm install && cd server && npm install && npm run migrate && npm run setup
```

---

**Questions?** Check the documentation files above or review the code comments.

**Good luck with your wedding! 💒**
