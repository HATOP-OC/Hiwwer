import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { fetchDatabaseBackup } from '@/lib/api';

const Database: React.FC = () => {
  const [backupUrl, setBackupUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatabaseBackup()
      .then(data => setBackupUrl(data.url))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Бекап бази даних</h1>
        {loading && <p>Готуємо бекап...</p>}
        {error && <p className="text-red-500">Помилка: {error}</p>}
        {!loading && !error && backupUrl && (
          <Button asChild>
            <a href={backupUrl} download className="underline text-blue-600">
              Завантажити бекап
            </a>
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default Database;
