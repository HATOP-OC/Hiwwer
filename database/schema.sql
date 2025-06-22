-- Hiwwer Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'performer', 'admin')),
    avatar_url VARCHAR(255),
    bio TEXT,
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    telegram_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Categories Table
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags Table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    performer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    delivery_time INT NOT NULL CHECK (delivery_time > 0), -- in days
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    review_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Tags Relation Table
CREATE TABLE service_tags (
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, tag_id)
);

-- Service Images Table
CREATE TABLE service_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id),
    client_id UUID NOT NULL REFERENCES users(id),
    performer_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL DEFAULT '',
    requirements TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('open','pending','in_progress','revision','completed','canceled','disputed')),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    additional_options JSONB NOT NULL DEFAULT '{}'::jsonb,
    category_id UUID REFERENCES service_categories(id)
);

-- Additional Options Table
CREATE TABLE order_additional_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('proposed','accepted','rejected')) DEFAULT 'proposed',
    proposed_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_order_additional_options_order_id ON order_additional_options(order_id);

-- Order Status History Table
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending','in_progress','revision','completed','canceled','disputed')),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    changed_by UUID NOT NULL REFERENCES users(id)
);
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- Order Attachments Table
CREATE TABLE order_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    file_url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'file', 'system')),
    file_url VARCHAR(255), -- для файлових повідомлень
    file_name VARCHAR(255), -- ім'я файлу
    read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE, -- коли прочитано
    edited BOOLEAN NOT NULL DEFAULT false, -- чи було відредаговано
    deleted BOOLEAN NOT NULL DEFAULT false, -- чи було видалено
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message Attachments Table
CREATE TABLE message_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id),
    client_id UUID NOT NULL REFERENCES users(id),
    performer_id UUID NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('new_order', 'status_change', 'message', 'review', 'deadline', 'dispute', 'payment')),
    content TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    related_id UUID, -- can be order_id, message_id, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending','authorized','completed','refunded','failed')),
    provider VARCHAR(50) NOT NULL, -- e.g., 'stripe', 'liqpay'
    provider_payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disputes Table
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id),
    performer_id UUID NOT NULL REFERENCES users(id),
    moderator_id UUID REFERENCES users(id),
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('open','in_review','resolved')) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_disputes_order_id ON disputes(order_id);

-- Dispute Messages Table
CREATE TABLE dispute_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_dispute_messages_dispute_id ON dispute_messages(dispute_id);

-- WebSocket Connections Table (for monitoring and analytics)
CREATE TABLE websocket_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    socket_id VARCHAR(255) NOT NULL,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Admin Settings Table
CREATE TABLE admin_settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255) NOT NULL DEFAULT 'Hiwwer',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    allowed_file_types TEXT, -- JSON string containing file type configurations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_services_performer_id ON services (performer_id);
CREATE INDEX idx_services_category_id ON services (category_id);
CREATE INDEX idx_orders_client_id ON orders (client_id);
CREATE INDEX idx_orders_performer_id ON orders (performer_id);
CREATE INDEX idx_orders_category_id ON orders (category_id);
CREATE INDEX idx_messages_order_id ON messages (order_id);
CREATE INDEX idx_notifications_user_id ON notifications (user_id);

-- WebSocket-specific indexes for performance optimization
CREATE INDEX idx_websocket_connections_user_id ON websocket_connections(user_id);
CREATE INDEX idx_websocket_connections_socket_id ON websocket_connections(socket_id);
CREATE INDEX idx_messages_order_sender ON messages(order_id, sender_id);
CREATE INDEX idx_messages_read_at ON messages(read_at) WHERE read_at IS NULL;
CREATE INDEX idx_dispute_messages_dispute_sender ON dispute_messages(dispute_id, sender_id);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);

CREATE INDEX idx_services_price ON services(price);

CREATE INDEX idx_orders_service_id ON orders(service_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_updated_at ON messages(updated_at);
CREATE INDEX idx_messages_deleted ON messages(deleted) WHERE deleted = false;

-- Create functions to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at automatically
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Example seed data for categories
INSERT INTO service_categories (name, slug, description, icon) VALUES
('Веб-розробка', 'web-development', 'Створення веб-сайтів та веб-додатків', 'code'),
('Дизайн', 'design', 'Графічний дизайн, UI/UX, логотипи', 'palette'),
('Маркетинг', 'marketing', 'Цифровий маркетинг, SMM, SEO', 'trending-up'),
('Копірайтинг', 'copywriting', 'Написання текстів, контенту', 'edit'),
('Переклад', 'translation', 'Переклад текстів різними мовами', 'globe'),
('Відео', 'video', 'Відеомонтаж, анімація', 'film'),
('Аудіо', 'audio', 'Аудіо обробка, озвучування', 'music'),
('Інше', 'other', 'Інші послуги', 'more-horizontal'),
('Design', 'design', 'Graphic design, logos, UI/UX, illustrations, and more', '🎨'),
('Development', 'development', 'Web development, mobile apps, software, and more', '💻'),
('Writing', 'writing', 'Content writing, copywriting, translation, and more', '✍️'),
('Marketing', 'marketing', 'SEO, social media, content marketing, and more', '📈'),
('Video', 'video', 'Video editing, animation, motion graphics, and more', '🎥'),
('Audio', 'audio', 'Music production, voice over, sound effects, and more', '🎵'),
('Business', 'business', 'Business plans, market research, legal advice, and more', '💼'),
('Lifestyle', 'lifestyle', 'Health, fitness, personal coaching, and more', '🌱')
ON CONFLICT (slug) DO NOTHING;

-- Example seed data for tags
INSERT INTO tags (name, slug) VALUES
('Logo', 'logo'),
('Website', 'website'),
('Mobile App', 'mobile-app'),
('SEO', 'seo'),
('Social Media', 'social-media'),
('Content', 'content'),
('Video Editing', 'video-editing'),
('Animation', 'animation'),
('Programming', 'programming'),
('Consulting', 'consulting');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on messages table
CREATE TRIGGER trigger_update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();
