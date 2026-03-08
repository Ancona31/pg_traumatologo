/**
 * main.js
 * Lógica general del sitio:
 *  - Scroll reveal (animaciones de entrada)
 *  - Efecto de sombra en la barra de navegación al hacer scroll
 *  - Formulario de cita
 *  - Formulario de preguntas (Q&A)
 *  - Fecha mínima en el campo de cita
 */

'use strict';

/* ================================================================
   CONSTANTES — IDs y selectores reutilizables
================================================================ */
const APPOINTMENT_FIELDS = ['f-nombre', 'f-apellido', 'f-tel', 'f-email', 'f-fecha', 'f-hora', 'f-servicio'];

/* ================================================================
   SCROLL REVEAL
   Observa todos los elementos con clase .js-animate y los anima
   cuando entran al viewport.
================================================================ */
function initScrollReveal() {
  const animatableElements = document.querySelectorAll('.js-animate');

  if (!animatableElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Una vez visible ya no necesitamos seguir observando
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatableElements.forEach((el) => observer.observe(el));
}


/* ================================================================
   SOMBRA EN NAVBAR AL HACER SCROLL
================================================================ */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });
}


/* ================================================================
   FORMULARIO DE CITA
================================================================ */
function initAppointmentForm() {
  const submitBtn = document.getElementById('btn-submit-appt');
  if (!submitBtn) return;

  // Establece la fecha mínima como hoy
  const dateInput = document.getElementById('f-fecha');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  submitBtn.addEventListener('click', handleAppointmentSubmit);
}

function handleAppointmentSubmit() {
  const allFilled = APPOINTMENT_FIELDS.every((id) => {
    const el = document.getElementById(id);
    return el && el.value.trim() !== '';
  });

  if (!allFilled) {
    alert('Por favor completa todos los campos requeridos para solicitar tu cita.');
    return;
  }

  // Mostrar mensaje de éxito
  const successMsg = document.getElementById('success-msg');
  if (successMsg) {
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Limpiar el formulario
  APPOINTMENT_FIELDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  const motivoField = document.getElementById('f-motivo');
  if (motivoField) motivoField.value = '';

  /* 
   * TODO: Aquí conectar con un backend o servicio de email.
   * Opciones recomendadas:
   *   - Formspree (https://formspree.io)
   *   - EmailJS  (https://emailjs.com)
   *   - Endpoint propio con Node.js / PHP
   */
}


/* ================================================================
   FORMULARIO DE PREGUNTAS (Q&A)
================================================================ */
function initQAForm() {
  const qaBtn = document.getElementById('btn-qa-submit');
  if (!qaBtn) return;

  qaBtn.addEventListener('click', handleQASubmit);
}

function handleQASubmit() {
  const nombreInput  = document.getElementById('qa-nombre');
  const preguntaInput = document.getElementById('qa-pregunta');
  const qaList       = document.getElementById('qa-list');

  if (!preguntaInput || !preguntaInput.value.trim()) {
    alert('Por favor escribe tu pregunta antes de enviar.');
    return;
  }

  const nombre   = nombreInput ? nombreInput.value.trim() : '';
  const pregunta = preguntaInput.value.trim();

  // Crear nuevo elemento de pregunta
  const item = document.createElement('div');
  item.className = 'qa-item';
  item.style.opacity = '0';
  item.style.transform = 'translateY(10px)';
  item.style.transition = 'all .4s ease';

  item.innerHTML = `
    <div class="qa-q">${escapeHtml(pregunta)}</div>
    <div class="qa-a">
      ✅ Tu pregunta ha sido recibida. El Dr. Ancona responderá a la brevedad.
      Puedes <a href="#citas" style="color:var(--color-bright);">agendar una consulta</a> para atención inmediata.
    </div>
    <div class="qa-author">— ${escapeHtml(nombre) || 'Anónimo'} | Pendiente de respuesta</div>
  `;

  qaList.prepend(item);

  // Animar entrada
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    });
  });

  // Limpiar campos
  if (nombreInput)   nombreInput.value = '';
  if (preguntaInput) preguntaInput.value = '';
}

/**
 * Escapa caracteres HTML para evitar XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}


/* ================================================================
   INICIALIZACIÓN
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbarScroll();
  initAppointmentForm();
  initQAForm();
});
