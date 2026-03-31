'use strict';

/* ================================================================
   CONFIGURACIÓN
================================================================ */
const TOTAL_STEPS = 6;
const PAIN_THRESHOLDS = { urgente: 7, traumatico: 6, conservador: 5 };

/* ================================================================
   SUPABASE
================================================================ */
const _SUPA_URL = 'https://ithwmacwyexinxjtnbcg.supabase.co';
const _SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aHdtYWN3eWV4aW54anRuYmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTYyNTYsImV4cCI6MjA4ODU5MjI1Nn0.WbG3MkP7xvI64V5Ip_GEBkKpVIMs-D8e7fOGB8eePfE';
let _db = null;

/* ================================================================
   RESULTADOS
================================================================ */
const RESULTS = {
  urgente_esfinteres: {
    type: 'urgente', icon: '🚨', color: '#ef4444',
    level: 'EMERGENCIA MÉDICA',
    title: 'Dirígete a urgencias hospitalarias de inmediato',
    desc: 'La pérdida de control para orinar o defecar combinada con dolor en la columna puede indicar una compresión grave de la médula espinal. Este tipo de emergencia debe atenderse en urgencias hospitalarias — no esperes a una cita. Cada hora cuenta para evitar daño permanente.',
    steps: [
      'Acude a urgencias hospitalarias o llama al 911 de inmediato',
      'Una vez estabilizado, el Dr. Ancona puede brindar seguimiento especializado',
      'Evaluación quirúrgica y resonancia magnética de urgencia según evolución',
    ],
    cta: '🚨 Llamar al 911 — o ir a urgencias',
  },
  urgente_neurologico: {
    type: 'urgente', icon: '⚠️', color: '#f97316',
    level: 'ATENCIÓN URGENTE',
    title: 'Tu nervio puede estar comprimido — busca atención en las próximas 24-48 horas',
    desc: 'El entumecimiento, la debilidad o el dolor que se irradia con esa intensidad no son normales ni deben ignorarse. No es una emergencia de sala de urgencias, pero sí requiere atención especializada a la brevedad — cuanto antes se evalúe, mayores son las posibilidades de recuperación completa.',
    steps: [
      'Consulta con el Dr. Ancona en las próximas 24-48 horas con resonancia magnética',
      'Identificar exactamente qué nervio está comprimido y por qué',
      'Plan de tratamiento: desde infiltraciones hasta cirugía mínimamente invasiva según el caso',
    ],
    cta: '📅 Agendar consulta a la brevedad',
  },
  urgente_trauma: {
    type: 'urgente', icon: '🦴', color: '#f59e0b',
    level: 'EVALUACIÓN PRIORITARIA',
    title: 'Un golpe o caída con este dolor necesita descartarse en las próximas 24 horas',
    desc: 'No todo golpe en la espalda es una fractura, pero tampoco puedes saberlo sin estudios de imagen. Moverse sin el diagnóstico correcto puede empeorar una lesión que de otro modo sería tratable.',
    steps: [
      'Radiografía o TAC para descartar fractura vertebral',
      'Si hay fractura: el Dr. Ancona te explicará las opciones de tratamiento según el tipo y gravedad',
      'Si no hay fractura: plan de manejo del dolor y recuperación segura',
    ],
    cta: '📅 Solicitar evaluación urgente',
  },
  cirugia_fallida: {
    type: 'especialista', icon: '🔩', color: '#8b5cf6',
    level: 'REVISIÓN POST-QUIRÚRGICA',
    title: 'El dolor después de una cirugía tiene solución — agenda tu revisión esta semana',
    desc: 'Que hayas sido operado antes y sigas con dolor no significa que no haya salida. Hay causas específicas y tratables: cicatriz epidural, nueva hernia, falla del implante o inestabilidad. El Dr. Ancona se especializa en revisar estos casos — mientras antes se evalúe, más opciones hay.',
    steps: [
      'Revisión completa del historial quirúrgico y estudios previos',
      'Resonancia magnética para identificar la causa exacta del dolor residual',
      'Opciones desde manejo conservador hasta revisión quirúrgica mínimamente invasiva',
    ],
    cta: '📅 Agendar revisión especializada',
  },
  especialista_cronico: {
    type: 'especialista', icon: '🩺', color: '#3b82f6',
    level: 'CONSULTA ESPECIALIZADA',
    title: 'Llevas demasiado tiempo aguantando — agenda en los próximos días',
    desc: 'Vivir con dolor crónico de columna no es algo que tengas que aceptar. Después de 6 meses, el cuerpo ya no puede resolver esto solo. Hay una causa estructural que puede identificarse y tratarse — cuanto antes se evalúe, más fácil es el camino de regreso.',
    steps: [
      'Estudio de imagen completo para encontrar la causa raíz',
      'Evaluación de opciones: desde infiltraciones y fisioterapia dirigida hasta cirugía si es necesario',
      'Plan de manejo personalizado con objetivo claro: reducir o eliminar el dolor',
    ],
    cta: '📅 Poner fin a mi dolor crónico',
  },
  segunda_opinion: {
    type: 'especialista', icon: '🔍', color: '#06b6d4',
    level: 'SEGUNDA EVALUACIÓN',
    title: 'Si lo que haces no funciona, hay otro camino — consúltalo esta semana',
    desc: 'Que la fisioterapia o los medicamentos no hayan resuelto tu dolor no significa que no tengas solución — significa que puede haber una causa que no se ha identificado todavía. Una segunda opinión con un especialista puede cambiar completamente el enfoque.',
    steps: [
      'Revisión sin sesgos de tu historial y estudios previos',
      'Identificar si existe una causa estructural que requiera un tratamiento diferente',
      'Si aplica: el Dr. Ancona te presentará las opciones de tratamiento disponibles para tu caso',
    ],
    cta: '📅 Obtener segunda opinión con el Dr. Ancona',
  },
  especialista_irradiado: {
    type: 'especialista', icon: '⚡', color: '#1a7fe8',
    level: 'CONSULTA CON ESPECIALISTA',
    title: 'El dolor que baja por tu pierna o brazo tiene nombre — evalúalo en los próximos días',
    desc: 'Ese dolor que se irradia es una señal de que un nervio está siendo presionado. No desaparece solo con descanso ni con analgésicos porque el problema no es el músculo — es la estructura que lo comprime. Entre más tiempo pasa sin atención, mayor el riesgo de daño permanente.',
    steps: [
      'Resonancia magnética para confirmar el nivel y el nervio afectado',
      'Opciones de tratamiento desde las más conservadoras hasta las más resolutivas, según tu caso',
      'Si se requiere intervención: el Dr. Ancona te explicará el procedimiento más adecuado en consulta',
    ],
    cta: '📅 Evaluar mi dolor irradiado',
  },
  desgaste_articular: {
    type: 'especialista', icon: '🦴', color: '#a78bfa',
    level: 'EVALUACIÓN RECOMENDADA',
    title: 'Un dolor local que persiste semanas o meses merece una evaluación — no solo pastillas',
    desc: 'Cuando el dolor de columna es local, no se irradia y aparece sin una causa traumática clara, frecuentemente está relacionado con cambios degenerativos o articulares — desgaste propio de la columna con el paso del tiempo o el uso. No es una emergencia, pero tampoco desaparece solo sin el manejo adecuado.',
    steps: [
      'Estudio de imagen para evaluar el estado de las articulaciones y discos vertebrales',
      'Identificar el grado de desgaste y si es la causa real de tu dolor',
      'Plan de manejo orientado a reducir el dolor y frenar la progresión',
    ],
    cta: '📅 Evaluar mi dolor con el Dr. Ancona',
  },
  conservador: {
    type: 'conservador', icon: '💊', color: '#22c55e',
    level: 'ATENCIÓN RECOMENDADA',
    title: 'Tu dolor puede mejorar — conviene evaluarlo pronto para no llegar a más',
    desc: 'La buena noticia es que tu caso no parece urgente. La importante: sin un diagnóstico correcto, lo que ahora es manejable puede volverse crónico. Muchos pacientes que esperan demasiado llegan con un problema que pudo resolverse fácilmente antes.',
    steps: [
      'Consulta para confirmar el diagnóstico y descartar causas estructurales',
      'Plan de tratamiento conservador: fisioterapia dirigida, manejo del dolor y ejercicio específico',
      'Seguimiento para asegurarnos de que mejora y no progresa',
    ],
    cta: '📅 Confirmar diagnóstico con el Dr. Ancona',
  },
  preventivo: {
    type: 'preventivo', icon: '✅', color: '#10b981',
    level: 'CONSULTA PREVENTIVA',
    title: 'Por ahora es leve — mantenerlo así depende de lo que hagas en las próximas semanas',
    desc: 'Tu dolor actual parece manejable, y eso es una ventaja real. Los problemas de columna que se atienden temprano se resuelven con opciones simples. Los mismos problemas ignorados durante meses terminan requiriendo tratamientos más complejos.',
    steps: [
      'Evaluación para identificar hábitos o factores de riesgo que puedan empeorar tu columna',
      'Recomendaciones específicas de ejercicio y ergonomía para tu caso',
      'Tranquilidad de saber que alguien revisó que todo está bien',
    ],
    cta: '📅 Consulta preventiva con el Dr. Ancona',
  },
};

