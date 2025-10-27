import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {};

    // Total guests
    const totalResult = await query('SELECT COUNT(*) FROM guests');
    stats.totalGuests = parseInt(totalResult.rows[0].count);

    // Attending
    const attendingResult = await query('SELECT COUNT(*) FROM guests WHERE attending = true');
    stats.attending = parseInt(attendingResult.rows[0].count);

    // Not attending
    const notAttendingResult = await query('SELECT COUNT(*) FROM guests WHERE attending = false');
    stats.notAttending = parseInt(notAttendingResult.rows[0].count);

    // Pending
    const pendingResult = await query('SELECT COUNT(*) FROM guests WHERE attending IS NULL');
    stats.pending = parseInt(pendingResult.rows[0].count);

    // Plus ones
    const plusOneResult = await query('SELECT COUNT(*) FROM guests WHERE plus_one = true AND attending = true');
    stats.plusOnes = parseInt(plusOneResult.rows[0].count);

    // Checked in
    const checkedInResult = await query('SELECT COUNT(DISTINCT guest_id) FROM check_ins');
    stats.checkedIn = parseInt(checkedInResult.rows[0].count);

    // Dietary restrictions count
    const dietaryResult = await query('SELECT COUNT(*) FROM guests WHERE dietary_restrictions IS NOT NULL AND dietary_restrictions != \'\'');
    stats.dietaryRestrictions = parseInt(dietaryResult.rows[0].count);

    // Recent RSVPs (last 7 days)
    const recentResult = await query(
      `SELECT COUNT(*) FROM guests 
       WHERE updated_at > NOW() - INTERVAL '7 days' 
       AND attending IS NOT NULL`
    );
    stats.recentRSVPs = parseInt(recentResult.rows[0].count);

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent activity
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const result = await query(
      `SELECT * FROM audit_logs 
       ORDER BY created_at DESC 
       LIMIT $1`,
      [limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get email logs
router.get('/emails', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const result = await query(
      `SELECT e.*, g.name as guest_name
       FROM email_logs e
       LEFT JOIN guests g ON e.guest_id = g.id
       ORDER BY e.sent_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get email logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get fraud detection alerts
router.get('/fraud-alerts', authenticateToken, async (req, res) => {
  try {
    const alerts = [];

    // Check for duplicate check-ins (shouldn't happen with DB constraints, but check anyway)
    const duplicateCheckIns = await query(
      `SELECT guest_id, COUNT(*) as count
       FROM check_ins
       GROUP BY guest_id
       HAVING COUNT(*) > 1`
    );

    for (const row of duplicateCheckIns.rows) {
      const guestResult = await query('SELECT name, unique_code FROM guests WHERE id = $1', [row.guest_id]);
      if (guestResult.rows.length > 0) {
        alerts.push({
          type: 'duplicate_checkin',
          severity: 'high',
          message: `Guest ${guestResult.rows[0].name} (${guestResult.rows[0].unique_code}) has multiple check-ins`,
          guestId: row.guest_id,
        });
      }
    }

    // Check for guests with same email
    const duplicateEmails = await query(
      `SELECT email, COUNT(*) as count, array_agg(name) as names
       FROM guests
       WHERE email IS NOT NULL AND email != ''
       GROUP BY email
       HAVING COUNT(*) > 1`
    );

    for (const row of duplicateEmails.rows) {
      alerts.push({
        type: 'duplicate_email',
        severity: 'medium',
        message: `Multiple guests share email ${row.email}: ${row.names.join(', ')}`,
        email: row.email,
      });
    }

    // Check for unusual RSVP patterns (e.g., many RSVPs in short time from same IP - would need IP tracking)
    // This is a placeholder for more sophisticated fraud detection

    res.json(alerts);
  } catch (error) {
    console.error('Get fraud alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export guest list as CSV
router.get('/export/guests', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT name, email, phone, unique_code, attending, plus_one, plus_one_name, 
              dietary_restrictions, special_requests, created_at, updated_at
       FROM guests
       ORDER BY name`
    );

    // Convert to CSV
    const headers = ['Name', 'Email', 'Phone', 'Unique Code', 'Attending', 'Plus One', 'Plus One Name', 'Dietary Restrictions', 'Special Requests', 'Created At', 'Updated At'];
    const csvRows = [headers.join(',')];

    for (const row of result.rows) {
      const values = [
        `"${row.name}"`,
        `"${row.email || ''}"`,
        `"${row.phone || ''}"`,
        `"${row.unique_code}"`,
        row.attending === null ? 'Pending' : (row.attending ? 'Yes' : 'No'),
        row.plus_one ? 'Yes' : 'No',
        `"${row.plus_one_name || ''}"`,
        `"${row.dietary_restrictions || ''}"`,
        `"${row.special_requests || ''}"`,
        `"${row.created_at}"`,
        `"${row.updated_at}"`,
      ];
      csvRows.push(values.join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=guests.csv');
    res.send(csvRows.join('\n'));
  } catch (error) {
    console.error('Export guests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
