// filepath: src/lib/api.ts
// API client functions for Digi Hub Telegram Sales

// Base API URL: завжди відносний шлях до проксі Vite
const API_BASE = '/v1';

// Helper function to get full image URL
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '/placeholder.png'; // Default placeholder
  // If path already starts with http/https, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // If path starts with /, it's already absolute - just use it (proxy will handle)
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  // Otherwise prepend /
  return `/${imagePath}`;
}

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
    rating: number;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{ id: string; name: string }>;
}

export async function fetchServices(page = 1, limit = 10, category?: string): Promise<Service[]> {
  console.log('API: fetchServices called with page:', page, 'limit:', limit, 'category:', category);
  let url = `${API_BASE}/services?page=${page}&limit=${limit}`;
  if (category) {
    url += `&category=${category}`;
  }
  console.log('API: Making request to:', url);
  const res = await fetch(url);
  console.log('API: Response status:', res.status);
  if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);
  const json = await res.json();
  console.log('API: Response data:', json);
  return json.services;
}

/** Fetch service by ID */
export async function fetchServiceById(serviceId: string): Promise<Service> {
  const res = await fetch(`${API_BASE}/services/${serviceId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch service: ${res.status}`);
  return res.json();
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  service_count?: number;
}

/** Fetch all service categories */
export async function fetchServiceCategories(): Promise<ServiceCategory[]> {
  const res = await fetch(`${API_BASE}/services/categories`);
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  const json = await res.json();
  return json.categories || [];
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
  // Markdown-formatted content if available on server
  content_markdown?: string | null;
}

export async function fetchPolicy(slug: string, lang: string = 'en'): Promise<Policy> {
  const res = await fetch(`${API_BASE}/policies/${slug}?lang=${lang}`);
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
export interface FileTypeConfig {
  id: string;
  name: string;
  extensions: string[];
  mimeTypes: string[];
  maxSize: number; // in MB
  description?: string;
}

export interface AdminSettings {
  siteName: string;
  maintenanceMode: boolean;
  allowedFileTypes?: FileTypeConfig[] | null;
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

// Order related APIs
export interface Order {
  id: string;
  serviceId?: string | null;
  title: string;
  description: string;
  status: string;
  price: number;
  currency: string;
  deadline: string;
  createdAt: string;
  client: { id: string; name: string; avatar: string; rating: number };
  performer: { id: string; name: string; avatar: string; rating: number };
  category: { id: string; name: string; slug: string };
  unreadMessages: number;
  files?: Array<{ id: string; fileUrl: string; fileName: string }>;
  history: Array<{ status: string; changedAt: string; by: string }>;
  additionalOptions?: any;
  rating?: number;
  dispute?: any;
}

export interface Dispute {
  id: string;
  orderId: string;
  clientId: string;
  performerId: string;
  moderatorId?: string;
  reason: string;
  status: 'open' | 'in_review' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

/** Fetch list of orders with optional filters */
export async function fetchOrders(params?: { status?: string; search?: string }): Promise<Order[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.search) query.append('search', params.search);
  const res = await fetch(`${API_BASE}/orders?${query.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
  const data = await res.json();
  // Map service_id to serviceId for TypeScript compatibility
  return data.map((order: any) => ({
    ...order,
    serviceId: order.service_id,
  }));
}

/** Fetch single order by id */
export async function fetchOrderById(id: string): Promise<Order> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`);
  const data = await res.json();
  // Map service_id to serviceId for TypeScript compatibility
  return {
    ...data,
    serviceId: data.service_id,
  };
}

/** Create new order */
export async function createOrder(orderData: any): Promise<Order> {
  // Transform the order data to match server expectations
  let transformedData;
  
  if (orderData.isCustom) {
    // For custom orders, we need to handle the case where there's no specific service
    // We'll create a placeholder service or handle it differently
    transformedData = {
      service_id: null, // This might need to be handled differently on the server
      client_id: null, // Will be filled by server from auth
      performer_id: null, // Will be assigned later
      title: orderData.title,
      description: `${orderData.description}\n\nВимоги:\n${orderData.requirements}`,
      price: orderData.budget,
      currency: orderData.currency || 'USD',
      deadline: orderData.deadline,
      additional_options: {
        category: orderData.category,
        isCustom: true,
        originalRequirements: orderData.requirements
      }
    };
  } else {
    // For service-based orders
    transformedData = {
      service_id: orderData.serviceId,
      client_id: null, // Will be filled by server from auth
      performer_id: null, // Will be filled by server from service
      title: `Замовлення послуги`, // Will be updated by server from service
      description: orderData.requirements,
      price: orderData.price,
      currency: orderData.currency || 'USD',
      deadline: orderData.deadline,
      additional_options: {
        isCustom: false,
        originalRequirements: orderData.requirements
      }
    };
  }

  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` 
    },
    body: JSON.stringify(transformedData)
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Failed to create order: ${res.status} - ${errorData}`);
  }
  return res.json();
}

