import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const rsvpValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().trim(),
  body('attending').isBoolean().withMessage('Attending status must be boolean'),
  body('plusOne').optional().isBoolean(),
  body('plusOneName').optional().trim(),
  body('dietaryRestrictions').optional().trim(),
  body('specialRequests').optional().trim(),
];

export const checkInValidation = [
  body('uniqueCode').trim().notEmpty().withMessage('Unique code is required'),
  body('checkedInBy').optional().trim(),
  body('notes').optional().trim(),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const guestCreateValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().trim(),
  body('plusOne').optional().isBoolean(),
];
