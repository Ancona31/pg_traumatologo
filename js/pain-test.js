'use strict';

/* ================================================================
   CONFIGURACIÓN
================================================================ */
const TOTAL_STEPS = 6;

const PAIN_THRESHOLDS = { urgente: 7, traumatico: 6, conservador: 5 };

/* ================================================================
   RESULTADOS — edita solo este objeto para cambiar los textos
================================================================ */
const RESULTS = {
  urgente_esfinteres: {
    type: 'urgente', icon: '🚨', color: '#ef4444',
    level: 'EMERGENCIA MÉDICA',
    title: 'Acude a urgencias de inmediato',
    desc:  'La pérdida de control de esfínteres puede indicar compresión grave de la médula espinal (síndrome de cauda equina). Es una emergencia quirúrgica. Dirígete a urgencias o llama al Dr. Ancona ahora mismo.',
  },
  urgente_neurologico: {
    type: 'urgente', icon: '⚠️', color: '#f97316',
    level: 'ATENCIÓN URGENTE',
    title: 'Requieres atención especializada pronto',
    desc:  'El entumecimiento o debilidad intensa combinado con dolor severo puede indicar compresión nerviosa activa. Recomendamos consulta con el Dr. Ancona en los próximos 1–3 días para resonancia magnética y valoración neurológica.',
  },
  urgente_trauma: {
    type: 'urgente', icon: '🦴', color: '#f59e0b',
    level: 'EVALUACIÓN PRIORITARIA',
    title: 'Posible fractura o lesión traumática',
    desc:  'Un golpe o caída con dolor intenso debe descartarse con estudios de imagen (radiografía o TAC) lo antes posible. Evita movimientos bruscos y acude a valoración urgente para descartar fractura vertebral.',
  },
  cirugia_fallida: {
    type: 'especialista', icon: '🔩', color: '#8b5cf6',
    level: 'REVISIÓN POST-QUIRÚRGICA',
    title: 'Tu cirugía previa requiere revisión',
    desc:  'El dolor persistente después de una cirugía de columna puede tener causas específicas: cicatriz epidural, falla del implante, nueva hernia o inestabilidad. El Dr. Ancona realizará una evaluación especializada para identificar la causa y ofrecerte opciones de solución.',
  },
  especialista_cronico: {
    type: 'especialista', icon: '🩺', color: '#3b82f6',
    level: 'CONSULTA ESPECIALIZADA',
    title: 'Tu dolor crónico necesita evaluación profunda',
    desc:  'Un dolor que persiste más de 6 meses requiere un enfoque diagnóstico completo con estudios de imagen. El Dr. Ancona determinará si existe una causa estructural tratable y diseñará un plan de manejo personalizado.',
  },
  segunda_opinion: {
    type: 'especialista', icon: '🔍', color: '#06b6d4',
    level: 'SEGUNDA EVALUACIÓN',
    title: 'Tu tratamiento actual no está dando resultados',
    desc:  'Si la fisioterapia o los medicamentos no han resuelto tu dolor, es momento de una valoración más profunda. El Dr. Ancona revisará si existe una causa estructural que requiera un enfoque diferente o tratamiento mínimamente invasivo.',
  },
  especialista_irradiado: {
    type: 'especialista', icon: '⚡', color: '#1a7fe8',
    level: 'CONSULTA CON ESPECIALISTA',
    title: 'El dolor irradiado sugiere compresión nerviosa',
    desc:  'El dolor que baja por la pierna o el brazo indica posible compresión de raíz nerviosa. Con una resonancia magnética y valoración con el Dr. Ancona podremos confirmar el diagnóstico y evaluar si requieres tratamiento conservador o quirúrgico.',
  },
  conservador: {
    type: 'conservador', icon: '💊', color: '#22c55e',
    level: 'MANEJO CONSERVADOR',
    title: 'Tu dolor puede mejorar con tratamiento conservador',
    desc:  'Muchos casos como el tuyo responden bien a reposo relativo, analgésicos y fisioterapia. Sin embargo, es importante una consulta médica para confirmar el diagnóstico y evitar que el problema progrese.',
  },
  preventivo: {
    type: 'preventivo', icon: '✅', color: '#10b981',
    level: 'PREVENCIÓN Y SEGUIMIENTO',
    title: 'Tu dolor parece leve y manejable',
    desc:  'Tus respuestas sugieren un cuadro leve que puede mejorar con ejercicio, buena postura y ergonomía. Una consulta preventiva con el Dr. Ancona te orientará para evitar que el problema progrese.',
  },
};

/* ================================================================
   ETIQUETAS PARA EL RESUMEN
================================================================ */
const LABELS = {
  zona:        { cervical:'Cuello (Cervical)', dorsal:'Espalda media (Dorsal)', lumbar:'Espalda baja (Lumbar)', multiple:'Varias zonas' },
  duracion:    { dias:'Menos de 1 semana', semanas:'1 a 6 semanas', meses:'1 a 6 meses', anos:'Más de 6 meses' },
  sintomas:    { sfinteres:'Dificultad para orinar/defecar', neurologico:'Entumecimiento o debilidad', irradiado:'Dolor que baja por pierna/brazo', solo_dolor:'Solo dolor local' },
  causa:       { trauma:'Golpe o caída reciente', esfuerzo:'Esfuerzo o movimiento brusco', postura:'Postura o trabajo sedentario', sin_causa:'Sin causa aparente' },
  tratamiento: { ninguno:'Ninguno todavía', medicamento:'Solo medicamentos', fisio:'Fisioterapia / rehabilitación', cirugia_previa:'Cirugía de columna previa' },
};
const Q_LABELS = {
  zona:'📍 Zona de dolor', intensidad:'🔢 Intensidad del dolor',
  duracion:'⏱️ Duración', sintomas:'🩺 Síntomas',
  causa:'🔎 Causa', tratamiento:'💉 Tratamiento previo',
};

