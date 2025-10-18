-- Support Tickets System
-- This enables users to submit support tickets from web app or desktop app

-- Support ticket categories
CREATE TYPE ticket_category AS ENUM (
  'bug_report',
  'feature_request',
  'technical_support',
  'billing',
  'account',
  'other'
);

-- Support ticket status
CREATE TYPE ticket_status AS ENUM (
  'open',
  'in_progress',
  'waiting_for_user',
  'resolved',
  'closed'
);

-- Support ticket priority
CREATE TYPE ticket_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ticket_number SERIAL UNIQUE NOT NULL,
  
  -- Ticket details
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category ticket_category NOT NULL DEFAULT 'other',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  
  -- User info (in case user is deleted)
  user_email TEXT,
  user_name TEXT,
  
  -- Source tracking
  source TEXT DEFAULT 'web', -- 'web' or 'desktop'
  
  -- Desktop app specific data
  desktop_logs_url TEXT, -- URL to uploaded logs
  system_info JSONB, -- System information from desktop app
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  
  -- Admin assignment
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_notes TEXT
);

-- Ticket messages/responses
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Message content
  message TEXT NOT NULL,
  is_staff_reply BOOLEAN DEFAULT false,
  
  -- Attachments
  attachments JSONB, -- Array of attachment URLs
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX idx_support_tickets_ticket_number ON support_tickets(ticket_number);
CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_created_at ON ticket_messages(created_at);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_support_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER support_tickets_updated_at
BEFORE UPDATE ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_support_ticket_updated_at();

-- Auto-populate user info when ticket is created
CREATE OR REPLACE FUNCTION populate_ticket_user_info()
RETURNS TRIGGER AS $$
DECLARE
  user_record RECORD;
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    -- Query from auth.users table
    SELECT email, raw_user_meta_data->>'full_name' as full_name
    INTO user_record
    FROM auth.users
    WHERE id = NEW.user_id;
    
    IF FOUND THEN
      NEW.user_email := user_record.email;
      NEW.user_name := user_record.full_name;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER populate_ticket_user_info_trigger
BEFORE INSERT ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION populate_ticket_user_info();

-- RLS Policies
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Users can view their own tickets
CREATE POLICY "Users can view own tickets"
ON support_tickets FOR SELECT
USING (auth.uid() = user_id);

-- Users can create tickets
CREATE POLICY "Users can create tickets"
ON support_tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own open tickets
CREATE POLICY "Users can update own tickets"
ON support_tickets FOR UPDATE
USING (auth.uid() = user_id AND status IN ('open', 'waiting_for_user'))
WITH CHECK (auth.uid() = user_id AND status IN ('open', 'waiting_for_user'));

-- Admins can view all tickets (check via user metadata)
CREATE POLICY "Admins can view all tickets"
ON support_tickets FOR SELECT
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Admins can update all tickets to any status
CREATE POLICY "Admins can update all tickets"
ON support_tickets FOR UPDATE
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (true); -- Admins can set ANY status

-- Users can view messages for their tickets
CREATE POLICY "Users can view messages for own tickets"
ON ticket_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = ticket_messages.ticket_id
    AND support_tickets.user_id = auth.uid()
  )
);

-- Users can create messages on their tickets
CREATE POLICY "Users can create messages on own tickets"
ON ticket_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = ticket_messages.ticket_id
    AND support_tickets.user_id = auth.uid()
  )
);

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON ticket_messages FOR SELECT
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Admins can create messages
CREATE POLICY "Admins can create messages"
ON ticket_messages FOR INSERT
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Create a view for ticket counts by status
CREATE OR REPLACE VIEW ticket_stats AS
SELECT 
  status,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_count
FROM support_tickets
GROUP BY status;

COMMENT ON TABLE support_tickets IS 'Support tickets from users via web or desktop app';
COMMENT ON TABLE ticket_messages IS 'Messages and responses for support tickets';
