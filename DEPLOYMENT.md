# Deployment Guide

Complete guide for deploying the Wedding Invitation System to production.

## 🎯 Deployment Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │────────▶│    Backend      │
│   (Vercel/      │  HTTPS  │   (Railway/     │
│    Netlify)     │         │    Render)      │
└─────────────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   PostgreSQL    │
                            │    Database     │
                            └─────────────────┘
```

## Option 1: Railway (Recommended - Easiest)

### Backend + Database on Railway

**Why Railway?**
- Built-in PostgreSQL
- Automatic deployments from Git
- Free tier available
- Simple environment variable management

**Steps:**

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - Select the `server` directory as root

3. **Add PostgreSQL**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically creates database and sets `DATABASE_URL`

4. **Configure Environment Variables**
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=<generate-strong-random-string>
   ADMIN_EMAIL=admin@wedding.com
   ADMIN_PASSWORD=<secure-password>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=<app-password>
   EMAIL_FROM=Wedding <your_email@gmail.com>
   FRONTEND_URL=https://your-frontend.vercel.app
   WEDDING_COUPLE_NAMES=John & Jane
   WEDDING_DATE=2024-12-31
   WEDDING_VENUE=Beautiful Garden Venue
   ```

5. **Configure Database Connection**
   Railway provides `DATABASE_URL`, but you need individual vars:
   - Add custom start script in `server/package.json`:
   ```json
   "scripts": {
     "start": "node server.js",
     "railway-start": "npm run migrate && node server.js"
   }
   ```
   - Or parse `DATABASE_URL` in `config/database.js`

6. **Deploy**
   - Railway auto-deploys on push
   - Check logs for any errors
   - Run migrations: Railway CLI or add to start script

7. **Create Admin User**
   - Use Railway CLI: `railway run npm run setup`
   - Or use API endpoint after deployment

### Frontend on Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your repository
   - Root directory: `.` (project root)
   - Framework: Vite

3. **Configure**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel auto-deploys on push to main branch

---

## Option 2: Render

### Backend + Database on Render

**Why Render?**
- Free tier with PostgreSQL
- Easy deployment
- Automatic HTTPS

**Steps:**

1. **Create Render Account**
   - Go to [render.com](https://render.com)

2. **Create PostgreSQL Database**
   - Dashboard → New → PostgreSQL
   - Name: `wedding-invitation-db`
   - Free tier selected
   - Create Database
   - Copy Internal Database URL

3. **Create Web Service**
   - Dashboard → New → Web Service
   - Connect repository
   - Root Directory: `server`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm run migrate && npm start`

4. **Environment Variables**
   - Add all variables from `.env.example`
   - Use Internal Database URL for connection
   - Or set individual DB vars (DB_HOST, DB_PORT, etc.)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Check logs

### Frontend on Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)

2. **New Site from Git**
   - Connect repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy**
   - Netlify auto-deploys

---

## Option 3: Heroku

### Backend + Database on Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create wedding-invitation-api
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   heroku config:set ADMIN_EMAIL=admin@wedding.com
   # ... set all other vars
   ```

5. **Deploy**
   ```bash
   cd server
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a wedding-invitation-api
   git push heroku main
   ```

6. **Run Migrations**
   ```bash
   heroku run npm run migrate
   heroku run npm run setup
   ```

---

## Option 4: DigitalOcean App Platform

### Full Stack Deployment

1. **Create DigitalOcean Account**

2. **Create App**
   - Apps → Create App
   - Connect GitHub repository

3. **Configure Components**
   
   **Backend:**
   - Type: Web Service
   - Source Directory: `/server`
   - Build Command: `npm install`
   - Run Command: `npm start`
   
   **Database:**
   - Add PostgreSQL database
   - Link to backend component

4. **Environment Variables**
   - Add all backend environment variables
   - Use database connection string provided

5. **Frontend:**
   - Type: Static Site
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Deploy**
   - Review and create
   - Monitor deployment logs

---

## Post-Deployment Checklist

### Backend

- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Health check endpoint responding: `GET /api/health`
- [ ] CORS configured for frontend URL
- [ ] Email service tested
- [ ] Rate limiting active
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Monitoring/logging set up

### Frontend

- [ ] Build successful
- [ ] API URL configured correctly
- [ ] Can connect to backend
- [ ] All pages load
- [ ] Forms submit correctly
- [ ] QR codes generate
- [ ] PDFs download
- [ ] Responsive on mobile
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)

### Testing

