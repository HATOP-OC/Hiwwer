// filepath: src/lib/api.ts
// API client functions for Digi Hub Telegram Sales

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(data: ContactForm): Promise<void> {
  const res = await fetch('https://api.hiwwer.example.com/v1/support/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to send contact message: ${res.status}`);
  }
}

export interface ApplicationFormData {
  name: string;
  email: string;
  skills: string;
  experience: string;
  portfolio: string;
  description: string;
}

export async function submitPerformerApplication(data: ApplicationFormData): Promise<void> {
  const res = await fetch('https://api.hiwwer.example.com/v1/performers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit application: ${res.status}`);
  }
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time: number;
  rating: number;
  review_count: number;
  images: string[];
  performer: {
    id: string;
    name: string;
    avatar_url: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{ id: string; name: string }>;
}

export async function fetchServices(page = 1, limit = 10): Promise<Service[]> {
  const res = await fetch(`https://api.hiwwer.example.com/v1/services?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);
  const json = await res.json();
  return json.services;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export async function fetchFAQ(category: 'client' | 'performer'): Promise<FAQItem[]> {
  const res = await fetch(`https://api.hiwwer.example.com/v1/faq/${category}`);
  if (!res.ok) throw new Error(`Failed to fetch FAQ: ${res.status}`);
  return res.json();
}

export interface Policy {
  title: string;
  content: string;
}

export async function fetchPolicy(slug: string): Promise<Policy> {
  const res = await fetch(`https://api.hiwwer.example.com/v1/policies/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch policy: ${res.status}`);
  return res.json();
}

export interface DashboardStats {
  totalUsers: number;
  totalPerformers: number;
  totalServices: number;
  totalOrders: number;
}

export async function fetchAdminDashboardStats(): Promise<DashboardStats> {
  const res = await fetch('https://api.hiwwer.example.com/v1/admin/dashboard', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch admin stats: ${res.status}`);
  return res.json();
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target?: string;
  time: string;
}

export async function fetchRecentActivities(): Promise<Activity[]> {
  const res = await fetch('https://api.hiwwer.example.com/v1/admin/recent-activities', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch recent activities: ${res.status}`);
  return res.json();
}

export interface SupportTicket {
  id: string;
  user: string;
  subject: string;
  status: string;
  priority: string;
  time: string;
}

export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  const res = await fetch('https://api.hiwwer.example.com/v1/admin/support-tickets', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch support tickets: ${res.status}`);
  return res.json();
}
