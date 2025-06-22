import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { config } from '../config/config';

const execAsync = promisify(exec);

export class BackupService {
  private backupDir = path.join(__dirname, '../../backups');

  constructor() {
    this.ensureBackupDir();
  }

  private async ensureBackupDir(): Promise<void> {
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
    }
  }

  /**
   * Створити бекап бази даних
   */
  async createBackup(): Promise<string> {
    await this.ensureBackupDir();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${timestamp}.sql`;
    const filepath = path.join(this.backupDir, filename);

    // Парсимо DATABASE_URL для отримання параметрів підключення
    const dbUrl = new URL(config.db.connectionString);
    const dbName = dbUrl.pathname.slice(1);
    const username = dbUrl.username;
    const password = dbUrl.password;
    const host = dbUrl.hostname;
    const port = dbUrl.port || '5432';

    try {
      // Виконуємо pg_dump для створення бекапу
      const command = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${dbName} --clean --create --if-exists`;
      
      const { stdout } = await execAsync(command);
      
      // Записуємо результат в файл
      await fs.writeFile(filepath, stdout, 'utf8');
      
      console.log(`Backup created successfully: ${filename}`);
      return filename;
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw new Error('Failed to create database backup');
    }
  }

  /**
   * Відновити базу даних з бекапу
   */
  async restoreFromBackup(filename: string): Promise<void> {
    const filepath = path.join(this.backupDir, filename);
    
    try {
      // Перевіряємо, чи існує файл бекапу
      await fs.access(filepath);
    } catch {
      throw new Error('Backup file not found');
    }

    // Парсимо DATABASE_URL для отримання параметрів підключення
    const dbUrl = new URL(config.db.connectionString);
    const dbName = dbUrl.pathname.slice(1);
    const username = dbUrl.username;
    const password = dbUrl.password;
    const host = dbUrl.hostname;
    const port = dbUrl.port || '5432';

    try {
      // Виконуємо psql для відновлення з бекапу
      const command = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${username} -d ${dbName} -f "${filepath}"`;
      
      await execAsync(command);
      
      console.log(`Database restored successfully from: ${filename}`);
    } catch (error) {
      console.error('Database restoration failed:', error);
      throw new Error('Failed to restore database from backup');
    }
  }

  /**
   * Отримати список доступних бекапів
   */
  async getBackupList(): Promise<Array<{ filename: string; size: number; created: Date }>> {
    await this.ensureBackupDir();
    
    try {
      const files = await fs.readdir(this.backupDir);
      const backupFiles = files.filter(f => f.endsWith('.sql'));
      
      const backups = await Promise.all(
        backupFiles.map(async (filename) => {
          const filepath = path.join(this.backupDir, filename);
          const stats = await fs.stat(filepath);
          
          return {
            filename,
            size: stats.size,
            created: stats.birthtime
          };
        })
      );

      return backups.sort((a, b) => b.created.getTime() - a.created.getTime());
    } catch (error) {
      console.error('Failed to get backup list:', error);
      return [];
    }
  }

  /**
   * Видалити бекап
   */
  async deleteBackup(filename: string): Promise<void> {
    const filepath = path.join(this.backupDir, filename);
    
    try {
      await fs.unlink(filepath);
      console.log(`Backup deleted: ${filename}`);
    } catch (error) {
      console.error('Failed to delete backup:', error);
      throw new Error('Failed to delete backup file');
    }
  }

  /**
   * Отримати шлях до файлу бекапу
   */
  getBackupFilePath(filename: string): string {
    return path.join(this.backupDir, filename);
  }

  /**
   * Автоматичне очищення старих бекапів (залишає тільки останні N бекапів)
   */
  async cleanupOldBackups(keepCount: number = 10): Promise<void> {
    const backups = await this.getBackupList();
    
    if (backups.length <= keepCount) {
      return;
    }

    const toDelete = backups.slice(keepCount);
    
    for (const backup of toDelete) {
      try {
        await this.deleteBackup(backup.filename);
      } catch (error) {
        console.error(`Failed to delete old backup ${backup.filename}:`, error);
      }
    }
  }
}

export const backupService = new BackupService();