- [ ] Submit test RSVP
- [ ] Receive confirmation email
- [ ] Admin login works
- [ ] Dashboard loads with stats
- [ ] Create/edit/delete guest
- [ ] Check-in guest
- [ ] Export CSV
- [ ] Fraud alerts working

---

## Database Backup Strategy

### Automated Backups

**Railway:**
- Automatic daily backups on paid plans
- Manual backups via dashboard

**Render:**
- Automatic daily backups on paid plans
- Manual export via dashboard

**Heroku:**
- `heroku pg:backups:capture`
- Schedule: `heroku pg:backups:schedule DATABASE_URL --at '02:00 America/Los_Angeles'`

### Manual Backup

```bash
# Export database
pg_dump -h hostname -U username -d database_name > backup.sql

# Import database
psql -h hostname -U username -d database_name < backup.sql
```

---

## Monitoring & Logging

### Application Monitoring

**Recommended Services:**
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: Full-stack monitoring
- **New Relic**: APM

### Log Management

**Railway/Render:**
- Built-in log viewing in dashboard

**Heroku:**
```bash
heroku logs --tail
```

**Custom Logging:**
- Winston or Pino for structured logging
- Send logs to CloudWatch, Papertrail, or Loggly

---

## SSL/HTTPS

All recommended platforms provide automatic HTTPS:
- Railway: Automatic
- Render: Automatic
- Vercel: Automatic
- Netlify: Automatic
- Heroku: Automatic

### Custom Domain

1. **Add domain in platform dashboard**
2. **Update DNS records:**
   - Add CNAME or A record
   - Point to platform's servers
3. **Wait for SSL certificate** (automatic)
4. **Update environment variables** with new URLs

---

## Scaling Considerations

### Database

- **Connection Pooling**: Already configured in `config/database.js`
- **Indexes**: Created in migrations for common queries
- **Upgrade Plan**: Move to larger database tier as guests grow

### Backend

- **Horizontal Scaling**: Most platforms auto-scale
- **Caching**: Add Redis for session storage if needed
- **CDN**: Use for static assets

### Frontend

- **CDN**: Vercel/Netlify include global CDN
- **Image Optimization**: Optimize QR codes and images
- **Code Splitting**: Vite handles automatically

---

## Cost Estimates

### Free Tier (Suitable for small weddings <100 guests)

- **Railway**: Free tier (500 hours/month)
- **Render**: Free tier (limited)
- **Vercel**: Free tier (unlimited)
- **Netlify**: Free tier (100GB bandwidth)

**Total: $0/month**

### Paid Tier (Recommended for production)

- **Railway**: $5-10/month (database + service)
- **Render**: $7/month (PostgreSQL) + $7/month (web service)
- **Vercel**: Free (frontend)

**Total: $5-15/month**

### Enterprise (Large weddings >500 guests)

- **DigitalOcean**: $12-25/month
- **AWS**: $20-50/month
- **Heroku**: $25-50/month

---

## Rollback Strategy

### Railway/Render

- Use dashboard to rollback to previous deployment
- Or redeploy specific commit

### Heroku

```bash
heroku releases
heroku rollback v123
```

### Database Rollback

```bash
# Restore from backup
psql -h hostname -U username -d database_name < backup.sql
```

---

## Security Hardening

### Production Checklist

- [ ] Strong JWT secret (32+ characters, random)
- [ ] Strong admin password
- [ ] Database password secured
- [ ] Email credentials secured
- [ ] No secrets in code/git
- [ ] HTTPS only
- [ ] CORS restricted to frontend domain
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (Helmet middleware)
- [ ] Regular dependency updates
- [ ] Database backups enabled
- [ ] Error messages don't leak sensitive info

### Environment Variables Security

- Never commit `.env` files
- Use platform's secret management
- Rotate secrets periodically
- Use different secrets for dev/staging/prod

---

## Troubleshooting Deployment

### Build Fails

- Check Node.js version compatibility
- Verify all dependencies in `package.json`
- Check build logs for specific errors
- Ensure `package-lock.json` committed

### Database Connection Fails

- Verify database credentials
- Check database is running
- Verify network connectivity
- Check connection string format

### CORS Errors

- Verify `FRONTEND_URL` in backend env vars
- Check CORS middleware configuration
- Ensure frontend uses correct API URL

### Email Not Sending

- Verify SMTP credentials
- Check email service logs
- Test with curl/Postman
- Check spam folder

---

## Support & Resources

### Platform Documentation

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Heroku Docs](https://devcenter.heroku.com)

### Community

- Railway Discord
- Render Community Forum
- Vercel Discord
- Stack Overflow

---

**Good luck with your deployment! 🚀**
