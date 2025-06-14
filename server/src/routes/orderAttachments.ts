import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middlewares/auth';
import { query } from '../db';
import { createNotification } from '../services/notificationService';

const router = Router({ mergeParams: true });
const uploadDir = path.resolve(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// POST /v1/orders/:orderId/attachments - upload file
router.post('/', authenticate, upload.single('file'), async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const userId = req.user!.id;
  if (!req.file) return res.status(400).json({ message: 'File is required' });
  const { filename, originalname, size, mimetype } = req.file;
  const url = `/uploads/${filename}`;
  try {
    const result = await query(
      `INSERT INTO order_attachments(order_id, file_url, file_name, file_size, file_type, uploaded_by)
       VALUES($1,$2,$3,$4,$5,$6)
       RETURNING id, file_url AS "fileUrl", file_name AS "fileName"`,
      [orderId, url, originalname, size, mimetype, userId]
    );
    const attachment = result.rows[0];
    // notify other party
    const ord = await query(`SELECT client_id, performer_id, title FROM orders WHERE id = $1`, [orderId]);
    if (ord.rowCount) {
      const { client_id, performer_id, title } = ord.rows[0];
      const recipient = userId === client_id ? performer_id : client_id;
      await createNotification(
        recipient,
        'message',
        `Додано файл до замовлення "${title}"`,
        orderId
      );
    }
    res.status(201).json(attachment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

// DELETE /v1/orders/:orderId/attachments/:attachmentId - delete attachment
router.delete('/:attachmentId', authenticate, async (req: Request, res: Response) => {
  const { orderId, attachmentId } = req.params;
  try {
    const attRes = await query(
      `SELECT file_url FROM order_attachments WHERE id = $1 AND order_id = $2`,
      [attachmentId, orderId]
    );
    if (attRes.rowCount === 0) return res.status(404).json({ message: 'Attachment not found' });
    const fileUrl: string = attRes.rows[0].file_url;
    const filePath = path.resolve(uploadDir, path.basename(fileUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await query(`DELETE FROM order_attachments WHERE id = $1`, [attachmentId]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete attachment' });
  }
});

// GET /v1/orders/:orderId/attachments - list attachments
router.get('/', authenticate, async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  try {
    const result = await query(
      `SELECT id, file_url AS "fileUrl", file_name AS "fileName", created_at AS "createdAt"
       FROM order_attachments WHERE order_id = $1 ORDER BY created_at`,
      [orderId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch attachments' });
  }
});

export default router;