/* ================================================================
   ETIQUETAS PARA EL RESUMEN
================================================================ */
const LABELS = {
  zona:        { cervical:'Cuello (Cervical)', dorsal:'Espalda media (Dorsal)', lumbar:'Espalda baja (Lumbar)', multiple:'Varias zonas' },
  duracion:    { dias:'Menos de 1 semana', semanas:'1 a 6 semanas', meses:'1 a 6 meses', anos:'Más de 6 meses' },
  sintomas:    { sfinteres:'Dificultad para orinar/defecar', neurologico:'Entumecimiento o debilidad', irradiado:'Dolor que baja por pierna/brazo', solo_dolor:'Solo dolor local' },
  limitacion:  { normal:'Hago todo con algo de molestia', evita:'Evito ciertas actividades', trabajo_sueno:'No puedo trabajar o dormir bien', inmovil:'Prácticamente inmovilizado' },
  tratamiento: { ninguno:'Ninguno todavía', medicamento:'Solo medicamentos', fisio:'Fisioterapia / rehabilitación', cirugia_previa:'Cirugía de columna previa' },
};
const Q_LABELS = {
  zona:'📍 Zona de dolor', intensidad:'🔢 Intensidad del dolor',
  duracion:'⏱️ Duración', sintomas:'🩺 Síntomas',
  limitacion:'🏃 Limitación funcional', tratamiento:'💉 Tratamiento previo',
};

