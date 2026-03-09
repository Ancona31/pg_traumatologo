/* ================================================================
   SUPABASE CLIENT CONFIGURATION
   ⚠️  IMPORTANTE: Reemplaza SUPABASE_URL y SUPABASE_ANON_KEY
       con los valores reales de tu proyecto en supabase.com
================================================================ */

const SUPABASE_URL  = 'https://TU_PROYECTO.supabase.co';        // TODO: reemplazar
const SUPABASE_ANON = 'TU_ANON_KEY';                            // TODO: reemplazar

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

export default db;
