import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Database as DatabaseIcon, 
  Download, 
  Upload, 
  Trash2, 
  Plus, 
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { fetchDatabaseBackup } from '@/lib/api';

interface DatabaseStats {
  totalTables: number;
  totalRows: number;
  databaseSize: string;
}

interface BackupFile {
  filename: string;
  size: number;
  created: string;
}

const Database: React.FC = () => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, backupsRes] = await Promise.all([
        fetch('/v1/admin/database/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/v1/admin/database/backups', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (backupsRes.ok) {
        const backupsData = await backupsRes.json();
        setBackups(backupsData);
      }
    } catch (err) {
      setError('Помилка завантаження даних');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      setCreating(true);
      setError(null);
      setSuccess(null);

      const res = await fetch('/v1/admin/database/backup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!res.ok) {
        throw new Error('Помилка створення бекапу');
      }

      const data = await res.json();
      setSuccess(`Бекап створено успішно: ${data.filename}`);
      await fetchData(); // Оновлюємо список бекапів
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка створення бекапу');
    } finally {
      setCreating(false);
    }
  };

  const downloadBackup = async (filename: string) => {
    try {
      setDownloading(filename);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/v1/admin/database/backup/${filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Помилка завантаження файлу бекапу');
      }

      // Отримуємо blob з відповіді
      const blob = await response.blob();
      
      // Створюємо URL для blob
      const url = window.URL.createObjectURL(blob);
      
      // Створюємо тимчасове посилання для завантаження
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Очищуємо URL
      window.URL.revokeObjectURL(url);
      
      setSuccess(`Файл ${filename} завантажено успішно`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження файлу');
    } finally {
      setDownloading(null);
    }
  };

  const restoreBackup = async (filename: string) => {
    if (!confirm(`Ви впевнені, що хочете відновити базу даних з файлу ${filename}? Це дія незворотна!`)) {
      return;
    }

    try {
      setRestoring(true);
      setError(null);
      setSuccess(null);

      const res = await fetch('/v1/admin/database/restore', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename })
      });

      if (!res.ok) {
        throw new Error('Помилка відновлення бази даних');
      }

      setSuccess('База даних відновлена успішно');
      await fetchData(); // Оновлюємо статистику
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка відновлення бази даних');
    } finally {
      setRestoring(false);
    }
  };

  const deleteBackup = async (filename: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити бекап ${filename}?`)) {
      return;
    }

    try {
      const res = await fetch(`/v1/admin/database/backup/${filename}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!res.ok) {
        throw new Error('Помилка видалення бекапу');
      }

      setSuccess('Бекап видалено успішно');
      await fetchData(); // Оновлюємо список бекапів
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка видалення бекапу');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('uk-UA');
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Автоматичне очищення повідомлень через 5 секунд
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <DatabaseIcon className="h-8 w-8" />
            Управління базою даних
          </h1>
          <p className="text-muted-foreground mt-2">
            Статистика, бекапи та відновлення бази даних
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Статистика бази даних */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Статистика БД</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                </div>
              ) : stats ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Таблиці:</span>
                    <Badge variant="secondary">{stats.totalTables}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Записи:</span>
                    <Badge variant="secondary">{stats.totalRows.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Розмір:</span>
                    <Badge variant="secondary">{stats.databaseSize}</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Немає даних</p>
              )}
            </CardContent>
          </Card>

          {/* Швидкі дії */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Швидкі дії</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={createBackup}
                disabled={creating}
                className="w-full"
              >
                {creating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Створити бекап
              </Button>
              <Button 
                onClick={fetchData}
                variant="outline"
                disabled={loading}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Оновити дані
              </Button>
            </CardContent>
          </Card>

          {/* Інформація */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Інформація</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Бекапи створюються автоматично з повним дампом БД</p>
                <p>• Система зберігає останні 10 бекапів</p>
                <p>• Відновлення замінює всі дані в БД</p>
                <p>• Будьте обережні з операціями відновлення</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Список бекапів */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Доступні бекапи</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DatabaseIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Немає доступних бекапів</p>
                <p className="text-sm">Створіть перший бекап, щоб побачити його тут</p>
              </div>
            ) : (
              <div className="space-y-3">
                {backups.map((backup) => (
                  <div key={backup.filename} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{backup.filename}</h4>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>Створено: {formatDate(backup.created)}</span>
                        <span>Розмір: {formatFileSize(backup.size)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadBackup(backup.filename)}
                        disabled={downloading === backup.filename}
                      >
                        {downloading === backup.filename ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-1" />
                        )}
                        {downloading === backup.filename ? 'Завантаження...' : 'Завантажити'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => restoreBackup(backup.filename)}
                        disabled={restoring}
                      >
                        {restoring ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-1" />
                        )}
                        Відновити
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBackup(backup.filename)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Database;
