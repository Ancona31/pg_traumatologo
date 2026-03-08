/**
 * pain-test.js
 * Lógica del Test de Dolor de Columna.
 *
 * Funcionamiento:
 *  1. El usuario responde 6 preguntas (pasos).
 *  2. Las respuestas se acumulan en `answers`.
 *  3. Al terminar, `calcResult()` evalúa las respuestas
 *     y devuelve una de 4 categorías de atención.
 *  4. Se muestra la tarjeta de resultado con la recomendación.
 *
 * Para añadir o modificar preguntas:
 *  - En index.html: duplica o edita un bloque .pt-step
 *  - Aquí: actualiza TOTAL_STEPS y la lógica de calcResult()
 */

'use strict';

/* ================================================================
   CONFIGURACIÓN
================================================================ */

/** Número total de pasos del test. Actualizar si se añaden preguntas. */
const TOTAL_STEPS = 6;

/**
 * Definición de los 4 tipos de resultado posibles.
 * Para cambiar los textos que ve el paciente, edita este objeto.
 *
 * @type {Object.<string, {icon: string, level: string, title: string, desc: string}>}
 */
const RESULTS = {
  urgente: {
    icon:  '🚨',
    level: 'ATENCIÓN URGENTE',
    title: 'Acude a urgencias de inmediato',
    desc:  'La pérdida de control de esfínteres puede indicar compresión grave de la médula espinal (síndrome de cauda equina). Es una emergencia quirúrgica. Dirígete a urgencias o llama al Dr. Ancona ahora mismo.',
  },
  urgente_neurologico: {
    icon:  '⚠️',
    level: 'VALORACIÓN URGENTE',
    title: 'Requieres atención especializada pronto',
    desc:  'El entumecimiento o debilidad intensa combinado con dolor severo puede indicar compresión nerviosa activa. Te recomendamos consulta con el Dr. Ancona en los próximos 1–3 días para resonancia magnética y valoración neurológica.',
  },
  urgente_trauma: {
    icon:  '🦴',
    level: 'EVALUACIÓN PRIORITARIA',
    title: 'Posible fractura o lesión traumática',
    desc:  'Un golpe o caída con dolor intenso debe descartarse con estudios de imagen (radiografía o TAC) lo antes posible. Evita movimientos bruscos y acude a valoración urgente para descartar fractura vertebral.',
  },
  especialista: {
    icon:  '🩺',
    level: 'CONSULTA CON ESPECIALISTA',
    title: 'Necesitas una valoración especializada',
    desc:  'Tus síntomas sugieren una patología de columna que requiere evaluación por un cirujano especialista. Una resonancia magnética y una consulta con el Dr. Ancona permitirán identificar la causa exacta y ofrecerte el tratamiento más adecuado.',
  },
  segunda_opinion: {
    icon:  '🔍',
    level: 'SEGUNDA EVALUACIÓN',
    title: 'Tu dolor persiste a pesar del tratamiento',
    desc:  'Si la fisioterapia no ha resuelto tu dolor, es momento de una valoración más profunda con estudios de imagen. El Dr. Ancona revisará si existe una causa estructural que requiera un enfoque diferente o tratamiento quirúrgico mínimamente invasivo.',
  },
  conservador: {
    icon:  '💊',
    level: 'MANEJO CONSERVADOR',
    title: 'Tu dolor puede mejorar con tratamiento conservador',
    desc:  'Muchos casos como el tuyo responden bien a reposo relativo, analgésicos y fisioterapia. Sin embargo, es importante una consulta médica para confirmar el diagnóstico y descartar causas estructurales.',
  },
  preventivo: {
    icon:  '✅',
    level: 'PREVENCIÓN Y SEGUIMIENTO',
    title: 'Tu dolor parece leve y manejable',
    desc:  'Tus respuestas sugieren un cuadro de dolor leve que puede mejorar con ejercicio, buena postura y ergonomía. Una consulta preventiva te ayudará a orientarte y evitar que el problema progrese.',
  },
};

/**
 * Umbrales de intensidad del dolor.
 * Ajusta estos valores para cambiar el criterio de urgencia.
 */
const PAIN_THRESHOLDS = {
  urgente:    7,   // >= 7 con síntomas neurológicos → urgente
  traumatico: 6,   // >= 6 con trauma → evaluación prioritaria
  conservador: 5,  // <= 5 → posiblemente manejable
};

/* ================================================================
   ESTADO DEL TEST
   El estado es local al módulo y se reinicia con restartTest().
================================================================ */

/** Almacena las respuestas del paciente. Clave: nombre del campo, valor: respuesta. */
let answers = {};

/** Número del paso actualmente visible (1 a TOTAL_STEPS). */
let currentStep = 1;


/* ================================================================
   FUNCIONES PRINCIPALES
================================================================ */

