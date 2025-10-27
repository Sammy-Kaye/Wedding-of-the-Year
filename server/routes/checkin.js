import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkInValidation, validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Check in a guest
router.post('/', authenticateToken, checkInValidation, validateRequest, async (req, res) => {
  try {
    const { uniqueCode, checkedInBy, notes } = req.body;

    // Find guest
    const guestResult = await query(
      'SELECT * FROM guests WHERE unique_code = $1',
      [uniqueCode]
    );

    if (guestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    const guest = guestResult.rows[0];

    // Check if already checked in
    const existingCheckIn = await query(
      'SELECT * FROM check_ins WHERE guest_id = $1',
      [guest.id]
    );

    if (existingCheckIn.rows.length > 0) {
      return res.status(400).json({
        error: 'Guest already checked in',
        checkIn: existingCheckIn.rows[0],
      });
    }

    // Create check-in record
    const result = await query(
      `INSERT INTO check_ins (guest_id, checked_in_by, notes)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [guest.id, checkedInBy || req.user.email, notes]
    );

    // Log audit
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.id, 'check_in', 'guest', guest.id, JSON.stringify({ uniqueCode })]
    );

    res.json({
      message: 'Guest checked in successfully',
      checkIn: result.rows[0],
      guest,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all check-ins
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, g.name, g.email, g.unique_code, g.plus_one, g.plus_one_name
       FROM check_ins c
       JOIN guests g ON c.guest_id = g.id
       ORDER BY c.checked_in_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get check-ins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get check-in status by unique code
router.get('/status/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const result = await query(
      `SELECT c.*, g.name, g.unique_code
       FROM check_ins c
       JOIN guests g ON c.guest_id = g.id
       WHERE g.unique_code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.json({ checkedIn: false });
    }

    res.json({
      checkedIn: true,
      checkIn: result.rows[0],
    });
  } catch (error) {
    console.error('Get check-in status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