/** Update order */
export async function updateOrder(id: string, data: Partial<Omit<Order, 'id'>>): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update order: ${res.status}`);
  return res.json();
}

/** Delete order */
export async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to delete order: ${res.status}`);
}

/** Add attachment to order */
export async function addOrderAttachment(orderId: string, fileUrl: string, fileName: string): Promise<{ id: string; fileUrl: string; fileName: string }> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/attachments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ fileUrl, fileName })
  });
  if (!res.ok) throw new Error(`Failed to add attachment: ${res.status}`);
  return res.json();
}

/** Fetch attachments for an order */
export async function fetchOrderAttachments(orderId: string): Promise<Array<{ id: string; fileUrl: string; fileName: string }>> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/attachments`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch attachments: ${res.status}`);
  return res.json();
}

/** Upload a file to order attachments */
export async function uploadOrderAttachment(orderId: string, file: File): Promise<{ id: string; fileUrl: string; fileName: string }> {
  console.log('=== FRONTEND FILE UPLOAD START ===');
  console.log('Order ID:', orderId);
  console.log('File details:', {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  });
  
  const form = new FormData();
  form.append('file', file);
  
  console.log('FormData created, entries:');
  for (const [key, value] of form.entries()) {
    console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
  }
  
  const url = `${API_BASE}/orders/${orderId}/attachments`;
  console.log('Making request to:', url);
  console.log('Authorization token:', localStorage.getItem('token') ? 'Present' : 'Missing');
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: form
  });
  
  console.log('Response received:', {
    status: res.status,
    statusText: res.statusText,
    headers: Object.fromEntries(res.headers.entries())
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.log('Error response body:', errorText);
    throw new Error(`Failed to upload attachment: ${res.status} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('Upload successful:', result);
  return result;
}

/** Delete an attachment */
export async function deleteOrderAttachment(orderId: string, attachmentId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/attachments/${attachmentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to delete attachment: ${res.status}`);
}

// Notification-related types and functions
export interface Notification {
  id: string;
  type: string;
  content: string;
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

/** Fetch notifications for current user */
export async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch notifications: ${res.status}`);
  return res.json();
}

/** Mark notification as read */
export async function markNotificationRead(id: string): Promise<{ id: string; read: boolean }> {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to mark notification read: ${res.status}`);
  return res.json();
}

// Message related types and functions
export interface ChatAttachment {
  id: string;
  fileUrl: string;
  fileName: string;
}
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
  edited?: boolean;
  deleted?: boolean;
  attachments?: ChatAttachment[];
}

/** Fetch messages in an order and mark unread as read */
export async function fetchMessages(orderId: string): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/messages`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
  return res.json();
}

/** Send a new message in the order chat */
export async function sendMessage(orderId: string, data: {
  content: string;
  attachments?: { fileUrl: string; fileName: string }[];
}): Promise<Message> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
  return res.json();
}

/** Edit an existing message */
export async function editMessage(orderId: string, messageId: string, content: string): Promise<Message> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/messages/${messageId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error(`Failed to edit message: ${res.status}`);
  return res.json();
}

/** Delete a message */
export async function deleteMessage(orderId: string, messageId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/messages/${messageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) throw new Error(`Failed to delete message: ${res.status}`);
}

// Additional order options
export interface AdditionalOption {
  id: string;
  title: string;
  description?: string;
  price: number;
  status: 'proposed' | 'accepted' | 'rejected';
  proposedBy: string;
  createdAt: string;
  updatedAt: string;
}

/** Fetch additional options for an order */
export async function fetchAdditionalOptions(orderId: string): Promise<AdditionalOption[]> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/options`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch options: ${res.status}`);
  return res.json();
}

/** Propose a new additional option */
export async function proposeAdditionalOption(orderId: string, data: { title: string; description?: string; price: number }): Promise<AdditionalOption> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to propose option: ${res.status}`);
  return res.json();
}

