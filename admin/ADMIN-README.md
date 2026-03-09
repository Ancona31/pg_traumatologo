# Panel de Administración — Dr. Angel M. Ancona Pérez

## Configuración inicial (solo una vez)

### 1. Crear cuenta en Supabase (gratis)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto (nombre: `dr-ancona`, elige una contraseña segura)
3. Espera 2 minutos a que el proyecto se inicialice

### 2. Configurar la base de datos

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido de `admin/supabase-schema.sql`
3. Haz clic en **Run** — esto crea todas las tablas necesarias

### 3. Crear usuario administrador

1. En Supabase, ve a **Authentication > Users**
2. Haz clic en **Add user**
3. Ingresa el correo y contraseña del administrador
4. El usuario queda activo de inmediato

### 4. Obtener las credenciales de la API

1. En Supabase, ve a **Settings > API**
2. Copia:
   - **Project URL** → este es tu `SUPABASE_URL`
   - **anon public key** → este es tu `SUPABASE_ANON`

### 5. Configurar las credenciales en el código

Busca y reemplaza en estos 3 archivos:

```
admin/login.html
admin/dashboard.html
admin/blog.html
```

En cada uno, reemplaza:
```javascript
const SUPABASE_URL  = 'https://TU_PROYECTO.supabase.co';  // ← tu Project URL
const SUPABASE_ANON = 'TU_ANON_KEY';                      // ← tu anon public key
```

### 6. Subir a GitHub y publicar

```bash
git add .
git commit -m "Agrega panel de administracion con Supabase"
git push
```

---

## Cómo usar el panel

### Acceder
- URL: `https://TU_USUARIO.github.io/pg_traumatologo/admin/login.html`
- Ingresa con el correo y contraseña que creaste en el paso 3

### Gestionar el blog
- Desde el **Dashboard**, haz clic en "Blog" o "Nuevo artículo"
- En la página de **Blog**:
  - **Crear**: botón "+ Nuevo artículo" (arriba a la derecha)
  - **Editar**: botón ✏️ en cada artículo
  - **Publicar/Borrador**: botón ⬆️/⬇️
  - **Eliminar**: botón 🗑️ (pide confirmación)

---

## Estructura de archivos

```
admin/
├── login.html              ← Página de inicio de sesión
├── dashboard.html          ← Panel principal con estadísticas
├── blog.html               ← Gestión completa del blog (CRUD)
├── supabase-schema.sql     ← Script SQL para configurar la base de datos
├── ADMIN-README.md         ← Este archivo
└── js/
    ├── supabase-client.js  ← Configuración de Supabase (módulo)
    ├── auth.js             ← Lógica de autenticación
    └── blog-manager.js     ← CRUD del blog
```

---

## Próximas funcionalidades (en desarrollo)

- **📅 Gestión de Citas** — Ver, confirmar y cancelar citas de pacientes
- **👤 Base de Pacientes** — Historial y expedientes de pacientes
- **📊 Estadísticas** — Métricas de visitas y consultas

---

## Seguridad

- Las contraseñas son gestionadas por Supabase (nunca se almacenan en texto plano)
- Las tablas tienen Row Level Security (RLS) activado
- Solo usuarios autenticados pueden crear, editar o eliminar contenido
- Los artículos publicados son visibles públicamente; los borradores no
