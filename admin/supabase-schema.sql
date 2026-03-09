-- ================================================================
--  SUPABASE SCHEMA — Dr. Angel M. Ancona Pérez
--  Ejecuta este script en el SQL Editor de supabase.com
-- ================================================================


-- ── TABLA: blog_posts ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  category    TEXT,
  author      TEXT DEFAULT 'Dr. Angel M. Ancona Pérez',
  published   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_blog_posts_published   ON blog_posts (published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at  ON blog_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category    ON blog_posts (category);

-- Habilitar Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Política: cualquiera puede LEER artículos publicados (para el sitio público)
CREATE POLICY "Artículos publicados son públicos"
  ON blog_posts FOR SELECT
  USING (published = TRUE);

-- Política: solo usuarios autenticados pueden hacer todo (CRUD completo)
CREATE POLICY "Admins tienen acceso total"
  ON blog_posts FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);


-- ── TABLA: appointments (preparada para el futuro) ────────────
CREATE TABLE IF NOT EXISTS appointments (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  last_name    TEXT,
  phone        TEXT,
  email        TEXT,
  date         DATE,
  time         TIME,
  reason       TEXT,
  notes        TEXT,
  status       TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden ver y gestionar citas
CREATE POLICY "Solo admins gestionan citas"
  ON appointments FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);


-- ── TABLA: patients (preparada para el futuro) ────────────────
CREATE TABLE IF NOT EXISTS patients (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name   TEXT NOT NULL,
  last_name    TEXT,
  email        TEXT,
  phone        TEXT,
  birth_date   DATE,
  gender       TEXT CHECK (gender IN ('masculino', 'femenino', 'otro')),
  diagnosis    TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden ver y gestionar pacientes
CREATE POLICY "Solo admins gestionan pacientes"
  ON patients FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);


-- ── FUNCIÓN: actualizar updated_at automáticamente ────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_blog
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_appointments
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_patients
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── DATOS DE EJEMPLO (opcional, puedes eliminar) ──────────────
INSERT INTO blog_posts (title, excerpt, content, category, published) VALUES
(
  'Hernia de Disco: Cuándo Operar y Cuándo Esperar',
  'La mayoría de las hernias de disco mejoran con tratamiento conservador. Te explico cuándo la cirugía es realmente necesaria.',
  'La hernia de disco es una de las consultas más frecuentes en mi práctica. Muchos pacientes llegan con miedo a la cirugía, y en la mayoría de los casos ese miedo no está justificado. El 90% de los pacientes mejora con tratamiento conservador en 6-12 semanas...',
  'Columna Vertebral',
  TRUE
),
(
  'Cirugía Mínimamente Invasiva de Columna: Mitos y Realidades',
  'La cirugía endoscópica de columna permite recuperaciones mucho más rápidas. Conozca en qué consiste y quiénes son candidatos.',
  'Durante años, la cirugía de columna fue sinónimo de grandes incisiones, sangrado abundante y largas recuperaciones. Hoy, las técnicas mínimamente invasivas han cambiado radicalmente este panorama...',
  'Cirugía Mínimamente Invasiva',
  TRUE
);