/** Update additional option status */
export async function updateAdditionalOptionStatus(orderId: string, optionId: string, status: 'accepted' | 'rejected'): Promise<AdditionalOption> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/options/${optionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(`Failed to update option status: ${res.status}`);
  return res.json();
}

// Payment-related functions
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'authorized' | 'completed' | 'refunded' | 'failed';
  provider: string;
  providerPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

/** Fetch payments for an order */
export async function fetchPayments(orderId: string): Promise<Payment[]> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/payments`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch payments: ${res.status}`);
  return res.json();
}

/** Authorize (freeze) payment */
export async function authorizePaymentApi(orderId: string, amount: number, provider: string, currency?: string): Promise<Payment> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/payments/authorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ amount, currency, provider })
  });
  if (!res.ok) throw new Error(`Failed to authorize payment: ${res.status}`);
  return res.json();
}

/** Capture payment */
export async function capturePaymentApi(orderId: string, paymentId: string): Promise<Payment> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/payments/${paymentId}/capture`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to capture payment: ${res.status}`);
  return res.json();
}

/** Refund payment */
export async function refundPaymentApi(orderId: string, paymentId: string): Promise<Payment> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/payments/${paymentId}/refund`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to refund payment: ${res.status}`);
  return res.json();
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerId: string;
  reviewType: 'client_to_performer' | 'performer_to_client';
}

/** Fetch review for an order */
export async function fetchReview(orderId: string): Promise<Review> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/review`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch review: ${res.status}`);
  return res.json();
}

/** Create a review for an order */
export async function createReview(orderId: string, data: { rating: number; comment?: string }): Promise<Review> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create review: ${res.status}`);
  return res.json();
}

export interface Dispute {
  id: string;
  orderId: string;
  clientId: string;
  performerId: string;
  moderatorId?: string;
  reason: string;
  status: 'open' | 'in_review' | 'resolved';
  createdAt: string;
  updatedAt: string;
}
export interface DisputeMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

/** Fetch dispute for an order */
export async function fetchDispute(orderId: string): Promise<Dispute> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/disputes`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch dispute: ${res.status}`);
  return res.json();
}

/** Open a dispute on an order */
export async function openDispute(orderId: string, reason: string): Promise<Dispute> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/disputes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ reason })
  });
  if (!res.ok) throw new Error(`Failed to open dispute: ${res.status}`);
  return res.json();
}

/** Fetch messages in dispute */
export async function fetchDisputeMessages(orderId: string, disputeId: string): Promise<DisputeMessage[]> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/disputes/${disputeId}/messages`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch dispute messages: ${res.status}`);
  return res.json();
}

/** Send message in dispute */
export async function sendDisputeMessage(orderId: string, disputeId: string, content: string): Promise<DisputeMessage> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/disputes/${disputeId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error(`Failed to send dispute message: ${res.status}`);
  return res.json();
}

/** Update dispute status (moderator) */
export async function updateDisputeStatus(orderId: string, disputeId: string, status: 'in_review' | 'resolved'): Promise<Dispute> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/disputes/${disputeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(`Failed to update dispute status: ${res.status}`);
  return res.json();
}

/** Delete dispute and all its data (admin or dispute creator) */
export async function deleteDispute(orderId: string, disputeId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/disputes/${disputeId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error(`Failed to delete dispute: ${res.status}`);
}

/**
 * Fetch global file type settings
 */
export async function fetchGlobalFileTypes(): Promise<FileTypeConfig[] | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/settings`);
    if (!res.ok) throw new Error(`Failed to fetch file types: ${res.status}`);
    const data = await res.json();
    return data.allowedFileTypes;
  } catch (error) {
    console.error('Error fetching global file types:', error);
    return null;
  }
}

/**
 * Fetch file type configuration from admin settings
 */
export async function fetchFileTypeSettings(): Promise<{ allowedFileTypes: FileTypeConfig[] | null }> {
  const res = await fetch(`${API_BASE}/file-types`);
  if (!res.ok) throw new Error(`Failed to fetch file types: ${res.status}`);
  return res.json();
}