/* ================================================================
   ESTADO
================================================================ */
let answers = {}, currentStep = 0;
let patientName = '', patientPhone = '', patientConsent = true;
let _radarChart = null;

/* ================================================================
   LÓGICA DE RESULTADOS
================================================================ */
function calcResult() {
  const { sintomas, intensidad, duracion, tratamiento, limitacion } = answers;
  if (sintomas === 'sfinteres')                                                                                    return RESULTS.urgente_esfinteres;
  if (sintomas === 'neurologico' && intensidad >= PAIN_THRESHOLDS.urgente)                                        return RESULTS.urgente_neurologico;
  if (limitacion === 'inmovil' && intensidad >= PAIN_THRESHOLDS.traumatico && (duracion === 'dias' || duracion === 'semanas')) return RESULTS.urgente_trauma;
  if (tratamiento === 'cirugia_previa')                                                                           return RESULTS.cirugia_fallida;
  if (duracion === 'anos')                                                                                        return RESULTS.especialista_cronico;
  if (tratamiento === 'fisio')                                                                                    return RESULTS.segunda_opinion;
  if (sintomas === 'irradiado')                                                                                   return RESULTS.especialista_irradiado;
  if (sintomas === 'solo_dolor' && duracion === 'meses')                                                          return RESULTS.desgaste_articular;
  if (intensidad <= PAIN_THRESHOLDS.conservador && (duracion === 'dias' || duracion === 'semanas'))               return RESULTS.conservador;
  return RESULTS.preventivo;
}

