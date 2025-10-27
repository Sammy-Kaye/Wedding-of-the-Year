# Wedding Invitation Backend API

A comprehensive backend API for managing wedding invitations, RSVPs, guest check-ins, and admin dashboard.

## Features

- **Guest Management**: Create, update, delete guests with unique codes and QR codes
- **RSVP System**: Public RSVP submission with email confirmations
- **Check-in System**: QR code scanning and guest check-in tracking
- **Admin Dashboard**: Statistics, activity logs, fraud detection
- **Email Notifications**: Automated invitation and RSVP confirmation emails
- **Authentication**: JWT-based admin authentication
- **Audit Logging**: Track all administrative actions
- **Rate Limiting**: Protect against abuse
- **Database**: PostgreSQL with migrations

## Tech Stack

- **Node.js** with Express
- **PostgreSQL** database
- **JWT** authentication
- **Nodemailer** for emails
- **bcryptjs** for password hashing
- **QRCode** generation
- **Helmet** for security
- **express-validator** for input validation

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE wedding_invitation;
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wedding_invitation
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret (generate a strong random string)
JWT_SECRET=your_secret_key_here

# Admin credentials
ADMIN_EMAIL=admin@wedding.com
ADMIN_PASSWORD=your_admin_password

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Wedding <your_email@gmail.com>

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### 4. Run Database Migrations

```bash
npm run migrate
```

### 5. Create Admin User

After starting the server, create an admin user:

```bash
curl -X POST http://localhost:3000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wedding.com",
    "password": "your_secure_password",
    "name": "Admin User"
  }'
```

### 6. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/setup-admin` - Create admin user (run once)

### Guests (Admin only)

- `GET /api/guests` - Get all guests (with search/filter)
- `GET /api/guests/by-code/:code` - Get guest by unique code
- `GET /api/guests/search?name=` - Search guests by name (public)
- `POST /api/guests` - Create new guest
- `PUT /api/guests/:id` - Update guest
- `DELETE /api/guests/:id` - Delete guest
- `POST /api/guests/:id/send-invitation` - Send invitation email

### RSVP (Public)

- `POST /api/rsvp` - Submit RSVP
- `GET /api/rsvp/:code` - Get RSVP by unique code

### Check-in (Admin only)

- `POST /api/checkin` - Check in a guest
- `GET /api/checkin` - Get all check-ins
- `GET /api/checkin/status/:code` - Get check-in status

### Admin Dashboard

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/activity` - Get recent activity logs
- `GET /api/admin/emails` - Get email logs
- `GET /api/admin/fraud-alerts` - Get fraud detection alerts
- `GET /api/admin/export/guests` - Export guest list as CSV

### Health Check

- `GET /api/health` - Server health check

## Email Configuration

### Gmail Setup

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the app password in `.env` as `EMAIL_PASSWORD`

### Other Email Providers

Update the SMTP settings in `.env`:
- `EMAIL_HOST`: SMTP server hostname
- `EMAIL_PORT`: SMTP port (usually 587 for TLS, 465 for SSL)
- `EMAIL_SECURE`: true for SSL, false for TLS
- `EMAIL_USER`: Your email username
- `EMAIL_PASSWORD`: Your email password

## Security Features

- **JWT Authentication**: Secure admin access with token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent brute force attacks
- **Helmet**: Security headers
- **Input Validation**: express-validator for all inputs
- **SQL Injection Protection**: Parameterized queries
- **CORS**: Configured for specific frontend origin

## Database Schema

### Tables

- **guests**: Guest information and RSVP data
- **check_ins**: Guest check-in records
- **admin_users**: Admin user accounts
- **audit_logs**: Activity tracking
- **email_logs**: Email delivery tracking
- **migrations**: Database migration tracking

## Development

### Running Migrations

```bash
npm run migrate
```

### Database Reset (Development only)

```sql
DROP DATABASE wedding_invitation;
CREATE DATABASE wedding_invitation;
```

Then run migrations again.

## Deployment

### Environment Variables

Ensure all production environment variables are set:
- Strong `JWT_SECRET`
- Production database credentials
- Production email credentials
- Correct `FRONTEND_URL`
- Set `NODE_ENV=production`

### Recommended Hosting

- **Heroku**: Easy PostgreSQL addon
- **Railway**: Simple deployment with PostgreSQL
- **DigitalOcean App Platform**: Managed PostgreSQL
- **AWS**: EC2 + RDS
- **Render**: Free tier available

### Production Checklist

- [ ] Set strong JWT secret
- [ ] Configure production database
- [ ] Set up email service
- [ ] Enable HTTPS
- [ ] Configure CORS for production frontend
- [ ] Set up database backups
- [ ] Monitor error logs
- [ ] Set up health check monitoring

## Troubleshooting

### Database Connection Issues

- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Check firewall settings

### Email Not Sending

- Verify SMTP credentials
- Check spam folder
- Enable "Less secure app access" or use App Passwords
- Check email service logs

### Migration Errors

- Ensure database exists
- Check database user permissions
- Review migration logs

## Support

For issues or questions, check the logs:
- Server logs: Console output
- Database logs: PostgreSQL logs
- Email logs: Check `email_logs` table

## License

ISC
