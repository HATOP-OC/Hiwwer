import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import RequireAdmin from '@/components/RequireAdmin';

interface Policy {
  id: string;
  slug: string;
  language_code: string;
  title: string;
  content_markdown: string;
  created_at: string;
  updated_at: string;
}

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    language_code: 'en',
    title: '',
    content_markdown: ''
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch('/v1/admin/policies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPolicies(data);
      } else {
        toast.error('Failed to fetch policies');
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/v1/admin/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editing ? 'Policy updated successfully' : 'Policy created successfully');
        setFormData({ slug: '', language_code: 'en', title: '', content_markdown: '' });
        setEditing(null);
        fetchPolicies();
      } else {
        toast.error('Failed to save policy');
      }
    } catch (error) {
      console.error('Error saving policy:', error);
      toast.error('Failed to save policy');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (policy: Policy) => {
    setEditing(policy);
    setFormData({
      slug: policy.slug,
      language_code: policy.language_code,
      title: policy.title,
      content_markdown: policy.content_markdown
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this policy?')) return;

    try {
      const response = await fetch(`/v1/admin/policies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Policy deleted successfully');
        fetchPolicies();
      } else {
        toast.error('Failed to delete policy');
      }
    } catch (error) {
      console.error('Error deleting policy:', error);
      toast.error('Failed to delete policy');
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ slug: '', language_code: 'en', title: '', content_markdown: '' });
  };

  if (loading) {
    return (
      <RequireAdmin>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Policies Management</h1>
            <p className="text-muted-foreground">Manage Terms of Service, Privacy Policy, and other legal documents</p>
          </div>
          <Button onClick={() => setEditing(null)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Policy
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editing ? 'Edit Policy' : 'Create New Policy'}</CardTitle>
              <CardDescription>
                Use Markdown syntax for formatting. Changes will be reflected immediately on public pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="language_code">Language</Label>
                  <select
                    id="language_code"
                    value={formData.language_code}
                    onChange={(e) => setFormData({ ...formData, language_code: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    disabled={editing !== null}
                  >
                    <option value="en">English</option>
                    <option value="uk">Українська</option>
                  </select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Language for this policy (cannot be changed when editing)
                  </p>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Terms of Service"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content (Markdown)</Label>
                  <Textarea
                    id="content"
                    value={formData.content_markdown}
                    onChange={(e) => setFormData({ ...formData, content_markdown: e.target.value })}
                    placeholder="# Terms of Service

## 1. Introduction

..."
                    rows={20}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports Markdown formatting: **bold**, *italic*, [links](url), etc.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {editing ? 'Update Policy' : 'Create Policy'}
                  </Button>
                  {editing && (
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Policies</CardTitle>
              <CardDescription>Click edit to modify or delete policies</CardDescription>
            </CardHeader>
            <CardContent>
              {policies.length === 0 ? (
                <Alert>
                  <AlertDescription>No policies found. Create your first policy above.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{policy.title}</h3>
                        <p className="text-sm text-muted-foreground">/{policy.slug} ({policy.language_code})</p>
                        <p className="text-xs text-muted-foreground">
                          Updated: {new Date(policy.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(policy)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(policy.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAdmin>
  );
}