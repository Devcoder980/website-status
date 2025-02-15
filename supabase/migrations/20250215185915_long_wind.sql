/*
  # Initial Schema Setup for Website Monitoring System

  1. New Tables
    - `customers`
      - Basic customer information
      - Contact details
      - Address information
    - `websites`
      - Website details
      - Customer relationship
    - `website_errors`
      - Error tracking
      - Timestamp and status
    - `followups`
      - Customer followup tracking
      - Status and notes
    - `maintenance_reminders`
      - Scheduled maintenance tracking
      - Reminder status

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Relationships
    - Customer to Websites (one-to-many)
    - Website to Errors (one-to-many)
    - Customer to Followups (one-to-many)
*/
/*
  # Corrected Schema Setup for Website Monitoring System
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  company_name text,
  email text NOT NULL,
  phone text,
  address text,
  city text,
  state text,
  postal_code text,
  country text DEFAULT 'US',
  notes text,
  last_contacted_at timestamptz
);

-- Create websites table with customer relationship
CREATE TABLE IF NOT EXISTS websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  status text DEFAULT 'active',
  check_frequency interval DEFAULT '1 hour',
  last_check_at timestamptz,
  next_maintenance_date date,
  maintenance_notes text
);

-- Create website errors table
CREATE TABLE IF NOT EXISTS website_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  website_id uuid NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  error_type text NOT NULL,
  error_message text NOT NULL,
  status text DEFAULT 'open',
  resolved_at timestamptz,
  resolution_notes text
);

-- Create followups table
CREATE TABLE IF NOT EXISTS followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  notes text,
  scheduled_for timestamptz,
  completed_at timestamptz
);

-- Create maintenance reminders table
CREATE TABLE IF NOT EXISTS maintenance_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  website_id uuid NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  sent_at timestamptz,
  completed_at timestamptz
);

-- Create performance metrics table with website relationship
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  website_id uuid NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  mobile_score integer,
  desktop_score integer,
  mobile_fcp numeric,
  mobile_lcp numeric,
  mobile_cls numeric,
  mobile_fid numeric,
  desktop_fcp numeric,
  desktop_lcp numeric,
  desktop_cls numeric,
  desktop_fid numeric,
  status text,
  error_message text
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read their customers" ON customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read their websites" ON websites
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read their website errors" ON website_errors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read their followups" ON followups
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read their maintenance reminders" ON maintenance_reminders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read their performance metrics" ON performance_metrics
  FOR SELECT TO authenticated USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_websites_customer_id ON websites(customer_id);
CREATE INDEX IF NOT EXISTS idx_website_errors_website_id ON website_errors(website_id);
CREATE INDEX IF NOT EXISTS idx_followups_customer_id ON followups(customer_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_reminders_website_id ON maintenance_reminders(website_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_website_id ON performance_metrics(website_id);

-- Function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at on update
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_websites_updated_at
  BEFORE UPDATE ON websites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_website_errors_updated_at
  BEFORE UPDATE ON website_errors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_followups_updated_at
  BEFORE UPDATE ON followups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_maintenance_reminders_updated_at
  BEFORE UPDATE ON maintenance_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_performance_metrics_updated_at
  BEFORE UPDATE ON performance_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
