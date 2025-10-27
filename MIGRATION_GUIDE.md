# Migration Guide: localStorage to Backend

Guide for migrating from the localStorage version (Option 1) to the full backend version (Option 2).

## Overview

You're transitioning from:
- **Before**: Browser localStorage (data stored locally, no persistence across devices)
- **After**: PostgreSQL database (true multi-user, persistent, accessible anywhere)

## Why Migrate?

### Problems with localStorage
- ❌ Data lost when browser cache cleared
- ❌ No multi-device access
- ❌ No real-time updates
- ❌ No email notifications
- ❌ Limited to single browser
- ❌ No admin authentication
- ❌ No audit logging

### Benefits of Backend
- ✅ Persistent database storage
- ✅ Access from any device
- ✅ Real-time updates
- ✅ Email notifications
- ✅ Secure admin authentication
- ✅ Audit logging and fraud detection
- ✅ Data export capabilities
- ✅ Scalable for large weddings

## Migration Steps

### Phase 1: Backup Existing Data (If Any)

If you have test data in localStorage:

1. **Open browser console** (F12)
2. **Export data:**
   ```javascript
   // Copy this to console
   const guests = JSON.parse(localStorage.getItem('weddingGuests') || '[]');
   const checkIns = JSON.parse(localStorage.getItem('weddingCheckIns') || '[]');
   
   console.log('Guests:', JSON.stringify(guests, null, 2));
   console.log('Check-ins:', JSON.stringify(checkIns, null, 2));
   
   // Download as file
   const data = { guests, checkIns };
   const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'wedding-data-backup.json';
   a.click();
   ```

3. **Save the downloaded file** for reference

### Phase 2: Setup Backend

Follow the [QUICKSTART.md](QUICKSTART.md) guide:

1. Install dependencies
2. Setup PostgreSQL
3. Configure environment variables
4. Run migrations
5. Create admin user
6. Start servers

### Phase 3: Import Data (Optional)

If you have existing data to import:

#### Option A: Manual Import via Admin Dashboard

1. Login to admin dashboard
2. Add each guest manually using the "Add Guest" form
3. Guests will get new unique codes and QR codes

#### Option B: Bulk Import via API

Create a script to import your data:

```javascript
// import-data.js
const fs = require('fs');

const API_URL = 'http://localhost:3000/api';
let authToken = '';

async function login() {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@wedding.com',
      password: 'your_password'
    })
  });
  const data = await response.json();
  authToken = data.token;
}

async function importGuest(guest) {
  const response = await fetch(`${API_URL}/guests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      plusOne: guest.plusOne
    })
  });
  return response.json();
}

async function main() {
  // Read backup file
  const backup = JSON.parse(fs.readFileSync('wedding-data-backup.json', 'utf8'));
  
  // Login
  await login();
  console.log('Logged in successfully');
  
  // Import guests
  for (const guest of backup.guests) {
    try {
      const result = await importGuest(guest);
      console.log(`Imported: ${guest.name} -> ${result.unique_code}`);
    } catch (error) {
      console.error(`Failed to import ${guest.name}:`, error.message);
    }
  }
  
  console.log('Import complete!');
}

main();
```

Run the script:
```bash
node import-data.js
```

### Phase 4: Update Frontend Code

The frontend needs to use the new API service instead of localStorage.

#### Current Code (localStorage)
```typescript
// Old way - localStorage
const guests = JSON.parse(localStorage.getItem('weddingGuests') || '[]');
localStorage.setItem('weddingGuests', JSON.stringify(guests));
```

#### New Code (API)
```typescript
// New way - API
import { guestAPI } from './services/api';

// Get guests
const guests = await guestAPI.getAll();

// Create guest
const newGuest = await guestAPI.create({ name, email, phone });
```

#### Key Changes

1. **Import API service:**
   ```typescript
   import { authAPI, guestAPI, rsvpAPI, checkinAPI, adminAPI } from './services/api';
   ```

2. **Replace localStorage calls with API calls:**
   - `localStorage.getItem()` → `await guestAPI.getAll()`
   - `localStorage.setItem()` → `await guestAPI.create()` or `update()`

3. **Add authentication:**
   ```typescript
   // Login
   await authAPI.login(email, password);
   
   // Check if authenticated
   if (authAPI.isAuthenticated()) {
     // Show admin features
   }
   ```

4. **Handle async operations:**
   ```typescript
   // Add loading states
   const [loading, setLoading] = useState(false);
   
   // Handle errors
   try {
     setLoading(true);
     const result = await guestAPI.create(data);
     // Success
   } catch (error) {
     // Show error message
     alert(error.message);
   } finally {
     setLoading(false);
   }
   ```

### Phase 5: Testing

Test all functionality:

#### Guest Management
- [ ] Create guest
- [ ] View guest list
- [ ] Search guests
- [ ] Update guest
- [ ] Delete guest
- [ ] Send invitation email

#### RSVP
- [ ] Search for guest
- [ ] Submit RSVP (attending)
- [ ] Submit RSVP (not attending)
- [ ] Receive email confirmation
- [ ] View RSVP details

#### Check-in
- [ ] Check in with unique code
- [ ] Check in with QR code scan
- [ ] View check-in list
- [ ] Prevent duplicate check-ins

#### Admin Dashboard
- [ ] Login with credentials
- [ ] View statistics
- [ ] View recent activity
- [ ] View fraud alerts
- [ ] Export guest list CSV

### Phase 6: Clean Up

1. **Remove localStorage code:**
   - Search for `localStorage.getItem`
   - Search for `localStorage.setItem`
   - Remove or comment out old code

2. **Update documentation:**
   - Update any custom docs you created
   - Note the migration date

3. **Clear browser data:**
   ```javascript
   // In browser console
   localStorage.clear();
   ```

## Code Comparison

### Before: localStorage Version

```typescript
// Get guests
const getGuests = () => {
  const stored = localStorage.getItem('weddingGuests');
  return stored ? JSON.parse(stored) : [];
};

