import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // or VITE_SUPABASE_KEY if you used that name

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase env vars are missing. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