/**
 * Registra la selección de una opción de tipo card.
 * Lee los atributos data-key y data-val del elemento clickeado.
 *
 * @param {HTMLElement} selectedEl - Elemento .pt-option clickeado.
 */
function handleOptionSelect(selectedEl) {
  const key = selectedEl.dataset.key;
  const val = selectedEl.dataset.val;

  if (!key || !val) return;

  // Desmarcar todas las opciones del mismo grupo
  selectedEl.closest('.pt-options')
    .querySelectorAll('.pt-option')
    .forEach((opt) => opt.classList.remove('selected'));

  // Marcar la opción elegida
  selectedEl.classList.add('selected');

  // Guardar respuesta
  answers[key] = val;

  // Habilitar botón "Siguiente" de este paso
  enableNextButton(currentStep);
}

/**
 * Registra la selección en la escala numérica de dolor (1–10).
 * Aplica clases de color según la intensidad seleccionada.
 *
 * @param {number} value - Valor seleccionado (1–10).
 */
function handleScaleSelect(value) {
  answers.intensidad = value;

  // Actualizar estilo visual de los botones de escala
  document.querySelectorAll('.pt-scale-btn').forEach((btn) => {
    const btnValue = parseInt(btn.dataset.value, 10);
    btn.className = 'pt-scale-btn'; // Reset

    if (btnValue <= value) {
      btn.classList.add(getPainClass(btnValue));
    }
  });

  enableNextButton(currentStep);
}

/**
 * Devuelve la clase CSS de color según el nivel de intensidad de dolor.
 *
 * @param {number} value
 * @returns {string}
 */
function getPainClass(value) {
  if (value <= 3) return 'sel-low';
  if (value <= 6) return 'sel-mid';
  if (value <= 8) return 'sel-high';
  return 'sel-severe';
}

/**
 * Avanza al siguiente paso del test.
 *
 * @param {number} step - Paso actual (se moverá al paso step + 1).
 */
function goToNextStep(step) {
  hideStep(step);
  showStep(step + 1);
  currentStep = step + 1;
  updateProgressBar(currentStep);
  scrollToSection();
}

/**
 * Retrocede al paso anterior.
 *
 * @param {number} step - Paso actual (se moverá al paso step - 1).
 */
function goToPrevStep(step) {
  hideStep(step);
  showStep(step - 1);
  currentStep = step - 1;
  updateProgressBar(currentStep);
  scrollToSection();
}

/**
 * Evalúa las respuestas acumuladas y devuelve el resultado correspondiente.
 * Orden de prioridad: urgencias → especialista → conservador → preventivo.
 *
 * @returns {{ type: string, icon: string, level: string, title: string, desc: string }}
 */
function calcResult() {
  const { sintomas, intensidad, duracion, tratamiento, causa } = answers;

  // 1. Emergencia: pérdida de esfínteres
  if (sintomas === 'sfinteres') {
    return { type: 'urgente', ...RESULTS.urgente };
  }

  // 2. Urgente: déficit neurológico + dolor severo
  if (sintomas === 'neurologico' && intensidad >= PAIN_THRESHOLDS.urgente) {
    return { type: 'urgente', ...RESULTS.urgente_neurologico };
  }

  // 3. Evaluación prioritaria: trauma con dolor intenso
  if (causa === 'trauma' && intensidad >= PAIN_THRESHOLDS.traumatico) {
    return { type: 'urgente', ...RESULTS.urgente_trauma };
  }

  // 4. Requiere especialista: dolor irradiado, crónico o cirugía previa
  if (sintomas === 'irradiado' || duracion === 'meses' || duracion === 'anos' || tratamiento === 'cirugia_previa') {
    return { type: 'especialista', ...RESULTS.especialista };
  }

  // 5. Segunda evaluación: fisioterapia sin resultado
  if (tratamiento === 'fisio' && intensidad <= 6) {
    return { type: 'especialista', ...RESULTS.segunda_opinion };
  }

  // 6. Manejo conservador: dolor leve/reciente sin tratamiento previo
  if (intensidad <= PAIN_THRESHOLDS.conservador && (duracion === 'dias' || duracion === 'semanas')) {
    return { type: 'consulta', ...RESULTS.conservador };
  }

  // 7. Preventivo / leve por defecto
  return { type: 'preventivo', ...RESULTS.preventivo };
}

/**
 * Calcula el resultado, actualiza el DOM y muestra la tarjeta final.
 */
function showResult() {
  // Asegurar que la última pregunta haya sido respondida
  if (!answers.tratamiento) return;

  hideStep(TOTAL_STEPS);
  updateProgressBar(TOTAL_STEPS + 1); // 100%

  const result = calcResult();
  renderResultCard(result);

  const resultContainer = document.getElementById('pt-result');
  if (resultContainer) {
    resultContainer.hidden = false;
  }

  scrollToSection();
}

/**
 * Reinicia el test a su estado inicial.
 */
