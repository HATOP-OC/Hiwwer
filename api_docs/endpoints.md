
# Hiwwer API Documentation

## Base URL
`https://api.hiwwer.example.com/v1`

## Authentication
All API endpoints require authentication using JWT tokens, except for public endpoints like service listing and searching.

### Authentication Headers
```
Authorization: Bearer {jwt_token}
```

## User Endpoints

### Register a new user
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "client" // "client" or "performer"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "client",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "client",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Link Telegram Account
**POST** `/auth/link-telegram`

**Request Body:**
```json
{
  "telegram_id": "12345678",
  "first_name": "John",
  "username": "johndoe",
  "auth_date": 1614567890,
  "hash": "hash_from_telegram"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Telegram account successfully linked"
}
```

### Get User Profile
**GET** `/users/profile`

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "client",
  "avatar_url": "https://hiwwer.example.com/avatars/john.jpg",
  "bio": "I need graphic design services for my startup",
  "rating": 4.5,
  "telegram_connected": true,
  "created_at": "2023-01-15T12:00:00Z"
}
```

### Update User Profile
**PUT** `/users/profile`

**Request Body:**
```json
{
  "name": "John Doe",
  "bio": "I need graphic design services for my startup",
  "avatar_url": "https://hiwwer.example.com/avatars/john.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

## Service Endpoints

### List Services
**GET** `/services?category=design&page=1&limit=10`

**Response:**
```json
{
  "services": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Professional Logo Design",
      "description": "I will design a professional logo for your business",
      "price": 49.99,
      "currency": "USD",
      "delivery_time": 3,
      "rating": 4.8,
      "review_count": 125,
      "performer": {
        "id": "223e4567-e89b-12d3-a456-426614174000",
        "name": "Alice Designer",
        "rating": 4.8,
        "avatar_url": "https://hiwwer.example.com/avatars/alice.jpg"
      },
      "category": {
        "id": "323e4567-e89b-12d3-a456-426614174000",
        "name": "Design",
        "slug": "design"
      },
      "tags": [
        {"id": "423e4567-e89b-12d3-a456-426614174000", "name": "Logo"},
        {"id": "523e4567-e89b-12d3-a456-426614174000", "name": "Branding"}
      ],
      "images": [
        "https://hiwwer.example.com/services/logo1.jpg",
        "https://hiwwer.example.com/services/logo2.jpg"
      ],
      "created_at": "2023-01-10T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 56,
    "pages": 6,
    "current_page": 1,
    "limit": 10
  }
}
```

### Get Service Details
**GET** `/services/{service_id}`

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Professional Logo Design",
  "description": "I will design a professional logo for your business",
  "price": 49.99,
  "currency": "USD",
  "delivery_time": 3,
  "rating": 4.8,
  "review_count": 125,
  "performer": {
    "id": "223e4567-e89b-12d3-a456-426614174000",
    "name": "Alice Designer",
    "rating": 4.8,
    "avatar_url": "https://hiwwer.example.com/avatars/alice.jpg",
    "bio": "Professional graphic designer with 5+ years experience"
  },
  "category": {
    "id": "323e4567-e89b-12d3-a456-426614174000",
    "name": "Design",
    "slug": "design"
  },
  "tags": [
    {"id": "423e4567-e89b-12d3-a456-426614174000", "name": "Logo"},
    {"id": "523e4567-e89b-12d3-a456-426614174000", "name": "Branding"}
  ],
  "images": [
    "https://hiwwer.example.com/services/logo1.jpg",
    "https://hiwwer.example.com/services/logo2.jpg"
  ],
  "created_at": "2023-01-10T12:00:00Z",
  "reviews": [
    {
      "id": "623e4567-e89b-12d3-a456-426614174000",
      "rating": 5,
      "comment": "Amazing work! Exactly what I needed.",
      "client": {
        "id": "723e4567-e89b-12d3-a456-426614174000",
        "name": "Bob Client",
        "avatar_url": "https://hiwwer.example.com/avatars/bob.jpg"
      },
      "created_at": "2023-02-15T14:30:00Z"
    }
  ]
}
```

### Create a Service (Performers only)
**POST** `/services`

**Request Body:**
```json
{
  "title": "Professional Logo Design",
  "description": "I will design a professional logo for your business",
  "category_id": "323e4567-e89b-12d3-a456-426614174000",
  "price": 49.99,
  "currency": "USD",
  "delivery_time": 3,
  "tags": ["423e4567-e89b-12d3-a456-426614174000", "523e4567-e89b-12d3-a456-426614174000"],
  "images": [
    "https://hiwwer.example.com/services/logo1.jpg",
    "https://hiwwer.example.com/services/logo2.jpg"
  ]
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Service created successfully"
}
```

### Update a Service (Performers only)
**PUT** `/services/{service_id}`

**Request Body:**
```json
{
  "title": "Professional Logo Design",
  "description": "I will design a professional logo for your business",
  "category_id": "323e4567-e89b-12d3-a456-426614174000",
  "price": 59.99,
  "currency": "USD",
  "delivery_time": 2,
  "tags": ["423e4567-e89b-12d3-a456-426614174000", "523e4567-e89b-12d3-a456-426614174000"],
  "images": [
    "https://hiwwer.example.com/services/logo1.jpg",
    "https://hiwwer.example.com/services/logo2.jpg",
    "https://hiwwer.example.com/services/logo3.jpg"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service updated successfully"
}
```

### Delete a Service (Performers only)
**DELETE** `/services/{service_id}`

**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

## Order Endpoints

### Create an Order (Clients only)
**POST** `/orders`

**Request Body:**
```json
{
  "service_id": "123e4567-e89b-12d3-a456-426614174000",
  "requirements": "I need a minimalist logo for my tech startup"
}
```

**Response:**
```json
{
  "id": "823e4567-e89b-12d3-a456-426614174000",
  "message": "Order created successfully",
  "payment_url": "https://hiwwer.example.com/payment/823e4567-e89b-12d3-a456-426614174000"
}
```

### Get Order Details
**GET** `/orders/{order_id}`

**Response:**
```json
{
  "id": "823e4567-e89b-12d3-a456-426614174000",
  "service": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Professional Logo Design"
  },
  "requirements": "I need a minimalist logo for my tech startup",
  "status": "in_progress",
  "price": 49.99,
  "currency": "USD",
  "client": {
    "id": "723e4567-e89b-12d3-a456-426614174000",
    "name": "Bob Client"
  },
  "performer": {
    "id": "223e4567-e89b-12d3-a456-426614174000",
    "name": "Alice Designer"
  },
  "created_at": "2023-03-01T10:00:00Z",
  "deadline": "2023-03-04T10:00:00Z",
  "attachments": [
    {
      "id": "923e4567-e89b-12d3-a456-426614174000",
      "file_name": "requirements.pdf",
      "file_url": "https://hiwwer.example.com/attachments/requirements.pdf",
      "file_size": 1024000,
      "file_type": "application/pdf",
      "uploaded_by": "723e4567-e89b-12d3-a456-426614174000",
      "created_at": "2023-03-01T10:05:00Z"
    }
  ]
}
```

### List User Orders
**GET** `/orders?status=in_progress&page=1&limit=10`

**Response:**
```json
{
  "orders": [
    {
      "id": "823e4567-e89b-12d3-a456-426614174000",
      "service": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Professional Logo Design"
      },
      "status": "in_progress",
      "price": 49.99,
      "currency": "USD",
      "client": {
        "id": "723e4567-e89b-12d3-a456-426614174000",
        "name": "Bob Client"
      },
      "performer": {
        "id": "223e4567-e89b-12d3-a456-426614174000",
        "name": "Alice Designer"
      },
      "created_at": "2023-03-01T10:00:00Z",
      "deadline": "2023-03-04T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 3,
    "pages": 1,
    "current_page": 1,
    "limit": 10
  }
}
```

### Update Order Status
**PUT** `/orders/{order_id}/status`

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully"
}
```

