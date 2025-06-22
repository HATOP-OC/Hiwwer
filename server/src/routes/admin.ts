import { Router, Request, Response } from 'express';
import { query } from '../db';
import { authenticate, authorizeAdmin } from '../middlewares/auth';
import { format } from 'date-fns';
import { backupService } from '../services/backupService';
import * as path from 'path';

const router = Router();

// All admin routes require auth and admin
router.use(authenticate, authorizeAdmin);

// GET /v1/admin/dashboard
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const [uRes, pRes, sRes, oRes] = await Promise.all([
      query('SELECT COUNT(*) AS count FROM users'),
      query("SELECT COUNT(*) AS count FROM users WHERE role='performer'"),
      query('SELECT COUNT(*) AS count FROM services'),
      query('SELECT COUNT(*) AS count FROM orders')
    ]);
    const totalUsers = Number(uRes.rows[0].count);
    const totalPerformers = Number(pRes.rows[0].count);
    const totalServices = Number(sRes.rows[0].count);
    const totalOrders = Number(oRes.rows[0].count);
    res.json({ totalUsers, totalPerformers, totalServices, totalOrders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
    console.error(error);
    res.status(500).json({ message });
  }
});

// GET /v1/admin/users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name, email, role FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /v1/admin/performers
router.get('/performers', async (req: Request, res: Response) => {
  try {
    const result = await query("SELECT id, name, email, role FROM users WHERE role='performer' ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch performers' });
  }
});

// GET /v1/admin/services
router.get('/services', async (req: Request, res: Response) => {
  try {
    const rows = await query(
      `SELECT s.id, s.title, s.price, s.currency, u.name as performer, c.name as category
       FROM services s
       JOIN users u ON s.performer_id = u.id
       JOIN service_categories c ON s.category_id = c.id
       ORDER BY s.created_at DESC`
    );
    res.json(rows.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// GET /v1/admin/orders
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const rows = await query(
      `SELECT o.id, u1.name as user, s.title as service, o.price as amount, o.status, o.created_at
       FROM orders o
       JOIN users u1 ON o.client_id = u1.id
       JOIN services s ON o.service_id = s.id
       ORDER BY o.created_at DESC`
    );
    res.json(rows.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET /v1/admin/recent-activities (return last 10 orders actions)
router.get('/recent-activities', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT o.id, u1.name as user, 'placed order' as action, s.title as target, o.created_at as time
       FROM orders o
       JOIN users u1 ON o.client_id = u1.id
       JOIN services s ON o.service_id = s.id
       ORDER BY o.created_at DESC LIMIT 10`
    );
    const activities = result.rows.map(r => ({ id: r.id, user: r.user, action: r.action, target: r.target, time: r.time }));
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
});

// GET /v1/admin/support-tickets (stub)
router.get('/support-tickets', (req: Request, res: Response) => {
  res.json([]);
});

// GET /v1/admin/sales/monthly
router.get('/sales/monthly', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT to_char(created_at, 'Mon YYYY') as month, SUM(price) as value
       FROM orders
       GROUP BY month
       ORDER BY min(created_at)`
    );
    const data = result.rows.map(r => ({ month: r.month, value: Number(r.value) }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch monthly sales' });
  }
});

// GET /v1/admin/sales/categories
router.get('/sales/categories', async (req: Request, res: Response) => {
  try {
    const total = await query('SELECT COUNT(*) as count FROM orders');
    const t = Number(total.rows[0].count);
    const result = await query(
      `SELECT c.name, COUNT(o.id) as cnt
       FROM orders o
       JOIN services s ON o.service_id = s.id
       JOIN service_categories c ON s.category_id = c.id
       GROUP BY c.name`
    );
    const data = result.rows.map(r => ({ name: r.name, value: Math.round((Number(r.cnt) / t) * 100) }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch category distribution' });
  }
});

// GET /v1/admin/sales/daily?month=Mon YYYY
router.get('/sales/daily', async (req: Request, res: Response) => {
  try {
    const month = req.query.month as string;
    const date = new Date(month);
    const monthNum = date.getMonth() + 1;
    const year = date.getFullYear();
    const result = await query(
      `SELECT to_char(created_at, 'DD') as day, SUM(price) as value
       FROM orders
       WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = $2
       GROUP BY day
       ORDER BY day`, [monthNum, year]);
    res.json(result.rows.map(r => ({ day: r.day, value: Number(r.value) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch daily sales' });
  }
});

// GET /v1/admin/sales/category/:category/monthly
router.get('/sales/category/:category/monthly', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const result = await query(
      `SELECT to_char(o.created_at, 'Mon YYYY') as month, SUM(o.price) as value
       FROM orders o
       JOIN services s ON o.service_id = s.id
       JOIN service_categories c ON s.category_id = c.id
       WHERE c.name = $1
       GROUP BY month
       ORDER BY min(o.created_at)`, [category]);
    res.json(result.rows.map(r => ({ month: r.month, value: Number(r.value) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch category sales' });
  }
});

// Admin panel settings endpoints
router.get('/settings', (req, res) => {
  // Return stubbed or default settings
  res.json({ siteName: 'Digi Hub', maintenanceMode: false });
});

router.put('/settings', (req, res) => {
  // Accept and ignore updated settings for now
  res.sendStatus(204);
});

// Security policy endpoints
router.get('/security', (req, res) => {
  res.json({ ipWhitelist: [], allowSelfRegistration: false });
});

router.put('/security', (req, res) => {
  res.sendStatus(204);
});

router.get('/security/logs', (req, res) => {
  res.json([]); // stubbed empty logs
});

// Database endpoints
router.get('/database/stats', async (req: Request, res: Response) => {
  try {
    const [totalTables, totalRows, dbSize] = await Promise.all([
      query(`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`),
      query(`SELECT SUM(n_tup_ins + n_tup_upd + n_tup_del) as total FROM pg_stat_user_tables`),
      query(`SELECT pg_size_pretty(pg_database_size(current_database())) as size`)
    ]);

    res.json({
      totalTables: Number(totalTables.rows[0].count),
      totalRows: Number(totalRows.rows[0].total || 0),
      databaseSize: dbSize.rows[0].size
    });
  } catch (err) {
    console.error('Failed to fetch database stats:', err);
    res.status(500).json({ message: 'Failed to fetch database stats' });
  }
});

// Отримати список бекапів
router.get('/database/backups', async (req: Request, res: Response) => {
  try {
    const backups = await backupService.getBackupList();
    res.json(backups);
  } catch (err) {
    console.error('Failed to fetch backup list:', err);
    res.status(500).json({ message: 'Failed to fetch backup list' });
  }
});

// Створити новий бекап
router.post('/database/backup', async (req: Request, res: Response) => {
  try {
    const filename = await backupService.createBackup();
    
    // Автоматично очищуємо старі бекапи
    await backupService.cleanupOldBackups(10);
    
    res.json({ 
      message: 'Backup created successfully', 
      filename,
      downloadUrl: `/v1/admin/database/backup/${filename}`
    });
  } catch (err) {
    console.error('Failed to create backup:', err);
    res.status(500).json({ message: 'Failed to create backup' });
  }
});

// Завантажити бекап файл
router.get('/database/backup/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filepath = backupService.getBackupFilePath(filename);
    
    // Перевіряємо, чи існує файл
    const fs = require('fs');
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: 'Backup file not found' });
    }

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error downloading backup:', err);
        res.status(500).json({ message: 'Failed to download backup' });
      }
    });
  } catch (err) {
    console.error('Failed to download backup:', err);
    res.status(500).json({ message: 'Failed to download backup' });
  }
});

// Відновити базу даних з бекапу
router.post('/database/restore', async (req: Request, res: Response) => {
  try {
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({ message: 'Backup filename is required' });
    }

    await backupService.restoreFromBackup(filename);
    res.json({ message: 'Database restored successfully' });
  } catch (err) {
    console.error('Failed to restore database:', err);
    res.status(500).json({ message: 'Failed to restore database' });
  }
});

// Видалити бекап
router.delete('/database/backup/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    await backupService.deleteBackup(filename);
    res.json({ message: 'Backup deleted successfully' });
  } catch (err) {
    console.error('Failed to delete backup:', err);
    res.status(500).json({ message: 'Failed to delete backup' });
  }
});

// Застарілий endpoint для зворотної сумісності
router.get('/database/backup', async (req: Request, res: Response) => {
  try {
    const filename = await backupService.createBackup();
    res.json({ url: `/v1/admin/database/backup/${filename}` });
  } catch (err) {
    console.error('Failed to create backup:', err);
    res.status(500).json({ message: 'Failed to create backup' });
  }
});

export default router;
