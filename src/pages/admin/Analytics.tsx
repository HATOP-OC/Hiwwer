import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchDailySalesByMonth, fetchCategorySalesByCategory, DailySales, CategoryMonthlySales } from '@/lib/api';

const Analytics: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const month = params.get('month');
  const category = params.get('category');

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (month) {
      setLoading(true);
      fetchDailySalesByMonth(month)
        .then((res: DailySales[]) => setData(res))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (category) {
      setLoading(true);
      fetchCategorySalesByCategory(category)
        .then((res: CategoryMonthlySales[]) => setData(res))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [month, category]);

  const renderChart = () => {
    if (month) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    if (category) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    return null;
  };

  const title = month
    ? `Детальна аналітика продажів за місяць ${month}`
    : category
    ? `Детальна аналітика продажів за категорією ${category}`
    : 'Детальна аналітика';

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {loading && <p>Завантаження даних...</p>}
        {error && <p className="text-red-500">Помилка: {error}</p>}
        {!loading && !error && data.length > 0 && renderChart()}
        {!loading && !error && data.length === 0 && <p>Немає даних для відображення.</p>}
      </div>
    </Layout>
  );
};

export default Analytics;