### Upload Order Attachment
**POST** `/orders/{order_id}/attachments`

**Request Body (multipart/form-data):**
```
file: [binary file data]
```

**Response:**
```json
{
  "id": "923e4567-e89b-12d3-a456-426614174000",
  "file_name": "requirements.pdf",
  "file_url": "https://hiwwer.example.com/attachments/requirements.pdf",
  "file_size": 1024000,
  "file_type": "application/pdf"
}
```

## Message Endpoints

### Send a Message
**POST** `/messages`

**Request Body:**
```json
{
  "order_id": "823e4567-e89b-12d3-a456-426614174000",
  "receiver_id": "223e4567-e89b-12d3-a456-426614174000",
  "content": "How is the logo design coming along?"
}
```

**Response:**
```json
{
  "id": "a23e4567-e89b-12d3-a456-426614174000",
  "created_at": "2023-03-02T15:30:00Z"
}
```

### Get Order Messages
**GET** `/orders/{order_id}/messages?page=1&limit=20`

**Response:**
```json
{
  "messages": [
    {
      "id": "a23e4567-e89b-12d3-a456-426614174000",
      "sender": {
        "id": "723e4567-e89b-12d3-a456-426614174000",
        "name": "Bob Client",
        "avatar_url": "https://hiwwer.example.com/avatars/bob.jpg"
      },
      "content": "How is the logo design coming along?",
      "read": true,
      "created_at": "2023-03-02T15:30:00Z",
      "attachments": []
    },
    {
      "id": "b23e4567-e89b-12d3-a456-426614174000",
      "sender": {
        "id": "223e4567-e89b-12d3-a456-426614174000",
        "name": "Alice Designer",
        "avatar_url": "https://hiwwer.example.com/avatars/alice.jpg"
      },
      "content": "It's going well! I'll share a draft tomorrow.",
      "read": false,
      "created_at": "2023-03-02T16:00:00Z",
      "attachments": []
    }
  ],
  "pagination": {
    "total": 2,
    "pages": 1,
    "current_page": 1,
    "limit": 20
  }
}
```