/* ================================================================
   RESUMEN DE RESPUESTAS
================================================================ */
function renderSummary() {
  const grid = document.getElementById('pt-summary-grid');
  if (!grid) return;
  const items = [
    { key:'zona',        val: LABELS.zona[answers.zona] },
    { key:'intensidad',  val: answers.intensidad ? `${answers.intensidad} / 10` : null },
    { key:'duracion',    val: LABELS.duracion[answers.duracion] },
    { key:'sintomas',    val: LABELS.sintomas[answers.sintomas] },
    { key:'limitacion',  val: LABELS.limitacion[answers.limitacion] },
    { key:'tratamiento', val: LABELS.tratamiento[answers.tratamiento] },
  ];
  grid.innerHTML = items.map(i => `
    <div class="pt-summary-item">
      <div class="pt-summary-q">${Q_LABELS[i.key]}</div>
      <div class="pt-summary-a">${i.val || '—'}</div>
    </div>`).join('');
}

/* ================================================================
   MOSTRAR RESULTADO
================================================================ */
async function showResult() {
  if (!answers.tratamiento || !answers.limitacion) return;
  hideStep(TOTAL_STEPS);
  await showAnalyzing('Generando tu Reporte de Riesgo', 1600);
  updateProgressBar(TOTAL_STEPS + 1);
  updateProgressLabel(TOTAL_STEPS + 1);

  const result = calcResult();
  renderResultCard(result);
  renderSummary();
  setupShare(result);
  saveLead(result);

  const container = document.getElementById('pt-result');
  if (container) container.hidden = false;
  scrollToSection();

  // Visualizaciones
  renderRadarChart(result);
  updateSpineAnatomySVG(result);

  // Descarga automática — esperar a que el DOM pinte el resultado
  setTimeout(() => generatePDF(), 600);
}

function renderResultCard(result) {
  const card = document.getElementById('result-card');
  if (!card) return;
  card.style.setProperty('--result-color', result.color);
  card.dataset.type = result.type;
  setText('result-icon',  result.icon);
  setText('result-level', result.level);
  setText('result-title', result.title);
  setText('result-desc',  result.desc);

  // Renderizar pasos
  const stepsEl = document.getElementById('result-steps');
  if (stepsEl && result.steps) {
    stepsEl.innerHTML = `
      <div class="pt-steps-label">Lo que el Dr. Ancona puede hacer por ti:</div>
      <ul class="pt-steps-list">
        ${result.steps.map(s => `<li>${s}</li>`).join('')}
      </ul>`;
  }

  // CTA personalizado
  const ctaBtn = document.getElementById('result-cta-btn');
  if (ctaBtn) ctaBtn.textContent = result.cta;

  // Color del nivel
  const lvl = document.getElementById('result-level');
  if (lvl) lvl.style.color = result.color;
}

/* ================================================================
   NAVEGACIÓN
================================================================ */
async function goToNextStep(step) {
  hideStep(step);
  await showAnalyzing();
  showStep(step + 1);
  currentStep = step + 1;
  updateProgressBar(currentStep);
  updateProgressLabel(currentStep);
  scrollToSection();
}
function goToPrevStep(step) {
  hideStep(step); showStep(step - 1);
  currentStep = step - 1;
  updateProgressBar(currentStep);
  updateProgressLabel(currentStep);
}

