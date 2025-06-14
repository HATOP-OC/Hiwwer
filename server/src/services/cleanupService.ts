import { query } from '../db';
import fs from 'fs';
import path from 'path';

// Шлях до директорії з файлами
const uploadDir = path.resolve(__dirname, '../../uploads');

/**
 * Видалити файл та запис з БД за attachment id та file_url
 */
async function removeAttachment(id: string, fileUrl: string) {
  const filePath = path.resolve(uploadDir, path.basename(fileUrl));
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file ${filePath}`);
    }
  } catch (err) {
    console.error(`Failed to delete file ${filePath}:`, err);
  }
  // Видалити запис з БД
  try {
    await query('DELETE FROM order_attachments WHERE id = $1', [id]);
    console.log(`Deleted DB record for attachment ${id}`);
  } catch (err) {
    console.error(`Failed to delete DB record for attachment ${id}:`, err);
  }
}

/**
 * Запуск очищення файлів, де замовлення завершено більше ніж 3 місяці тому
 */
export function scheduleAttachmentCleanup() {
  // Запустити одразу при старі та щоночі о 2:00
  async function cleanup() {
    console.log('Running attachment cleanup...');
    try {
      const res = await query(
        `SELECT a.id, a.file_url
         FROM order_attachments a
         JOIN orders o ON a.order_id = o.id
         WHERE o.completed_at IS NOT NULL AND o.completed_at < NOW() - INTERVAL '3 months'`
      );
      for (const row of res.rows) {
        await removeAttachment(row.id, row.file_url);
      }
    } catch (err) {
      console.error('Cleanup error:', err);
    }
  }
  // Виконати одразу
  cleanup();
  // Потім щодня о 2:00
  const now = new Date();
  const next = new Date();
  next.setHours(2, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const delay = next.getTime() - now.getTime();
  setTimeout(() => {
    cleanup();
    setInterval(cleanup, 24 * 60 * 60 * 1000);
  }, delay);
}
