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
const APPOINTMENT_FIELDS = ['f-nombre', 'f-edad', 'f-tel', 'f-motivo'];

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
   MENÚ HAMBURGUESA
================================================================ */
function initHamburgerMenu() {
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggle || !navLinks) return;

  // Abrir / cerrar menú
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar al hacer clic en un enlace
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
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
   FORMULARIO DE CITA → WhatsApp
================================================================ */
const WA_NUMBER = '529996364504';

function initAppointmentForm() {
  const submitBtn = document.getElementById('btn-submit-appt');
  if (!submitBtn) return;
  submitBtn.addEventListener('click', handleAppointmentSubmit);
}

function handleAppointmentSubmit() {
  const nombre = document.getElementById('f-nombre')?.value.trim();
  const edad   = document.getElementById('f-edad')?.value.trim();
  const tel    = document.getElementById('f-tel')?.value.trim();
  const motivo = document.getElementById('f-motivo')?.value.trim();

  // Resaltar campos vacíos
  [['f-nombre', nombre], ['f-edad', edad], ['f-tel', tel], ['f-motivo', motivo]].forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.style.borderColor = !val ? '#ef4444' : '';
  });

  if (!nombre || !edad || !tel || !motivo) return;

  // Limpiar el teléfono y agregar código de país automáticamente
  // El paciente escribe solo su número local, ej: 9991234567 o 999 123 4567
  const telLimpio = tel.replace(/\D/g, ''); // quitar todo lo que no sea número
  const telConCodigo = telLimpio.startsWith('52') ? telLimpio : '52' + telLimpio;

  // Construir mensaje pre-llenado para WhatsApp
  const mensaje =
    'Hola Dr. Ancona, me gustaría agendar una consulta.\n\n' +
    '👤 Nombre: ' + nombre + '\n' +
    '🎂 Edad: ' + edad + ' años\n' +
    '📞 Teléfono: ' + tel + '\n' +
    '🩺 Motivo: ' + motivo;

  const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(mensaje);

  // Mostrar confirmación y abrir WhatsApp
  const successMsg = document.getElementById('success-msg');
  if (successMsg) {
    successMsg.hidden = false;
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  setTimeout(() => window.open(url, '_blank'), 800);

  // Limpiar formulario
  ['f-nombre', 'f-edad', 'f-tel', 'f-motivo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.style.borderColor = ''; }
  });
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
  initHamburgerMenu();
  initScrollReveal();
  initNavbarScroll();
  initAppointmentForm();
  initQAForm();
  initFabTest();
});

/* Oculta el botón flotante cuando el usuario está dentro del test */
function initFabTest() {
  const fab     = document.getElementById('fab-test');
  const section = document.getElementById('test-dolor');
  if (!fab || !section) return;

  const observer = new IntersectionObserver(
    ([entry]) => fab.classList.toggle('hide', entry.isIntersecting),
    { threshold: 0.15 }
  );
  observer.observe(section);
}