/* ================================================================
   SELECCIÓN DE OPCIONES
================================================================ */
function handleOptionSelect(el) {
  const key = el.dataset.key, val = el.dataset.val;
  if (!key || !val) return;
  el.closest('.pt-options').querySelectorAll('.pt-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  answers[key] = val;
  enableNextButton(currentStep);
}

function handleScaleSelect(value) {
  answers.intensidad = value;
  document.querySelectorAll('.pt-scale-btn').forEach(btn => {
    const v = parseInt(btn.dataset.value, 10);
    btn.className = 'pt-scale-btn';
    if (v <= value) btn.classList.add(getPainClass(v));
    if (v === value) btn.classList.add('active');
  });
  const label = document.getElementById('scale-selected-label');
  if (label) {
    const desc = ['','Dolor casi imperceptible','Dolor muy leve','Dolor leve','Dolor moderado-leve','Dolor moderado','Dolor moderado-alto','Dolor intenso','Dolor muy intenso','Dolor casi insoportable','Dolor máximo insoportable'];
    label.textContent = `Nivel ${value} — ${desc[value]}`;
    label.style.display = 'block';
  }
  enableNextButton(currentStep);
}

function getPainClass(v) {
  if (v <= 3) return 'sel-low';
  if (v <= 6) return 'sel-mid';
  if (v <= 8) return 'sel-high';
  return 'sel-severe';
}

/* ================================================================
   REINICIAR
================================================================ */
function restartTest() {
  answers = {}; currentStep = 0;
  patientName = ''; patientPhone = '';
  if (_radarChart) { _radarChart.destroy(); _radarChart = null; }
  const nameEl = document.getElementById('pt-patient-name');
  const phoneEl = document.getElementById('pt-patient-phone');
  if (nameEl) nameEl.value = '';
  if (phoneEl) phoneEl.value = '';
  document.querySelectorAll('.pt-option').forEach(o => o.classList.remove('selected'));
  document.querySelectorAll('.pt-scale-btn').forEach(b => { b.className = 'pt-scale-btn'; });
  const lbl = document.getElementById('scale-selected-label');
  if (lbl) { lbl.textContent = ''; lbl.style.display = 'none'; }
  document.querySelectorAll('.pt-btn-next:not(#next-6)').forEach(b => b.classList.remove('is-enabled'));
  const res = document.getElementById('pt-result');
  if (res) res.hidden = true;
  document.querySelectorAll('.pt-step').forEach(s => s.classList.remove('active'));
  showProgressHeader(false);
  showStep(0); updateProgressBar(1); updateProgressLabel(1);
  scrollToSection();
}

/* ================================================================
   DOM HELPERS
================================================================ */
function showStep(step)           { document.getElementById(`step-${step}`)?.classList.add('active'); }
function hideStep(step)           { document.getElementById(`step-${step}`)?.classList.remove('active'); }
function enableNextButton(step)   { document.getElementById(`next-${step}`)?.classList.add('is-enabled'); }
function setText(id, text)        { const el = document.getElementById(id); if (el) el.textContent = text; }
function showProgressHeader(show) {
  const h = document.querySelector('.pt-progress-header');
  if (h) h.style.display = show ? '' : 'none';
}

function updateProgressBar(step) {
  const fill = document.getElementById('pt-progress');
  if (fill) fill.style.width = `${Math.min(((step-1)/TOTAL_STEPS)*100, 100)}%`;
}
function updateProgressLabel(step) {
  const lbl = document.getElementById('pt-progress-label');
  if (!lbl) return;
  lbl.textContent = step > TOTAL_STEPS ? '✅ Reporte listo' : `Dato clínico ${step} de ${TOTAL_STEPS}`;
}

/* ================================================================
   OVERLAY: ANALIZANDO SÍNTOMAS
================================================================ */
function showAnalyzing(msg = 'Analizando síntomas', duration = 1200) {
  const overlay  = document.getElementById('pt-analyzing');
  const textEl   = document.getElementById('pt-analyzing-text');
  const bar      = document.getElementById('pt-analyzing-bar');
  const lbl      = document.getElementById('pt-progress-label');
  if (!overlay) return Promise.resolve();

  // Actualizar mensaje
  if (textEl) textEl.innerHTML = `${msg}<span class="pt-analyzing-dots"></span>`;
  if (lbl) lbl.textContent = 'Analizando síntomas...';

  overlay.style.display = 'flex';

  // Reiniciar y disparar la barra
  if (bar) {
    bar.style.transition = 'none';
    bar.style.width = '0';
    void bar.offsetWidth; // forzar reflow
    bar.style.transition = `width ${duration * 0.9}ms ease-in-out`;
    bar.style.width = '100%';
  }

  return new Promise(resolve => setTimeout(() => {
    overlay.style.display = 'none';
    resolve();
  }, duration));
}
function scrollToSection() {
  const s = document.getElementById('test-dolor');
  if (!s) return;
  const nav = document.getElementById('navbar')?.offsetHeight || 80;
  window.scrollTo({ top: s.offsetTop - nav, behavior: 'smooth' });
}

/* ================================================================
   PDF — POBLAR LAYOUT
================================================================ */
function populatePDF(result) {
  // Fecha y nombre del paciente
  const dateEl = document.getElementById('pdf-date');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' });
  }
  const patientEl = document.getElementById('pdf-patient-name');
  if (patientEl) patientEl.textContent = patientName ? `Paciente: ${patientName}` : '';

  // Resultado
  const setText2 = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  setText2('pdf-level', result.level);
  setText2('pdf-title', result.title);
  setText2('pdf-desc',  result.desc);

  // Pasos
  const stepsEl = document.getElementById('pdf-steps');
  if (stepsEl && result.steps) {
    stepsEl.innerHTML = `
      <div class="pdf-steps-label">Lo que el Dr. Ancona puede hacer por ti:</div>
      <ul class="pdf-steps-list">
        ${result.steps.map(s => `<li>${s}</li>`).join('')}
      </ul>`;
  }

  // Resumen de respuestas
  const summaryEl = document.getElementById('pdf-summary-items');
  if (summaryEl) {
    const items = [
      { q:'📍 Zona de dolor',      a: LABELS.zona[answers.zona] },
      { q:'🔢 Intensidad',         a: answers.intensidad ? `${answers.intensidad} / 10` : '—' },
      { q:'⏱️ Duración',           a: LABELS.duracion[answers.duracion] },
      { q:'🩺 Síntomas',           a: LABELS.sintomas[answers.sintomas] },
      { q:'🏃 Limitación funcional',  a: LABELS.limitacion[answers.limitacion] },
      { q:'💉 Tratamiento previo', a: LABELS.tratamiento[answers.tratamiento] },
    ];
    summaryEl.innerHTML = items.map(i => `
      <div class="pdf-summary-item">
        <div class="pdf-summary-q">${i.q}</div>
        <div class="pdf-summary-a">${i.a || '—'}</div>
      </div>`).join('');
  }
}

