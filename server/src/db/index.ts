import { Pool } from 'pg';
import { config } from '../config/config';

// Initialize PostgreSQL connection pool
export const pool = new Pool({
  connectionString: config.db.connectionString,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Helper to query the database
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