/* ================================================================
   ESTADO
================================================================ */
let answers = {}, currentStep = 1;

/* ================================================================
   LÓGICA DE RESULTADOS
================================================================ */
function calcResult() {
  const { sintomas, intensidad, duracion, tratamiento, causa } = answers;
  if (sintomas === 'sfinteres')                                           return RESULTS.urgente_esfinteres;
  if (sintomas === 'neurologico' && intensidad >= PAIN_THRESHOLDS.urgente) return RESULTS.urgente_neurologico;
  if (causa === 'trauma' && intensidad >= PAIN_THRESHOLDS.traumatico)     return RESULTS.urgente_trauma;
  if (tratamiento === 'cirugia_previa')                                   return RESULTS.cirugia_fallida;
  if (duracion === 'anos')                                                return RESULTS.especialista_cronico;
  if (tratamiento === 'fisio')                                            return RESULTS.segunda_opinion;
  if (sintomas === 'irradiado' || duracion === 'meses')                   return RESULTS.especialista_irradiado;
  if (intensidad <= PAIN_THRESHOLDS.conservador && (duracion === 'dias' || duracion === 'semanas')) return RESULTS.conservador;
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
    { key:'causa',       val: LABELS.causa[answers.causa] },
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
function showResult() {
  if (!answers.tratamiento) return;
  hideStep(TOTAL_STEPS);
  updateProgressBar(TOTAL_STEPS + 1);
  updateProgressLabel(TOTAL_STEPS + 1);

  const result = calcResult();
  renderResultCard(result);
  renderSummary();

  const container = document.getElementById('pt-result');
  if (container) container.hidden = false;
  scrollToSection();
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
  const lvl = document.getElementById('result-level');
  if (lvl) lvl.style.color = result.color;
}

/* ================================================================
   NAVEGACIÓN
================================================================ */
function goToNextStep(step) {
  hideStep(step); showStep(step + 1);
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
  scrollToSection();
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
  answers = {}; currentStep = 1;
  document.querySelectorAll('.pt-option').forEach(o => o.classList.remove('selected'));
  document.querySelectorAll('.pt-scale-btn').forEach(b => { b.className = 'pt-scale-btn'; });
  const lbl = document.getElementById('scale-selected-label');
  if (lbl) { lbl.textContent = ''; lbl.style.display = 'none'; }
  document.querySelectorAll('.pt-btn-next:not(#next-6)').forEach(b => b.classList.remove('is-enabled'));
  const res = document.getElementById('pt-result');
  if (res) res.hidden = true;
  document.querySelectorAll('.pt-step').forEach(s => s.classList.remove('active'));
  showStep(1); updateProgressBar(1); updateProgressLabel(1);
  scrollToSection();
}

/* ================================================================
   DOM HELPERS
================================================================ */
function showStep(step)         { document.getElementById(`step-${step}`)?.classList.add('active'); }
function hideStep(step)         { document.getElementById(`step-${step}`)?.classList.remove('active'); }
function enableNextButton(step) { document.getElementById(`next-${step}`)?.classList.add('is-enabled'); }
function setText(id, text)      { const el = document.getElementById(id); if (el) el.textContent = text; }

function updateProgressBar(step) {
  const fill = document.getElementById('pt-progress');
  if (fill) fill.style.width = `${Math.min(((step-1)/TOTAL_STEPS)*100, 100)}%`;
}
function updateProgressLabel(step) {
  const lbl = document.getElementById('pt-progress-label');
  if (!lbl) return;
  lbl.textContent = step > TOTAL_STEPS ? '✅ Completado' : `Pregunta ${step} de ${TOTAL_STEPS}`;
}
function scrollToSection() {
  const s = document.getElementById('test-dolor');
  if (!s) return;
  const nav = document.getElementById('navbar')?.offsetHeight || 80;
  window.scrollTo({ top: s.offsetTop - nav, behavior: 'smooth' });
}

/* ================================================================
   INICIALIZACIÓN
================================================================ */
function initPainTest() {
  const section = document.getElementById('test-dolor');
  if (!section) return;
  section.addEventListener('click', e => {
    const t = e.target;
    const option = t.closest('.pt-option');
    if (option) { handleOptionSelect(option); return; }
    if (t.classList.contains('pt-scale-btn')) { handleScaleSelect(parseInt(t.dataset.value,10)); return; }
    const nextBtn = t.closest('.pt-btn-next');
    if (nextBtn) {
      if (!nextBtn.classList.contains('is-enabled')) return;
      if (nextBtn.dataset.action === 'result') { showResult(); return; }
      const n = parseInt(nextBtn.dataset.current, 10);
      if (!isNaN(n)) goToNextStep(n);
      return;
    }
    const backBtn = t.closest('.pt-btn-back');
    if (backBtn) { const n = parseInt(backBtn.dataset.prev,10); if (!isNaN(n)) goToPrevStep(n); return; }
    if (t.closest('#btn-restart')) restartTest();
  });
}
document.addEventListener('DOMContentLoaded', initPainTest);
