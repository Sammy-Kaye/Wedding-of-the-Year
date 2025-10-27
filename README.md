# Wedding Invitation System - Full Stack

A comprehensive wedding invitation management system with RSVP tracking, guest check-ins, QR codes, and admin dashboard.

## 🎯 Features

### Frontend (React + Vite)
- **Beautiful Homepage**: Modern wedding invitation landing page
- **RSVP Form**: Guest search and RSVP submission with validation
- **QR Code Generation**: Unique QR codes for each guest
- **PDF Downloads**: Download invitation with QR code
- **Check-in Interface**: Scan QR codes or enter codes manually
- **Admin Dashboard**: Comprehensive statistics and guest management
- **Responsive Design**: Works on all devices

### Backend (Node.js + Express + PostgreSQL)
- **RESTful API**: Complete API for all operations
- **Database Persistence**: PostgreSQL for reliable data storage
- **Authentication**: JWT-based admin authentication
- **Email Notifications**: Automated invitation and RSVP confirmations
- **Audit Logging**: Track all administrative actions
- **Fraud Detection**: Identify duplicate check-ins and suspicious activity
- **Rate Limiting**: Protect against abuse
- **CSV Export**: Download guest lists

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm or yarn

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE wedding_invitation;
```

### 3. Configure Environment Variables

**Backend** (`server/.env`):
```bash
cd server
cp .env.example .env
# Edit .env with your settings
```

**Frontend** (`.env`):
```bash
cp .env.example .env
# Default: VITE_API_URL=http://localhost:3000/api
```

### 4. Run Database Migrations

```bash
cd server
npm run migrate
```

### 5. Create Admin User

```bash
cd server
npm run setup
# Follow prompts to create admin user
```

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:3001
```

## 📁 Project Structure

```
wedding-invitation/
├── server/                          # Backend API
│   ├── config/
│   │   └── database.js             # Database configuration
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication
│   │   └── validation.js           # Request validation
│   ├── migrations/
│   │   ├── 001_initial_schema.sql  # Database schema
│   │   └── run-migrations.js       # Migration runner
│   ├── routes/
│   │   ├── auth.js                 # Authentication routes
│   │   ├── guests.js               # Guest management
│   │   ├── rsvp.js                 # RSVP submission
│   │   ├── checkin.js              # Check-in system
│   │   └── admin.js                # Admin dashboard
│   ├── scripts/
│   │   └── setup.js                # Admin setup script
│   ├── utils/
│   │   ├── emailService.js         # Email notifications
│   │   └── qrCodeGenerator.js      # QR code generation
│   ├── .env.example                # Environment template
│   ├── package.json
│   ├── server.js                   # Main server file
│   └── README.md                   # Backend documentation
├── src/
│   ├── services/
│   │   └── api.ts                  # API service layer
│   ├── main.jsx                    # React entry point
│   ├── index.css                   # Global styles
│   └── vite-env.d.ts              # TypeScript definitions
├── wedding-invitation-system-enhanced.tsx  # Main React component
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

See `server/.env.example` for all options:

- **Database**: PostgreSQL connection settings
- **JWT**: Secret key for authentication
- **Email**: SMTP configuration (Gmail, SendGrid, etc.)
- **Admin**: Initial admin credentials
- **CORS**: Frontend URL for CORS

### Frontend Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:3000/api)

## 📚 API Documentation

### Public Endpoints

- `POST /api/rsvp` - Submit RSVP
- `GET /api/rsvp/:code` - Get RSVP by code
- `GET /api/guests/search?name=` - Search guests
- `GET /api/guests/by-code/:code` - Get guest by code
- `GET /api/checkin/status/:code` - Check-in status

### Admin Endpoints (Require Authentication)

**Authentication:**
- `POST /api/auth/login` - Admin login

**Guest Management:**
- `GET /api/guests` - List all guests
- `POST /api/guests` - Create guest
- `PUT /api/guests/:id` - Update guest
- `DELETE /api/guests/:id` - Delete guest
- `POST /api/guests/:id/send-invitation` - Send invitation email

**Check-in:**
- `POST /api/checkin` - Check in guest
- `GET /api/checkin` - List all check-ins

**Dashboard:**
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/activity` - Activity logs
- `GET /api/admin/emails` - Email logs
- `GET /api/admin/fraud-alerts` - Fraud detection
- `GET /api/admin/export/guests` - Export CSV

