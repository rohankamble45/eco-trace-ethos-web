// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zugxknoyuyrdwizlvkcb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z3hrbm95dXlyZHdpemx2a2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTg1MzUsImV4cCI6MjA2MDM5NDUzNX0.oZbLSUgLyaBYdB-ZGxVsg5IqW3YYicV_NB2ehjKDCNY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);