import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://tnbumpudkrdirsbwsurc.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYnVtcHVka3JkaXJzYndzdXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMTY5MTgsImV4cCI6MjA4Nzg5MjkxOH0.SDPGyjWeGesS1qk-sZus7yjxldhoMM1LT069V8cQTLE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
