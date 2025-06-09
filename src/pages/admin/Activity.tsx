import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { fetchRecentActivities, Activity as ActivityType } from '@/lib/api';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const Activity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentActivities()
      .then(data => setActivities(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Останні активності</h1>
        {loading && <p>Завантаження...</p>}
        {error && <p className="text-red-500">Помилка: {error}</p>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Користувач</TableHead>
                <TableHead>Дія</TableHead>
                <TableHead>Об’єкт</TableHead>
                <TableHead>Час</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map(a => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell>{a.user}</TableCell>
                  <TableCell>{a.action}</TableCell>
                  <TableCell>{a.target || '-'}</TableCell>
                  <TableCell>{new Date(a.time).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
};

export default Activity;
