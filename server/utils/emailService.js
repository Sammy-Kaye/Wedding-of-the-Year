import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { query } from '../config/database.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendRSVPConfirmation = async (guest) => {
  if (!guest.email) {
    console.log('No email provided for guest:', guest.name);
    return;
  }

  const attendingText = guest.attending 
    ? 'We are delighted to confirm your attendance!' 
    : 'We are sorry you cannot make it.';

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: guest.email,
    subject: `RSVP Confirmation - ${process.env.WEDDING_COUPLE_NAMES} Wedding`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568;">RSVP Confirmation</h2>
        <p>Dear ${guest.name},</p>
        <p>${attendingText}</p>
        ${guest.attending ? `
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Wedding Details</h3>
            <p><strong>Date:</strong> ${process.env.WEDDING_DATE}</p>
            <p><strong>Venue:</strong> ${process.env.WEDDING_VENUE}</p>
            <p><strong>Your Unique Code:</strong> <code style="background-color: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${guest.unique_code}</code></p>
            ${guest.plus_one ? `<p><strong>Plus One:</strong> ${guest.plus_one_name || 'Yes'}</p>` : ''}
            ${guest.dietary_restrictions ? `<p><strong>Dietary Restrictions:</strong> ${guest.dietary_restrictions}</p>` : ''}
          </div>
          <p>Please bring your unique code for check-in at the venue.</p>
        ` : ''}
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p style="margin-top: 30px;">With love,<br>${process.env.WEDDING_COUPLE_NAMES}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    
    // Log email sent
    await query(
      `INSERT INTO email_logs (guest_id, email_type, recipient_email, subject, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [guest.id, 'rsvp_confirmation', guest.email, mailOptions.subject, 'sent']
    );
    
    console.log('RSVP confirmation email sent to:', guest.email);
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Log email error
    await query(
      `INSERT INTO email_logs (guest_id, email_type, recipient_email, subject, status, error_message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [guest.id, 'rsvp_confirmation', guest.email, mailOptions.subject, 'failed', error.message]
    );
    
    throw error;
  }
};

export const sendInvitation = async (guest, qrCodeDataUrl) => {
  if (!guest.email) {
    console.log('No email provided for guest:', guest.name);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: guest.email,
    subject: `You're Invited! ${process.env.WEDDING_COUPLE_NAMES} Wedding`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568; text-align: center;">You're Invited!</h2>
        <p>Dear ${guest.name},</p>
        <p>We are delighted to invite you to our wedding celebration!</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0;">${process.env.WEDDING_COUPLE_NAMES}</h3>
          <p><strong>Date:</strong> ${process.env.WEDDING_DATE}</p>
          <p><strong>Venue:</strong> ${process.env.WEDDING_VENUE}</p>
        </div>
        <p style="text-align: center;">
          <strong>Your Unique Code:</strong><br>
          <code style="background-color: #e2e8f0; padding: 8px 16px; border-radius: 4px; font-size: 18px;">${guest.unique_code}</code>
        </p>
        ${qrCodeDataUrl ? `
          <div style="text-align: center; margin: 20px 0;">
            <p><strong>Your QR Code:</strong></p>
            <img src="${qrCodeDataUrl}" alt="QR Code" style="max-width: 200px;">
          </div>
        ` : ''}
        <p style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}/rsvp?code=${guest.unique_code}" 
             style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            RSVP Now
          </a>
        </p>
        <p style="margin-top: 30px;">We hope to see you there!</p>
        <p>With love,<br>${process.env.WEDDING_COUPLE_NAMES}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    
    await query(
      `INSERT INTO email_logs (guest_id, email_type, recipient_email, subject, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [guest.id, 'invitation', guest.email, mailOptions.subject, 'sent']
    );
    
    console.log('Invitation email sent to:', guest.email);
  } catch (error) {
    console.error('Error sending invitation:', error);
    
    await query(
      `INSERT INTO email_logs (guest_id, email_type, recipient_email, subject, status, error_message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [guest.id, 'invitation', guest.email, mailOptions.subject, 'failed', error.message]
    );
    
    throw error;
  }
};