// Add guest
const addGuest = (guest) => {
  const guests = getGuests();
  const newGuest = {
    ...guest,
    id: Date.now(),
    uniqueCode: generateCode(),
  };
  guests.push(newGuest);
  localStorage.setItem('weddingGuests', JSON.stringify(guests));
  return newGuest;
};

// Update guest
const updateGuest = (id, updates) => {
  const guests = getGuests();
  const index = guests.findIndex(g => g.id === id);
  if (index !== -1) {
    guests[index] = { ...guests[index], ...updates };
    localStorage.setItem('weddingGuests', JSON.stringify(guests));
  }
};
```

### After: API Version

```typescript
import { guestAPI } from './services/api';

// Get guests
const getGuests = async () => {
  return await guestAPI.getAll();
};

// Add guest
const addGuest = async (guest) => {
  return await guestAPI.create(guest);
};

// Update guest
const updateGuest = async (id, updates) => {
  return await guestAPI.update(id, updates);
};
```

## Common Issues During Migration

### Issue 1: CORS Errors

**Symptom:** `Access-Control-Allow-Origin` error in console

**Fix:**
1. Verify `FRONTEND_URL` in `server/.env`
2. Restart backend server
3. Clear browser cache

### Issue 2: Authentication Errors

**Symptom:** `401 Unauthorized` or `403 Forbidden`

**Fix:**
1. Login again to get new token
2. Check token is being sent in headers
3. Verify JWT_SECRET is set in backend

### Issue 3: Data Not Persisting

**Symptom:** Data disappears after refresh

**Fix:**
1. Check database connection
2. Verify API calls are completing successfully
3. Check browser console for errors
4. Verify data in database:
   ```sql
   SELECT * FROM guests;
   ```

### Issue 4: Email Not Sending

**Symptom:** RSVP submitted but no email received

**Fix:**
1. Check email configuration in `server/.env`
2. Check spam folder
3. Review email logs:
   ```sql
   SELECT * FROM email_logs ORDER BY sent_at DESC;
   ```
4. Test email service separately

## Rollback Plan

If you need to rollback to localStorage version:

1. **Keep old code in git:**
   ```bash
   git checkout <old-commit-hash>
   ```

2. **Or keep localStorage as fallback:**
   ```typescript
   // Hybrid approach during transition
   const getGuests = async () => {
     try {
       return await guestAPI.getAll();
     } catch (error) {
       // Fallback to localStorage
       console.warn('API failed, using localStorage');
       return JSON.parse(localStorage.getItem('weddingGuests') || '[]');
     }
   };
   ```

## Timeline Recommendation

### Week 1: Setup & Testing
- Day 1-2: Setup backend and database
- Day 3-4: Import existing data
- Day 5-7: Test all features

### Week 2: Migration
- Day 1-3: Update frontend code
- Day 4-5: Integration testing
- Day 6-7: User acceptance testing

### Week 3: Deployment
- Day 1-3: Deploy to staging
- Day 4-5: Final testing
- Day 6-7: Deploy to production

## Post-Migration Checklist

- [ ] All data migrated successfully
- [ ] All features working
- [ ] Email notifications working
- [ ] Admin authentication working
- [ ] Database backups configured
- [ ] Monitoring setup
- [ ] Documentation updated
- [ ] Team trained on new system
- [ ] Old localStorage code removed
- [ ] Production deployment complete

## Support

If you encounter issues during migration:

1. Check logs (server console, browser console, database logs)
2. Review error messages carefully
3. Consult [README.md](README.md) and [QUICKSTART.md](QUICKSTART.md)
4. Check database state directly
5. Test API endpoints with Postman/curl

---

**Congratulations on migrating to the full backend system! 🎉**
