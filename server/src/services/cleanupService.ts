import { query } from '../db';
import fs from 'fs';
import path from 'path';

// Шлях до директорії з файлами
const uploadDir = path.resolve(__dirname, '../uploads');

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
 * Видалити файл повідомлення
 */
async function removeMessageAttachment(id: string, fileUrl: string) {
  const filePath = path.resolve(uploadDir, path.basename(fileUrl));
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted message file ${filePath}`);
    }
  } catch (err) {
    console.error(`Failed to delete message file ${filePath}:`, err);
  }
  // Видалити запис з БД
  try {
    await query('DELETE FROM message_attachments WHERE id = $1', [id]);
    console.log(`Deleted DB record for message attachment ${id}`);
  } catch (err) {
    console.error(`Failed to delete DB record for message attachment ${id}:`, err);
  }
}

/**
 * Очистити осиротілі файли (файли без відповідних записів у БД)
 */
async function cleanupOrphanedFiles() {
  try {
    if (!fs.existsSync(uploadDir)) {
      return;
    }

    const files = fs.readdirSync(uploadDir);
    console.log(`Checking ${files.length} files for orphaned entries...`);

    for (const fileName of files) {
      // Перевіряємо, чи існує файл у БД
      const orderAttachment = await query(
        'SELECT 1 FROM order_attachments WHERE file_url LIKE $1',
        [`%${fileName}`]
      );
      
      const messageAttachment = await query(
        'SELECT 1 FROM message_attachments WHERE file_url LIKE $1',
        [`%${fileName}`]
      );

      // Якщо файл не знайдено в жодній таблиці
      if (orderAttachment.rowCount === 0 && messageAttachment.rowCount === 0) {
        const filePath = path.join(uploadDir, fileName);
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted orphaned file: ${fileName}`);
        } catch (err) {
          console.error(`Failed to delete orphaned file ${fileName}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('Error cleaning orphaned files:', err);
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
      // Очищення старих файлів замовлень
      const res = await query(
        `SELECT a.id, a.file_url
         FROM order_attachments a
         JOIN orders o ON a.order_id = o.id
         WHERE o.completed_at IS NOT NULL AND o.completed_at < NOW() - INTERVAL '3 months'`
      );
      for (const row of res.rows) {
        await removeAttachment(row.id, row.file_url);
      }

      // Очищення старих файлів повідомлень (старше 6 місяців)
      const messageRes = await query(
        `SELECT ma.id, ma.file_url
         FROM message_attachments ma
         JOIN messages m ON ma.message_id = m.id
         WHERE m.created_at < NOW() - INTERVAL '6 months'`
      );
      for (const row of messageRes.rows) {
        await removeMessageAttachment(row.id, row.file_url);
      }

      // Очищення осиротілих файлів
      await cleanupOrphanedFiles();

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
