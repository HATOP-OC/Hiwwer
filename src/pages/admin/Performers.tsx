import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { fetchAdminPerformers, AdminUser } from '@/lib/api';

const Performers: React.FC = () => {
  const [performers, setPerformers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminPerformers()
      .then(data => setPerformers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Управління виконавцями</h1>
        {loading && <p>Завантаження...</p>}
        {error && <p className="text-red-500">Помилка: {error}</p>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Ім'я</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Рейтинг</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performers.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.role === 'performer' ? '—' : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
};

export default Performers;
