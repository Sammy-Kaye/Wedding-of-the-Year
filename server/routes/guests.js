import express from 'express';
import { nanoid } from 'nanoid';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { guestCreateValidation, validateRequest } from '../middleware/validation.js';
import { generateQRCode } from '../utils/qrCodeGenerator.js';
import { sendInvitation } from '../utils/emailService.js';

const router = express.Router();

// Get all guests (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, attending } = req.query;
    
    let queryText = 'SELECT * FROM guests';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(`(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR unique_code ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (attending !== undefined) {
      conditions.push(`attending = $${params.length + 1}`);
      params.push(attending === 'true');
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get guests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get guest by unique code (public)
router.get('/by-code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const result = await query(
      'SELECT * FROM guests WHERE unique_code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get guest by code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search guests by name (public, for RSVP form)
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name || name.length < 2) {
      return res.json([]);
    }

    const result = await query(
      `SELECT id, name, unique_code, attending, plus_one 
       FROM guests 
       WHERE name ILIKE $1 
       ORDER BY name 
       LIMIT 10`,
      [`%${name}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Search guests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new guest (admin only)
router.post('/', authenticateToken, guestCreateValidation, validateRequest, async (req, res) => {
  try {
    const { name, email, phone, plusOne } = req.body;
    const uniqueCode = nanoid(10);

    // Generate QR code
    const qrCodeData = await generateQRCode(uniqueCode);

    const result = await query(
      `INSERT INTO guests (name, email, phone, unique_code, qr_code_data, plus_one)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, phone, uniqueCode, qrCodeData, plusOne || false]
    );

    const guest = result.rows[0];

    // Log audit
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.id, 'create', 'guest', guest.id, JSON.stringify({ name, email })]
    );

    res.status(201).json(guest);
  } catch (error) {
    console.error('Create guest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send invitation email (admin only)
router.post('/:id/send-invitation', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM guests WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    const guest = result.rows[0];

    if (!guest.email) {
      return res.status(400).json({ error: 'Guest has no email address' });
    }

    await sendInvitation(guest, guest.qr_code_data);

    res.json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

// Update guest (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, plusOne, plusOneName } = req.body;

    const result = await query(
      `UPDATE guests 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           plus_one = COALESCE($4, plus_one),
           plus_one_name = COALESCE($5, plus_one_name)
       WHERE id = $6
       RETURNING *`,
      [name, email, phone, plusOne, plusOneName, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // Log audit
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.id, 'update', 'guest', id, JSON.stringify(req.body)]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update guest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete guest (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM guests WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // Log audit
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.id, 'delete', 'guest', id, JSON.stringify(result.rows[0])]
    );

    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Delete guest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
