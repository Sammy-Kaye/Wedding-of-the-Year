import express from 'express';
import { query } from '../config/database.js';
import { rsvpValidation, validateRequest } from '../middleware/validation.js';
import { sendRSVPConfirmation } from '../utils/emailService.js';

const router = express.Router();

// Submit RSVP
router.post('/', rsvpValidation, validateRequest, async (req, res) => {
  try {
    const {
      uniqueCode,
      name,
      email,
      phone,
      attending,
      plusOne,
      plusOneName,
      dietaryRestrictions,
      specialRequests,
    } = req.body;

    // Find guest by unique code
    const guestResult = await query(
      'SELECT * FROM guests WHERE unique_code = $1',
      [uniqueCode]
    );

    if (guestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid unique code' });
    }

    const guest = guestResult.rows[0];

    // Update guest with RSVP information
    const result = await query(
      `UPDATE guests 
       SET name = $1,
           email = $2,
           phone = $3,
           attending = $4,
           plus_one = $5,
           plus_one_name = $6,
           dietary_restrictions = $7,
           special_requests = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE unique_code = $9
       RETURNING *`,
      [
        name,
        email,
        phone,
        attending,
        plusOne,
        plusOneName,
        dietaryRestrictions,
        specialRequests,
        uniqueCode,
      ]
    );

    const updatedGuest = result.rows[0];

    // Send confirmation email
    try {
      if (email) {
        await sendRSVPConfirmation(updatedGuest);
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the RSVP if email fails
    }

    res.json({
      message: 'RSVP submitted successfully',
      guest: updatedGuest,
    });
  } catch (error) {
    console.error('RSVP submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get RSVP by unique code
router.get('/:code', async (req, res) => {
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
    console.error('Get RSVP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
