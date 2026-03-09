/* ================================================================
   SUPABASE CLIENT CONFIGURATION
   ⚠️  IMPORTANTE: Reemplaza SUPABASE_URL y SUPABASE_ANON_KEY
       con los valores reales de tu proyecto en supabase.com
================================================================ */

const SUPABASE_URL  = 'https://ithwmacwyexinxjtnbcg.supabase.co';        // TODO: reemplazar
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aHdtYWN3eWV4aW54anRuYmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTYyNTYsImV4cCI6MjA4ODU5MjI1Nn0.WbG3MkP7xvI64V5Ip_GEBkKpVIMs-D8e7fOGB8eePfE';                            // TODO: reemplazar

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

export default db;
