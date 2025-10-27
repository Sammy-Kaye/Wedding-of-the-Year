import readline from 'readline';
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function setupAdmin() {
  console.log('\n=== Wedding Invitation System - Admin Setup ===\n');

  try {
    // Check if admin already exists
    const existing = await query('SELECT * FROM admin_users LIMIT 1');

    if (existing.rows.length > 0) {
      const overwrite = await question('Admin user already exists. Create another? (y/n): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        rl.close();
        process.exit(0);
      }
    }

    const email = await question('Admin email: ');
    const password = await question('Admin password: ');
    const name = await question('Admin name: ');

    if (!email || !password) {
      console.log('Email and password are required.');
      rl.close();
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO admin_users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role`,
      [email, passwordHash, name || 'Admin', 'admin']
    );

    console.log('\n✓ Admin user created successfully!');
    console.log('User details:', result.rows[0]);
    console.log('\nYou can now login with these credentials.');

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    rl.close();
    process.exit(0);
  }
}

setupAdmin();