### Upload Message Attachment
**POST** `/messages/{message_id}/attachments`

**Request Body (multipart/form-data):**
```
file: [binary file data]
```

**Response:**
```json
{
  "id": "c23e4567-e89b-12d3-a456-426614174000",
  "file_name": "logo_draft.png",
  "file_url": "https://hiwwer.example.com/attachments/logo_draft.png",
  "file_size": 512000,
  "file_type": "image/png"
}
```

## Review Endpoints

### Create a Review (Clients only)
**POST** `/reviews`

**Request Body:**
```json
{
  "order_id": "823e4567-e89b-12d3-a456-426614174000",
  "rating": 5,
  "comment": "Amazing work! Exactly what I needed."
}
```

**Response:**
```json
{
  "id": "d23e4567-e89b-12d3-a456-426614174000",
  "message": "Review submitted successfully"
}
```

### Get Service Reviews
**GET** `/services/{service_id}/reviews?page=1&limit=10`

**Response:**
```json
{
  "reviews": [
    {
      "id": "d23e4567-e89b-12d3-a456-426614174000",
      "rating": 5,
      "comment": "Amazing work! Exactly what I needed.",
      "client": {
        "id": "723e4567-e89b-12d3-a456-426614174000",
        "name": "Bob Client",
        "avatar_url": "https://hiwwer.example.com/avatars/bob.jpg"
      },
      "created_at": "2023-03-05T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "pages": 1,
    "current_page": 1,
    "limit": 10
  }
}
```

## Notification Endpoints

### Get User Notifications
**GET** `/notifications?page=1&limit=20`

**Response:**
```json
{
  "notifications": [
    {
      "id": "e23e4567-e89b-12d3-a456-426614174000",
      "type": "new_order",
      "content": "You have a new order for 'Professional Logo Design'",
      "read": false,
      "related_id": "823e4567-e89b-12d3-a456-426614174000",
      "created_at": "2023-03-01T10:00:00Z"
    },
    {
      "id": "f23e4567-e89b-12d3-a456-426614174000",
      "type": "message",
      "content": "New message from Bob Client",
      "read": true,
      "related_id": "a23e4567-e89b-12d3-a456-426614174000",
      "created_at": "2023-03-02T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 2,
    "pages": 1,
    "current_page": 1,
    "limit": 20
  }
}
```

### Mark Notification as Read
**PUT** `/notifications/{notification_id}/read`

**Response:**
```json
{
  "success": true
}
```

### Mark All Notifications as Read
**PUT** `/notifications/read-all`

**Response:**
```json
{
  "success": true,
  "count": 5
}
```

## Payment Endpoints

### Create Payment
**POST** `/payments`

**Request Body:**
```json
{
  "order_id": "823e4567-e89b-12d3-a456-426614174000",
  "provider": "stripe"
}
```

**Response:**
```json
{
  "id": "g23e4567-e89b-12d3-a456-426614174000",
  "checkout_url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### Get Payment Status
**GET** `/payments/{payment_id}`

**Response:**
```json
{
  "id": "g23e4567-e89b-12d3-a456-426614174000",
  "order_id": "823e4567-e89b-12d3-a456-426614174000",
  "amount": 49.99,
  "currency": "USD",
  "status": "completed",
  "provider": "stripe",
  "created_at": "2023-03-01T10:15:00Z"
}
```

## Admin Endpoints

### Get All Users (Admin only)
**GET** `/admin/users?page=1&limit=20`

### Get All Services (Admin only)
**GET** `/admin/services?page=1&limit=20`

### Get All Orders (Admin only)
**GET** `/admin/orders?page=1&limit=20`

### Get System Statistics (Admin only)
**GET** `/admin/statistics`

**Response:**
```json
{
  "users": {
    "total": 250,
    "clients": 150,
    "performers": 95,
    "admins": 5,
    "new_today": 12
  },
  "services": {
    "total": 180,
    "active": 165,
    "by_category": {
      "design": 45,
      "development": 60,
      "writing": 30,
      "other": 45
    }
  },
  "orders": {
    "total": 320,
    "pending": 25,
    "in_progress": 80,
    "completed": 200,
    "canceled": 15,
    "today": 18
  },
  "revenue": {
    "total": 15600.50,
    "this_month": 3200.75,
    "today": 450.00
  }
}
```
