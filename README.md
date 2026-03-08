# Dr. Angel M. Ancona Pérez — Sitio Web Oficial

Sitio web profesional para el **Dr. Angel M. Ancona Pérez**, Cirujano de Columna Vertebral y Traumatólogo.

---

## 🗂 Estructura del Proyecto

```
dr-ancona/
├── index.html          ← Estructura HTML del sitio (secciones, contenido)
├── css/
│   └── styles.css      ← Todos los estilos del sitio
├── js/
│   ├── main.js         ← Lógica general (nav, formularios, animaciones)
│   └── pain-test.js    ← Lógica del Test de Dolor de Columna
├── assets/             ← Carpeta para imágenes, íconos, logo del doctor
├── .gitignore
└── README.md
```

---

## ✏️ Cómo Hacer Cambios Comunes

### Cambiar información de contacto
Abre `index.html` y busca los comentarios `<!-- TODO: Actualizar con... -->`.  
Los campos a actualizar son:
- Dirección del consultorio
- Teléfono / WhatsApp
- Correo electrónico
- Cédula profesional y número CMOT
- URL del botón flotante de WhatsApp (último `<a class="fab">`)

### Cambiar colores del sitio
Abre `css/styles.css` y modifica el bloque `:root` al inicio del archivo:

```css
:root {
  --color-vivid:  #1a7fe8;   /* Azul principal */
  --color-accent: #00c6ff;   /* Azul brillante (degradados) */
  --color-navy:   #0a1628;   /* Fondo oscuro */
  --color-gold:   #e8c96a;   /* Estrellas / detalles dorados */
  /* ... */
}
```

### Cambiar fuentes
En `index.html` modifica el `<link>` de Google Fonts.  
En `css/styles.css` actualiza las variables:

```css
--font-display: 'Playfair Display', serif;  /* Títulos */
--font-body:    'DM Sans', sans-serif;      /* Texto general */
```

### Agregar/quitar artículos del Blog
En `index.html` localiza la sección `<!-- BLOG & PREGUNTAS -->`.  
Cada artículo es un bloque `.blog-card`. Copia uno existente y edita su contenido.  
Para cambiar el color del encabezado usa estas clases en `.blog-card-header`:
- `blog-card-header--default`
- `blog-card-header--dark`
- `blog-card-header--teal`
- `blog-card-header--navy`

### Cambiar los servicios
En `index.html` localiza `<!-- SERVICIOS -->`.  
Cada servicio es un `.service-card`. Edita el ícono, nombre y descripción.

### Agregar credenciales del doctor
En `index.html` localiza `<ul class="about-list">` dentro de `<!-- SOBRE EL DOCTOR -->`.  
Agrega un nuevo `<li>` con el texto correspondiente.

### Modificar la lógica del Test de Dolor
Abre `js/pain-test.js`:
- Para cambiar los **textos de los resultados**: edita el objeto `RESULTS`.
- Para cambiar los **umbrales de urgencia**: edita el objeto `PAIN_THRESHOLDS`.
- Para agregar una **nueva pregunta**: agrega un bloque `.pt-step` en `index.html` y actualiza `TOTAL_STEPS` en `pain-test.js`.

---

## 🚀 Instalación Local

Este sitio es HTML/CSS/JS estático puro — **no requiere ningún servidor especial**.

```bash
# Opción A: Abrir directamente en el navegador
open index.html

# Opción B: Servidor local simple con Python
python3 -m http.server 3000
# Luego visita http://localhost:3000

# Opción C: Con Node.js (instalar live-server globalmente)
npx live-server
```

---

## 📦 Publicar en GitHub Pages (hosting gratuito)

1. Crea un repositorio en [github.com](https://github.com) (puede ser privado o público).
2. Sube el proyecto:

```bash
git init
git add .
git commit -m "primer commit: sitio web Dr. Ancona"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/dr-ancona.git
git push -u origin main
```

3. En GitHub → **Settings** → **Pages** → Source: `main` branch → `/root`.
4. El sitio estará disponible en `https://TU_USUARIO.github.io/dr-ancona/`.

---

## 🔗 Conectar un Formulario Real

Actualmente el formulario de citas muestra un mensaje de éxito visual sin enviar datos reales.

Para conectarlo a un correo electrónico:

### Opción 1 — Formspree (más fácil, gratuito)
1. Regístrate en [formspree.io](https://formspree.io).
2. Crea un formulario y obtén tu endpoint: `https://formspree.io/f/XXXXXXXX`.
3. En `js/main.js`, dentro de `handleAppointmentSubmit()`, reemplaza el bloque `TODO` con:

```js
const formData = {
  nombre:    document.getElementById('f-nombre').value,
  apellido:  document.getElementById('f-apellido').value,
  telefono:  document.getElementById('f-tel').value,
  email:     document.getElementById('f-email').value,
  fecha:     document.getElementById('f-fecha').value,
  hora:      document.getElementById('f-hora').value,
  servicio:  document.getElementById('f-servicio').value,
  motivo:    document.getElementById('f-motivo').value,
};

await fetch('https://formspree.io/f/XXXXXXXX', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

### Opción 2 — EmailJS (sin backend)
Consulta la documentación en [emailjs.com](https://www.emailjs.com).

---

## 🖼 Reemplazar el Avatar del Doctor

El avatar actual es un emoji (`👨‍⚕️`). Para usar una foto real:

1. Coloca la imagen en `assets/foto-doctor.jpg`.
2. En `index.html`, dentro de `.doctor-avatar`, reemplaza el emoji con:

```html
<img src="assets/foto-doctor.jpg" alt="Dr. Angel M. Ancona Pérez" />
```

3. En `css/styles.css`, ajusta el estilo de `.doctor-avatar`:

```css
.doctor-avatar {
  overflow: hidden;
}
.doctor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 📋 Lista de Pendientes (TODOs)

Busca `<!-- TODO:` en `index.html` para encontrar todos los datos que necesitan actualizarse:

- [ ] Dirección real del consultorio
- [ ] Teléfono / WhatsApp real
- [ ] Correo electrónico real
- [ ] Cédula Profesional y número CMOT reales
- [ ] Foto real del doctor
- [ ] Conectar formulario de citas a un servicio de email

---

## 🛠 Tecnologías Usadas

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura del sitio |
| CSS3 (variables, grid, flexbox) | Diseño y animaciones |
| JavaScript ES6+ (vanilla) | Interactividad |
| Google Fonts | Tipografías |

Sin frameworks, sin dependencias externas. El sitio carga rápido y es fácil de mantener.

---

## 📄 Licencia

Todos los derechos reservados © 2025 Dr. Angel M. Ancona Pérez.  
Desarrollo web: uso exclusivo del cliente.