/* ================================================================
   COMPARTIR RESULTADO
================================================================ */
function setupShare(result) {
  const shareText = `Hice el test de dolor del Dr. Angel M. Ancona Pérez y mi resultado fue: "${result.title}". ¿Tienes dolor de columna? Pruébalo aquí: ${window.location.href}`;

  // WhatsApp
  const waBtn = document.getElementById('btn-share-wa-test');
  if (waBtn) waBtn.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  // Copiar link
  const copyBtn = document.getElementById('btn-copy-result');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        copyBtn.textContent = '✅ Copiado';
        setTimeout(() => copyBtn.textContent = '🔗 Copiar link', 2000);
      });
    };
  }
}

/* ================================================================
   CAPTURA — INICIO DEL TEST
================================================================ */
function startTest() {
  patientName    = (document.getElementById('pt-patient-name')?.value  || '').trim();
  patientPhone   = (document.getElementById('pt-patient-phone')?.value || '').trim();
  patientConsent = document.getElementById('pt-consent')?.checked ?? true;
  hideStep(0);
  showProgressHeader(true);
  showStep(1);
  currentStep = 1;
  updateProgressBar(1);
  updateProgressLabel(1);
}

async function saveLead(result) {
  if (!_db || !patientPhone) return;
  try {
    await _db.from('leads').insert({
      nombre:           patientName,
      telefono:         patientPhone,
      consentimiento:   patientConsent,
      resultado_nivel:  result.level,
      resultado_titulo: result.title,
      zona:             answers.zona        || null,
      intensidad:       answers.intensidad  || null,
      duracion:         answers.duracion    || null,
      sintomas:         answers.sintomas    || null,
      limitacion:       answers.limitacion   || null,
      tratamiento:      answers.tratamiento || null,
    });
  } catch (_) { /* silencioso — no bloquear la UI */ }
}