## 🔐 Security Features

- JWT authentication for admin access
- Password hashing with bcrypt
- Rate limiting on all endpoints
- SQL injection protection (parameterized queries)
- XSS protection with Helmet
- CORS configuration
- Input validation on all endpoints
- Audit logging for all admin actions

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-factor authentication
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Use app password in `server/.env`

### Other Providers

Update SMTP settings in `server/.env`:
- SendGrid, Mailgun, AWS SES, etc.

## 🚢 Deployment

### Backend Deployment Options

**Recommended Platforms:**
- **Railway**: Easy PostgreSQL setup
- **Heroku**: Heroku Postgres addon
- **Render**: Free tier with PostgreSQL
- **DigitalOcean App Platform**: Managed PostgreSQL
- **AWS**: EC2 + RDS

**Deployment Steps:**
1. Set environment variables
2. Run migrations
3. Create admin user
4. Start server

### Frontend Deployment Options

**Recommended Platforms:**
- **Vercel**: Zero-config deployment
- **Netlify**: Easy static hosting
- **Cloudflare Pages**: Fast global CDN
- **AWS S3 + CloudFront**: Scalable hosting

**Build Command:**
```bash
npm run build
```

**Output Directory:** `dist`

### Environment Variables for Production

**Backend:**
- Set strong `JWT_SECRET`
- Use production database
- Configure production email service
- Set `NODE_ENV=production`
- Update `FRONTEND_URL` to production URL

**Frontend:**
- Set `VITE_API_URL` to production API URL

## 🧪 Testing

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] RSVP form submission works
- [ ] Email confirmations sent
- [ ] QR codes generated
- [ ] PDF downloads work
- [ ] Check-in system functional
- [ ] Admin login works
- [ ] Dashboard shows correct stats
- [ ] Guest management (CRUD) works
- [ ] Fraud detection alerts appear

### API Testing

Use tools like Postman or curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wedding.com","password":"your_password"}'
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure database exists

### Email Not Sending
- Verify SMTP credentials
- Check spam folder
- Review email logs in database

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check browser console for details

### Build Errors
- Clear `node_modules` and reinstall
- Check Node.js version (v18+)
- Verify all dependencies installed

## 📝 Migration from localStorage Version

If you're migrating from the localStorage version:

1. **Export existing data** (if any) from browser localStorage
2. **Set up backend** following Quick Start
3. **Import data** using admin interface or API
4. **Update frontend** to use new API service layer
5. **Test thoroughly** before going live

## 🤝 Contributing

This is a wedding invitation system. Customize as needed:

- Update wedding details in `server/.env`
- Modify frontend styling in `wedding-invitation-system-enhanced.tsx`
- Add custom email templates in `server/utils/emailService.js`
- Extend API with additional features

## 📄 License

ISC

## 🎉 Features Roadmap

- [ ] SMS notifications (Twilio integration)
- [ ] Photo gallery
- [ ] Gift registry integration
- [ ] Seating chart management
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Wedding website builder

## 💡 Tips

- **Backup database regularly** in production
- **Test email sending** before sending invitations
- **Monitor rate limits** if expecting high traffic
- **Use environment-specific configs** for dev/staging/prod
- **Keep JWT secret secure** and rotate periodically

## 📞 Support

For issues:
1. Check logs (server console, browser console)
2. Review documentation
3. Check database for errors
4. Verify environment variables

---

Made with ❤️ for your special day!