function restartTest() {
  // Limpiar estado
  answers = {};
  currentStep = 1;

  // Limpiar selecciones visuales
  document.querySelectorAll('.pt-option').forEach((opt) => opt.classList.remove('selected'));
  document.querySelectorAll('.pt-scale-btn').forEach((btn) => { btn.className = 'pt-scale-btn'; });

  // Resetear botones "Siguiente" (excepto el último que siempre está habilitado en step-6)
  document.querySelectorAll('.pt-btn-next:not(#next-6)').forEach((btn) => {
    btn.classList.remove('is-enabled');
  });

  // Ocultar resultado
  const resultContainer = document.getElementById('pt-result');
  if (resultContainer) resultContainer.hidden = true;

  // Mostrar primer paso
  document.querySelectorAll('.pt-step').forEach((s) => s.classList.remove('active'));
  showStep(1);
  updateProgressBar(1);

  scrollToSection();
}


/* ================================================================
   FUNCIONES DE UI (DOM helpers)
================================================================ */

/**
 * Muestra el paso indicado.
 * @param {number} step
 */
function showStep(step) {
  const el = document.getElementById(`step-${step}`);
  if (el) el.classList.add('active');
}

/**
 * Oculta el paso indicado.
 * @param {number} step
 */
function hideStep(step) {
  const el = document.getElementById(`step-${step}`);
  if (el) el.classList.remove('active');
}

/**
 * Habilita el botón "Siguiente" de un paso determinado.
 * @param {number} step
 */
function enableNextButton(step) {
  const btn = document.getElementById(`next-${step}`);
  if (btn) btn.classList.add('is-enabled');
}

/**
 * Actualiza el ancho de la barra de progreso.
 * @param {number} step - Paso actual (1 a TOTAL_STEPS + 1).
 */
function updateProgressBar(step) {
  const fill = document.getElementById('pt-progress');
  if (!fill) return;

  const percent = Math.min(((step - 1) / TOTAL_STEPS) * 100, 100);
  fill.style.width = `${percent}%`;
}

/**
 * Rellena y muestra la tarjeta de resultado con los datos calculados.
 * @param {{ type: string, icon: string, level: string, title: string, desc: string }} result
 */
function renderResultCard(result) {
  const card = document.getElementById('result-card');
  if (!card) return;

  card.className = `pt-result-card ${result.type}`;
  setTextContent('result-icon',  result.icon);
  setTextContent('result-level', result.level);
  setTextContent('result-title', result.title);
  setTextContent('result-desc',  result.desc);
}

/**
 * Actualiza el texto de un elemento por su ID.
 * @param {string} id
 * @param {string} text
 */
function setTextContent(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * Hace scroll suave hasta la sección del test.
 */
function scrollToSection() {
  const section = document.getElementById('test-dolor');
  if (!section) return;

  const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
  window.scrollTo({
    top: section.offsetTop - navHeight,
    behavior: 'smooth',
  });
}


/* ================================================================
   INICIALIZACIÓN — Delegación de eventos
   Usamos delegación en lugar de onclick="" inline para separar
   el HTML del JS y facilitar el mantenimiento.
================================================================ */

function initPainTest() {
  const section = document.getElementById('test-dolor');
  if (!section) return;

  // Un solo listener para todo el test (delegación de eventos)
  section.addEventListener('click', (event) => {
    const target = event.target;

    // Clic en una opción de tarjeta
    const option = target.closest('.pt-option');
    if (option) {
      handleOptionSelect(option);
      return;
    }

    // Clic en un botón de escala numérica
    if (target.classList.contains('pt-scale-btn')) {
      const value = parseInt(target.dataset.value, 10);
      if (!isNaN(value)) {
        handleScaleSelect(value);
      }
      return;
    }

    // Clic en "Siguiente"
    if (target.classList.contains('pt-btn-next') || target.closest('.pt-btn-next')) {
      const btn = target.closest('.pt-btn-next') || target;

      // Verificar que esté habilitado
      if (!btn.classList.contains('is-enabled') && !btn.classList.contains('pt-btn-next--enabled')) return;

      // Paso final: mostrar resultado
      if (btn.dataset.action === 'result') {
        showResult();
        return;
      }

      const stepNum = parseInt(btn.dataset.current, 10);
      if (!isNaN(stepNum)) {
        goToNextStep(stepNum);
      }
      return;
    }

    // Clic en "Anterior"
    if (target.classList.contains('pt-btn-back') || target.closest('.pt-btn-back')) {
      const btn = target.closest('.pt-btn-back') || target;
      const stepNum = parseInt(btn.dataset.prev, 10);
      if (!isNaN(stepNum)) {
        goToPrevStep(stepNum);
      }
      return;
    }

    // Clic en "Repetir test"
    if (target.id === 'btn-restart' || target.closest('#btn-restart')) {
      restartTest();
    }
  });
}

document.addEventListener('DOMContentLoaded', initPainTest);
