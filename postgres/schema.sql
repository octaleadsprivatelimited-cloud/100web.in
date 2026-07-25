CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin','editor','customer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  company TEXT,
  phone TEXT,
  role app_role NOT NULL DEFAULT 'customer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_token_hash_idx ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

CREATE OR REPLACE VIEW user_roles AS SELECT id, id AS user_id, role, created_at FROM users;
CREATE OR REPLACE VIEW profiles AS SELECT id, full_name, NULL::text AS avatar_url, company, phone, created_at, updated_at FROM users;

CREATE TABLE IF NOT EXISTS popup_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, message TEXT, image_url TEXT,
  cta_label TEXT, cta_url TEXT, is_active BOOLEAN NOT NULL DEFAULT true, starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ, priority INT NOT NULL DEFAULT 0, created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE popup_banners ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE popup_banners ADD COLUMN IF NOT EXISTS position TEXT NOT NULL DEFAULT 'bottom-right';
ALTER TABLE popup_banners ADD COLUMN IF NOT EXISTS style_variant TEXT NOT NULL DEFAULT 'classic';
ALTER TABLE popup_banners ADD COLUMN IF NOT EXISTS text_align TEXT NOT NULL DEFAULT 'left';
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL,
  department TEXT NOT NULL, location TEXT NOT NULL, bio TEXT NOT NULL, long_bio TEXT NOT NULL, linkedin TEXT, email TEXT,
  experience_years INT NOT NULL DEFAULT 0, skills TEXT[] NOT NULL DEFAULT '{}', experience JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]', achievements TEXT[] NOT NULL DEFAULT '{}', video_url TEXT, avatar_initials TEXT NOT NULL,
  accent TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS avatar_url TEXT;
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  byte_size INT NOT NULL,
  content BYTEA NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'general',
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL,
  excerpt TEXT, cover_image TEXT, author_id UUID REFERENCES users(id) ON DELETE SET NULL, published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Insights';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS service_slug TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS keywords TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_minutes INT NOT NULL DEFAULT 6;
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS blog_posts_service_slug_idx ON blog_posts(service_slug);
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, image_url TEXT NOT NULL, alt_text TEXT NOT NULL,
  caption TEXT, category TEXT NOT NULL DEFAULT 'General', is_featured BOOLEAN NOT NULL DEFAULT false, sort_order INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, youtube_url TEXT NOT NULL, description TEXT,
  category TEXT NOT NULL DEFAULT 'General', thumbnail_url TEXT, is_published BOOLEAN NOT NULL DEFAULT true, sort_order INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS service_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS industry_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS customer_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_number TEXT UNIQUE NOT NULL, billing_name TEXT, billing_email TEXT, billing_phone TEXT, company TEXT,
  address JSONB NOT NULL DEFAULT '{}', status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS customer_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL, service_type TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', progress INT NOT NULL DEFAULT 0,
  started_at DATE, due_at DATE, next_milestone TEXT, next_milestone_at DATE, project_manager TEXT, support_email TEXT, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS customer_renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
  project_id UUID REFERENCES customer_projects(id) ON DELETE SET NULL, item_name TEXT NOT NULL, description TEXT,
  amount_minor INT NOT NULL, currency TEXT NOT NULL DEFAULT 'INR', due_at DATE NOT NULL, status TEXT NOT NULL DEFAULT 'due',
  payment_url TEXT, provider_reference TEXT, paid_at TIMESTAMPTZ, discount_minor INT NOT NULL DEFAULT 0,
  referral_discount_minor INT NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE customer_renewals ADD COLUMN IF NOT EXISTS razorpay_payment_link_id TEXT;
