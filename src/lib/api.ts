// filepath: src/lib/api.ts
// API client functions for Digi Hub Telegram Sales

// Base API URL: завжди відносний шлях до проксі Vite
const API_BASE = '/v1';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(data: ContactForm): Promise<void> {
  const res = await fetch(`${API_BASE}/support/contact`, {
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
  const res = await fetch(`${API_BASE}/performers`, {
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
  const res = await fetch(`${API_BASE}/services?page=${page}&limit=${limit}`);
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
  const res = await fetch(`${API_BASE}/faq/${category}`);
  if (!res.ok) throw new Error(`Failed to fetch FAQ: ${res.status}`);
  return res.json();
}

export interface Policy {
  title: string;
  content: string;
}

export async function fetchPolicy(slug: string): Promise<Policy> {
  const res = await fetch(`${API_BASE}/policies/${slug}`);
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
  console.log('Debug: fetchAdminDashboardStats, token=', localStorage.getItem('token'));
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
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
  const res = await fetch(`${API_BASE}/admin/recent-activities`, {
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

/**
 * Fetch support tickets for admin
 */
export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  const res = await fetch(`${API_BASE}/admin/support-tickets`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch support tickets: ${res.status}`);
  return res.json();
}

// Дані для місячних продажів
export interface MonthlySales {
  month: string;
  value: number;
}
/**
 * Fetch monthly sales summary
 */
export async function fetchMonthlySales(): Promise<MonthlySales[]> {
  const res = await fetch(`${API_BASE}/admin/sales/monthly`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch monthly sales: ${res.status}`);
  return res.json();
}

// Дані для розподілу за категоріями
export interface CategoryDistribution {
  name: string;
  value: number;
}
/**
 * Fetch category distribution for sales
 */
export async function fetchCategoryDistribution(): Promise<CategoryDistribution[]> {
  const res = await fetch(`${API_BASE}/admin/sales/categories`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch category distribution: ${res.status}`);
  return res.json();
}

// Дані для щомісячних продажів певної категорії
export interface CategoryMonthlySales {
  month: string;
  value: number;
}
/**
 * Fetch monthly sales summary for a specific category
 */
export async function fetchCategorySalesByCategory(category: string): Promise<CategoryMonthlySales[]> {
  const res = await fetch(`${API_BASE}/admin/sales/category/${encodeURIComponent(category)}/monthly`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch sales for category ${category}: ${res.status}`);
  return res.json();
}

export interface DailySales {
  day: string;
  value: number;
}

/**
 * Fetch daily sales breakdown for a specific month
 */
export async function fetchDailySalesByMonth(month: string): Promise<DailySales[]> {
  const res = await fetch(`${API_BASE}/admin/sales/daily?month=${encodeURIComponent(month)}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch daily sales for month ${month}: ${res.status}`);
  return res.json();
}

// Admin user list
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Fetch list of all users (admin view)
 */
export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
}

/**
 * Fetch list of all performers (admin view)
 */
export async function fetchAdminPerformers(): Promise<AdminUser[]> {
  const res = await fetch(`${API_BASE}/admin/performers`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch performers: ${res.status}`);
  return res.json();
}

/**
 * Fetch list of all services (admin view)
 */
export async function fetchAdminServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/admin/services`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);
  return res.json();
}

export interface AdminOrder {
  id: string;
  user: string;
  service: string;
  amount: number;
  status: string;
  created_at: string;
}

/**
 * Fetch list of all orders (admin view)
 */
export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const res = await fetch(`${API_BASE}/admin/orders`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
  return res.json();
}

// Admin settings
export interface AdminSettings {
  siteName: string;
  maintenanceMode: boolean;
}

/**
 * Fetch admin panel settings
 */
export async function fetchAdminSettings(): Promise<AdminSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
  return res.json();
}

/**
 * Update admin panel settings
 */
export async function updateAdminSettings(data: AdminSettings): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update settings: ${res.status}`);
}

export interface SecurityPolicy {
  ipWhitelist: string[];
  allowSelfRegistration: boolean;
}

/**
 * Fetch security policy
 */
export async function fetchSecurityPolicy(): Promise<SecurityPolicy> {
  const res = await fetch(`${API_BASE}/admin/security`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch security policy: ${res.status}`);
  return res.json();
}

/**
 * Update security policy
 */
export async function updateSecurityPolicy(data: SecurityPolicy): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/security`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update security policy: ${res.status}`);
}

// Security logs
export interface SecurityLog {
  id: string;
  user: string;
  action: string;
  time: string;
}
export async function fetchSecurityLogs(): Promise<SecurityLog[]> {
  const res = await fetch(`${API_BASE}/admin/security/logs`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch security logs: ${res.status}`);
  return res.json();
}

// Database stats
export interface DatabaseStat {
  table: string;
  rowCount: number;
}
export async function fetchDatabaseStats(): Promise<DatabaseStat[]> {
  const res = await fetch(`${API_BASE}/admin/database/stats`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch database stats: ${res.status}`);
  return res.json();
}

/**
 * Request database backup download link
 */
export async function fetchDatabaseBackup(): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE}/admin/database/backup`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch database backup: ${res.status}`);
  return res.json();
}

/**
 * Health check
 */
export async function fetchHealth(): Promise<{ status: string; timestamp: number }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}
