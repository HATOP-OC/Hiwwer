# WebSocket API Documentation

## Overview

Цей проект тепер включає повнофункціональну систему WebSocket для real-time комунікації в чатах замовлень та спорів.

## Architecture

### Server Side
- **Socket.io Server**: Основний WebSocket сервер з підтримкою fallback на HTTP polling
- **Authentication Middleware**: JWT-based аутентифікація для WebSocket з'єднань
- **Room Management**: Кімнати для замовлень та спорів
- **Message Broadcasting**: Розсилка повідомлень учасникам кімнат

### Client Side
- **React Hook**: `useWebSocket` для управління WebSocket з'єднаннями
- **Chat Components**: `OrderChat` та `DisputeChat` для UI
- **Real-time Updates**: Автоматичне оновлення повідомлень та статусів

## WebSocket Events

### Connection Events

#### Client → Server
```typescript
// Підключення з аутентифікацією
socket.connect({
  auth: {
    token: "jwt_token_here"
  }
});
```

#### Server → Client
```typescript
// Успішне підключення
socket.on('connect', () => {
  console.log('Connected to WebSocket');
});

// Помилка підключення
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
```

### Room Management

#### Join/Leave Order Chat
```typescript
// Приєднатися до чату замовлення
socket.emit('join_order_chat', { orderId: 'uuid' });

// Покинути чат замовлення
socket.emit('leave_order_chat', { orderId: 'uuid' });
```

#### Join/Leave Dispute Chat
```typescript
// Приєднатися до чату спору
socket.emit('join_dispute_chat', { disputeId: 'uuid' });

// Покинути чат спору
socket.emit('leave_dispute_chat', { disputeId: 'uuid' });
```

### Messaging Events

#### Order Messages
```typescript
// Відправити повідомлення в чат замовлення
socket.emit('order_message', {
  orderId: 'uuid',
  content: 'message text',
  attachments: [{ fileUrl: 'url', fileName: 'name' }]
});

// Отримати повідомлення з чату замовлення
socket.on('order_message', (data: OrderChatMessage) => {
  // Handle new message
});
```

#### Dispute Messages
```typescript
// Відправити повідомлення в чат спору
socket.emit('dispute_message', {
  disputeId: 'uuid',
  content: 'message text'
});

// Отримати повідомлення з чату спору
socket.on('dispute_message', (data: DisputeChatMessage) => {
  // Handle new message
});
```

### Typing Indicators

```typescript
// Показати, що користувач друкує
socket.emit('order_typing', { orderId: 'uuid', isTyping: true });
socket.emit('dispute_typing', { disputeId: 'uuid', isTyping: true });

// Отримати інформацію про те, що хтось друкує
socket.on('order_typing', (data) => {
  console.log(`${data.userId} is typing in order ${data.orderId}`);
});
```

### Status Updates

```typescript
// Оновлення статусу замовлення
socket.on('order_status_update', (data) => {
  console.log(`Order ${data.orderId} status changed to ${data.status}`);
});

// Оновлення статусу спору
socket.on('dispute_status_update', (data) => {
  console.log(`Dispute ${data.disputeId} status changed to ${data.status}`);
});
```

### Notifications

```typescript
// Отримати сповіщення
socket.on('notification', (data) => {
  console.log('New notification:', data.content);
});
```

### User Presence

```typescript
// Відстежувати присутність користувачів
socket.on('user_presence', (data) => {
  console.log(`User ${data.userId} is ${data.isOnline ? 'online' : 'offline'}`);
});
```

## React Integration

### Using the WebSocket Hook

```typescript
import { useWebSocket } from '@/hooks/useWebSocket';

function MyComponent() {
  const webSocket = useWebSocket();

  useEffect(() => {
    if (webSocket.isConnected) {
      webSocket.joinOrderChat(orderId);
      
      webSocket.onOrderMessage((message) => {
        console.log('New message:', message);
      });

      return () => {
        webSocket.leaveOrderChat(orderId);
      };
    }
  }, [webSocket.isConnected, orderId]);

  return (
    <div>
      {webSocket.isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
```

### Using Chat Components

```typescript
import OrderChat from '@/components/OrderChat';
import DisputeChat from '@/components/DisputeChat';

// Order Chat
<OrderChat 
  orderId={orderId}
  participants={{
    client: { id: '...', name: '...', avatar: '...' },
    performer: { id: '...', name: '...', avatar: '...' }
  }}
/>

// Dispute Chat
<DisputeChat
  disputeId={disputeId}
  orderId={orderId}
  participants={{
    client: { id: '...', name: '...' },
    performer: { id: '...', name: '...' },
    moderator: { id: '...', name: 'Модератор' }
  }}
/>
```

## Security

### Authentication
- Всі WebSocket з'єднання вимагають валідний JWT токен
- Токен перевіряється при підключенні та при кожній дії

### Authorization
- Користувачі можуть приєднуватися тільки до чатів, до яких мають доступ
- Клієнти та виконавці можуть приєднуватися до чатів своїх замовлень
- Адміністратори мають доступ до всіх чатів
- Модератори мають доступ до чатів спорів

### Room Isolation
- Повідомлення надсилаються тільки учасникам відповідних кімнат
- Кімнати ізольовані одна від одної

## Database Schema

### Messages Table
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'text',
    file_url VARCHAR(255),
    file_name VARCHAR(255),
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Dispute Messages Table
```sql
CREATE TABLE dispute_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Performance Considerations

### Connection Pooling
- WebSocket сервер підтримує множинні з'єднання від одного користувача
- Automatic cleanup при від'єднанні

### Memory Management
- Typing indicators автоматично очищуються
- Неактивні кімнати видаляються з пам'яті

### Fallback Strategy
- Якщо WebSocket недоступний, компоненти fallback на HTTP polling
- Graceful degradation UX

## Monitoring

### Connection Tracking
```sql
CREATE TABLE websocket_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    socket_id VARCHAR(255) NOT NULL,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);
```

### Logs
- Всі WebSocket події логуються на сервері
- Connection/disconnection events
- Message broadcasting events
- Error handling

## Testing

### Manual Testing
1. Відкрийте два браузера з різними користувачами
2. Створіть замовлення між ними
3. Тестуйте real-time messaging
4. Тестуйте typing indicators
5. Тестуйте dispute functionality

### Automated Testing
```bash
# Запустити тестовий скрипт
./test-websocket.sh
```

## Deployment

### Environment Variables
```bash
# Server
NODE_ENV=production
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url

# Client
VITE_API_BASE=https://your-api-domain.com/v1
```

### Production Considerations
- Використовуйте Redis для scaling WebSocket sessions
- Налаштуйте load balancer з sticky sessions
- Моніторинг WebSocket connections
- Rate limiting для message sending

## Troubleshooting

### Common Issues

1. **WebSocket Connection Fails**
   - Перевірте JWT токен
   - Перевірте CORS налаштування
   - Перевірте firewall rules

2. **Messages Not Delivered**
   - Перевірте room membership
   - Перевірте user permissions
   - Перевірте database constraints

3. **Performance Issues**
   - Моніторинг active connections
   - Перевірте memory usage
   - Оптимізуйте database queries

### Debug Mode
```typescript
// Увімкнути debug режим
const webSocket = useWebSocket({ debug: true });
```
