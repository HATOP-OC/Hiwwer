import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, FileText, Calendar, Shield, AlertCircle } from 'lucide-react';
import { fetchPolicy, Policy } from '@/lib/api';

const TermsOfService = () => {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPolicy('terms-of-service')
      .then(data => setPolicy(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (<Layout><p className="text-center py-12">Завантаження умов...</p></Layout>);
  if (error || !policy) return (<Layout><p className="text-center py-12 text-red-500">Не вдалося завантажити умови.</p></Layout>);

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{policy.title}</h1>
        </div>
        <div className="prose max-w-full">
          <div dangerouslySetInnerHTML={{ __html: policy.content }} />
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
