-- Migration to add WebSocket support fields
-- Run this after the initial schema.sql

-- Add read_at field to messages table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'messages' AND column_name = 'read_at') THEN
        ALTER TABLE messages ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Update existing messages to have receiver_id if missing
UPDATE messages SET receiver_id = (
    SELECT CASE 
        WHEN sender_id = o.client_id THEN o.performer_id
        ELSE o.client_id
    END
    FROM orders o
    WHERE o.id = messages.order_id
) WHERE receiver_id IS NULL;

-- Ensure disputes table has all necessary fields
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'disputes' AND column_name = 'moderator_id') THEN
        ALTER TABLE disputes ADD COLUMN moderator_id UUID REFERENCES users(id);
    END IF;
END $$;

-- Create WebSocket connection tracking table (optional for monitoring)
CREATE TABLE IF NOT EXISTS websocket_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    socket_id VARCHAR(255) NOT NULL,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_websocket_connections_user_id ON websocket_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_websocket_connections_socket_id ON websocket_connections(socket_id);

-- Add some helpful indexes for WebSocket performance
CREATE INDEX IF NOT EXISTS idx_messages_order_sender ON messages(order_id, sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_read_at ON messages(read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute_sender ON dispute_messages(dispute_id, sender_id);

-- Add foreign key constraint for receiver_id if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'messages_receiver_id_fkey'
    ) THEN
        ALTER TABLE messages ADD CONSTRAINT messages_receiver_id_fkey 
        FOREIGN KEY (receiver_id) REFERENCES users(id);
    END IF;
END $$;