/* ================================================================
   SCORES PARA EL RADAR
================================================================ */
function calcRadarScores() {
  return {
    intensidad:  answers.intensidad || 0,
    cronicidad:  ({ dias:2, semanas:4, meses:7, anos:10 })[answers.duracion]               || 0,
    neurologico: ({ solo_dolor:1, irradiado:5, neurologico:8, sfinteres:10 })[answers.sintomas] || 0,
    limitacion:  ({ normal:2, evita:4, trabajo_sueno:7, inmovil:10 })[answers.limitacion]  || 0,
    tratamiento: ({ ninguno:1, medicamento:3, fisio:7, cirugia_previa:10 })[answers.tratamiento] || 0,
  };
}

/* ================================================================
   RADAR CHART
================================================================ */
function renderRadarChart(result) {
  const canvas = document.getElementById('pt-radar-chart');
  if (!canvas || !window.Chart) return;

  const s = calcRadarScores();
  const colorMap = {
    urgente:      'rgba(239,68,68,',
    especialista: 'rgba(26,127,232,',
    conservador:  'rgba(34,197,94,',
    preventivo:   'rgba(16,185,129,',
  };
  const base = colorMap[result.type] || 'rgba(26,127,232,';

  if (_radarChart) { _radarChart.destroy(); _radarChart = null; }

  _radarChart = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: [
        ['Intensidad', 'del dolor'],
        ['Cronicidad'],
        ['Impacto', 'neurológico'],
        ['Limitación', 'funcional'],
        ['Tratamientos', 'previos'],
      ],
      datasets: [{
        label: 'Tu perfil',
        data: [s.intensidad, s.cronicidad, s.neurologico, s.limitacion, s.tratamiento],
        backgroundColor: base + '0.2)',
        borderColor:     base + '0.9)',
        borderWidth: 2.5,
        pointBackgroundColor: base + '1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          min: 0, max: 10,
          ticks: { stepSize: 5, font: { size: 9 }, color: '#9ca3af', backdropColor: 'transparent' },
          grid: { color: 'rgba(0,0,0,0.07)' },
          angleLines: { color: 'rgba(0,0,0,0.07)' },
          pointLabels: { font: { size: 10, weight: '600' }, color: '#374151' },
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` Nivel ${ctx.raw} de 10` } },
      },
      animation: { duration: 900, easing: 'easeInOutQuart' },
    }
  });

  // Subtítulo explicativo
  const wrap = canvas.closest('.pt-visual-card');
  if (wrap && !wrap.querySelector('.pt-radar-note')) {
    const note = document.createElement('p');
    note.className = 'pt-radar-note';
    note.textContent = 'Mayor área sombreada = mayor nivel de afectación';
    wrap.appendChild(note);
  }
}

/* ================================================================
   ANATOMÍA SVG
================================================================ */
function updateSpineAnatomySVG(result) {
  const svg = document.getElementById('spine-svg');
  if (!svg) return;

  // Resetear todas las regiones
  ['spine-cervical', 'spine-dorsal', 'spine-lumbar'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('spine-region--active');
    el.querySelectorAll('.spine-vert').forEach(v => v.style.fill = '');
  });
  const sciatic = document.getElementById('spine-sciatic');
  if (sciatic) sciatic.className = 'spine-sciatic-hidden';

  // Activar región según respuesta — fill directo para garantizar visibilidad en SVG
  const zonaMap = {
    cervical: ['spine-cervical'],
    dorsal:   ['spine-dorsal'],
    lumbar:   ['spine-lumbar'],
    multiple: ['spine-cervical', 'spine-dorsal', 'spine-lumbar'],
  };
  (zonaMap[answers.zona] || []).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('spine-region--active');
    el.querySelectorAll('.spine-vert').forEach(v => v.style.fill = result.color);
  });

  // Nervio ciático si hay dolor irradiado o neurológico lumbar
  if (answers.sintomas === 'irradiado' ||
      (answers.sintomas === 'neurologico' && answers.zona === 'lumbar')) {
    if (sciatic) sciatic.className = 'spine-sciatic-visible';
  }

  // Label descriptivo
  const zonaTexts = {
    cervical: 'Región Cervical — C1 a C7 (cuello)',
    dorsal:   'Región Dorsal — T1 a T12 (espalda media)',
    lumbar:   'Región Lumbar — L1 a L5 (espalda baja)',
    multiple: 'Múltiples regiones afectadas',
  };
  const lbl = document.getElementById('pt-anatomy-label');
  if (lbl) lbl.textContent = zonaTexts[answers.zona] || '';
}

