import { createClient } from '@supabase/supabase-js';

// NOTE: To make this application production-ready with real data:
// 1. Create a project at https://supabase.com
// 2. Get your SUPABASE_URL and SUPABASE_ANON_KEY
// 3. Set them in a .env file or replace strings below.

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