ALTER TABLE customer_renewals ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE customer_renewals ADD COLUMN IF NOT EXISTS payment_generated_at TIMESTAMPTZ;
ALTER TABLE customer_renewals ADD COLUMN IF NOT EXISTS reminder_sent_count INT NOT NULL DEFAULT 0;
ALTER TABLE customer_renewals ADD COLUMN IF NOT EXISTS last_reminder_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS renewal_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  renewal_id UUID NOT NULL REFERENCES customer_renewals(id) ON DELETE CASCADE,
  sequence_no INT NOT NULL CHECK(sequence_no BETWEEN 1 AND 8),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  channels JSONB NOT NULL DEFAULT '["email","whatsapp","sms"]',
  delivery_results JSONB NOT NULL DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(renewal_id, sequence_no)
);
CREATE INDEX IF NOT EXISTS renewal_reminders_due_idx ON renewal_reminders(status, scheduled_at);
INSERT INTO renewal_reminders(renewal_id,sequence_no,scheduled_at)
SELECT r.id, schedule.sequence_no,
       GREATEST(
         now() + ((schedule.sequence_no - 1) * interval '1 day'),
         r.due_at::timestamptz + (schedule.day_offset * interval '1 day')
       )
FROM customer_renewals r
CROSS JOIN unnest(ARRAY[-30,-14,-7,-3,-1,0,3,7]) WITH ORDINALITY AS schedule(day_offset,sequence_no)
WHERE r.payment_url IS NOT NULL AND r.status <> 'paid'
ON CONFLICT(renewal_id,sequence_no) DO NOTHING;

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
  renewal_id UUID REFERENCES customer_renewals(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  provider_payment_id TEXT UNIQUE,
  provider_payment_link_id TEXT,
  provider_event_id TEXT UNIQUE,
  amount_minor INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL,
  method TEXT,
  email TEXT,
  contact TEXT,
  paid_at TIMESTAMPTZ,
  raw_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS customer_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
  renewal_id UUID REFERENCES customer_renewals(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES payment_transactions(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  amount_minor INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'issued',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  provider_payment_id TEXT,
  billing_snapshot JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  stage TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'manual',
  value_minor INT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  next_followup_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  subject TEXT,
  template TEXT NOT NULL,
  target_stage TEXT,
  scheduled_at TIMESTAMPTZ,
  stats JSONB NOT NULL DEFAULT '{"sent":0,"delivered":0,"failed":0}',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  channel TEXT NOT NULL,
  subject TEXT,
  template TEXT NOT NULL,
  delay_minutes INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound',
  recipient TEXT NOT NULL,
  subject TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS customer_mailboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
  email_address TEXT NOT NULL, display_name TEXT, plan_name TEXT, status TEXT NOT NULL DEFAULT 'active', renewal_at DATE,
  recovery_destination_masked TEXT, recovery_verified BOOLEAN NOT NULL DEFAULT false, last_verified_at TIMESTAMPTZ, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(customer_id,email_address)
);
CREATE TABLE IF NOT EXISTS referral_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), referrer_customer_id UUID NOT NULL REFERENCES customer_accounts(id),
  code TEXT NOT NULL, full_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, company TEXT, message TEXT,
  status TEXT NOT NULL DEFAULT 'new', referred_customer_id UUID REFERENCES customer_accounts(id), first_payment_minor INT,
  paid_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(referrer_customer_id,email)
);
CREATE TABLE IF NOT EXISTS customer_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(), email TEXT NOT NULL,
  full_name TEXT, company TEXT, referral_lead_id UUID REFERENCES referral_leads(id), created_by UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now()+interval '7 days', accepted_at TIMESTAMPTZ,
  accepted_user_id UUID REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_id UUID UNIQUE NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL, is_active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS referral_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
  referral_lead_id UUID UNIQUE NOT NULL REFERENCES referral_leads(id), amount_minor INT NOT NULL DEFAULT 100000,
  currency TEXT NOT NULL DEFAULT 'INR', status TEXT NOT NULL DEFAULT 'available',
  renewal_id UUID REFERENCES customer_renewals(id), applied_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION submit_referral_lead(_code TEXT,_full_name TEXT,_email TEXT,_phone TEXT,_company TEXT,_message TEXT)
RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE _referrer UUID; _id UUID;
BEGIN
  SELECT customer_id INTO _referrer FROM referral_codes WHERE lower(code)=lower(trim(_code)) AND is_active=true;
  IF _referrer IS NULL THEN RAISE EXCEPTION 'Invalid or inactive referral link'; END IF;
  INSERT INTO referral_leads(referrer_customer_id,code,full_name,email,phone,company,message)
  VALUES(_referrer,upper(trim(_code)),trim(_full_name),lower(trim(_email)),nullif(trim(_phone),''),nullif(trim(_company),''),nullif(trim(_message),''))
  RETURNING id INTO _id; RETURN _id;
END $$;
CREATE OR REPLACE FUNCTION mark_referral_paid(_lead_id UUID,_referred_customer_id UUID,_payment_minor INT)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE _referrer UUID;
BEGIN
  SELECT referrer_customer_id INTO _referrer FROM referral_leads WHERE id=_lead_id FOR UPDATE;
  UPDATE referral_leads SET status='paid',referred_customer_id=_referred_customer_id,first_payment_minor=_payment_minor,paid_at=now() WHERE id=_lead_id;
  INSERT INTO referral_credits(customer_id,referral_lead_id) VALUES(_referrer,_lead_id) ON CONFLICT(referral_lead_id) DO NOTHING;
END $$;

-- Demo accounts requested for local verification. Change these passwords after first login.
INSERT INTO users(email,password_hash,full_name,role) VALUES
('admin.demo@yourdomain.com','$2b$12$V/w1W/oW02hIAhoUsdQIn.doro/90qnBWNZ5smbmHcTDPjOEaRppW','Demo Administrator','admin'),
('customer.demo@yourdomain.com','$2b$12$V/w1W/oW02hIAhoUsdQIn.doro/90qnBWNZ5smbmHcTDPjOEaRppW','Demo Customer','customer')
ON CONFLICT(email) DO NOTHING;
INSERT INTO customer_accounts(user_id,account_number,billing_name,billing_email,company)
SELECT id,'CUST-DEMO100','Demo Customer',email,'Demo Company' FROM users WHERE email='customer.demo@yourdomain.com'
ON CONFLICT(user_id) DO NOTHING;
INSERT INTO referral_codes(customer_id,code)
SELECT id,'DEMO100' FROM customer_accounts WHERE account_number='CUST-DEMO100' ON CONFLICT(customer_id) DO NOTHING;
INSERT INTO customer_projects(customer_id,name,service_type,status,progress,started_at,due_at,next_milestone,next_milestone_at,project_manager)
SELECT id,'Corporate Website','Website Development','active',68,current_date-30,current_date+21,'Content approval',current_date+5,'Project Team'
FROM customer_accounts WHERE account_number='CUST-DEMO100' AND NOT EXISTS(SELECT 1 FROM customer_projects WHERE name='Corporate Website');
INSERT INTO customer_renewals(customer_id,item_name,description,amount_minor,due_at,status,payment_url)
SELECT id,'Website hosting renewal','Annual managed hosting',1200000,current_date+30,'upcoming','https://example.com/payment'
FROM customer_accounts WHERE account_number='CUST-DEMO100' AND NOT EXISTS(SELECT 1 FROM customer_renewals WHERE item_name='Website hosting renewal');
INSERT INTO customer_mailboxes(customer_id,email_address,display_name,plan_name,renewal_at,recovery_destination_masked,recovery_verified)
SELECT id,'hello@democompany.com','General Enquiries','Zoho Mail Workplace',current_date+45,'+91 ******3210',true
FROM customer_accounts WHERE account_number='CUST-DEMO100' ON CONFLICT(customer_id,email_address) DO NOTHING;

-- Repair older installations where UUID primary-key defaults were missing.
DO $$
DECLARE target RECORD;
BEGIN
  FOR target IN
    SELECT c.table_name
    FROM information_schema.columns c
    JOIN information_schema.tables t
      ON t.table_schema = c.table_schema AND t.table_name = c.table_name
    WHERE c.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND c.column_name = 'id'
      AND c.udt_name = 'uuid'
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN id SET DEFAULT gen_random_uuid()',
      target.table_name
    );
  END LOOP;
END $$;