/* ================================================================
   GENERACIÓN DE PDF
================================================================ */
async function generatePDF() {
  const result = calcResult();
  populatePDF(result);

  const layout = document.getElementById('pt-pdf-layout');
  layout.style.cssText = 'display:block;position:fixed;top:0;left:-9999px;width:794px;background:#fff;z-index:-1;';

  try {
    const canvas = await html2canvas(layout, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgW = 210;
    const imgH = (canvas.height * imgW) / canvas.width;
    const pageH = 297;
    let y = 0;

    while (y < imgH) {
      if (y > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, -y, imgW, imgH);
      y += pageH;
    }

    pdf.save('resultado-test-dolor-dr-ancona.pdf');
    return true;
  } catch (_) {
    return false;
  } finally {
    layout.style.cssText = 'display:none;';
  }
}

/* ================================================================
   INICIALIZACIÓN
================================================================ */
function checkCaptureFields() {
  const name  = (document.getElementById('pt-patient-name')?.value  || '').trim();
  const phone = (document.getElementById('pt-patient-phone')?.value || '').trim();
  const btn = document.getElementById('next-0');
  if (!btn) return;
  if (name && phone) btn.classList.add('is-enabled');
  else btn.classList.remove('is-enabled');
}

function initPainTest() {
  const section = document.getElementById('test-dolor');
  if (!section) return;

  // Inicializar Supabase
  if (window.supabase) _db = window.supabase.createClient(_SUPA_URL, _SUPA_KEY);

  // Ocultar barra de progreso hasta que empiece el test
  showProgressHeader(false);

  // Habilitar botón de inicio según campos llenos
  document.getElementById('pt-patient-name')?.addEventListener('input', checkCaptureFields);
  document.getElementById('pt-patient-phone')?.addEventListener('input', checkCaptureFields);

  section.addEventListener('click', e => {
    const t = e.target;
    const option = t.closest('.pt-option');
    if (option) { handleOptionSelect(option); return; }
    if (t.classList.contains('pt-scale-btn')) { handleScaleSelect(parseInt(t.dataset.value,10)); return; }
    const nextBtn = t.closest('.pt-btn-next');
    if (nextBtn) {
      if (!nextBtn.classList.contains('is-enabled')) return;
      if (nextBtn.dataset.action === 'start')  { startTest();   return; }
      if (nextBtn.dataset.action === 'result') { showResult();  return; }
      const n = parseInt(nextBtn.dataset.current, 10);
      if (!isNaN(n)) goToNextStep(n);
      return;
    }
    const backBtn = t.closest('.pt-btn-back');
    if (backBtn) { const n = parseInt(backBtn.dataset.prev,10); if (!isNaN(n)) goToPrevStep(n); return; }
    if (t.closest('#btn-restart')) restartTest();
  });

  // Botón PDF (re-descarga manual)
  document.getElementById('btn-pdf')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-pdf');
    btn.textContent = '⏳ Generando PDF...';
    btn.disabled = true;
    const ok = await generatePDF();
    btn.textContent = ok ? '✅ PDF descargado' : '❌ Error — intenta de nuevo';
    setTimeout(() => { btn.textContent = '📄 Guardar como PDF'; btn.disabled = false; }, 3000);
  });
}
document.addEventListener('DOMContentLoaded', initPainTest);
