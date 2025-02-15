import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://imlebkoujkeojasrnkqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbGVia291amtlb2phc3Jua3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NDYxNjgsImV4cCI6MjA1NTIyMjE2OH0.OrvnNa5MRHOHWPJqplUzCxUUasqkgTmlY6g7n2VPHW8';

export const supabase = createClient(supabaseUrl, supabaseKey);