import * as dotenv from 'dotenv';
import * as path from 'path';

// Завантажуємо змінні оточення з server/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  db: {
    connectionString: process.env.DATABASE_URL || 'postgresql://hiwwer_user:hiwwer_password@localhost:5432/hiwwer_db'
  },
  // Адміністратори: список у вигляді 'email:password:name', розділений ';'
  // Наприклад: ADMIN_CREDENTIALS="admin@hiwwer.com:password123:Administrator;other@hiwwer.com:pass456:Other"
  admins: (() => {
    const rawCreds = process.env.ADMIN_CREDENTIALS?.replace(/^"|"$/g, '') || '';
    const creds = rawCreds;
    if (creds) {
      return creds.split(';').map(entry => {
        const [email, password, name] = entry.split(':');
        return { email: email || '', password: password || '', name: name || 'Administrator' };
      });
    }
    // fallback до одиночних змінних
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      return [{ email: process.env.ADMIN_EMAIL!, password: process.env.ADMIN_PASSWORD!, name: process.env.ADMIN_NAME || 'Administrator' }];
    }
    return [];
  })()
};