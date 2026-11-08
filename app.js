'use strict';
const $ = (s) => document.querySelector(s);
const els = { q: $('#q'), mode: $('#mode'), chips: $('#chips'), list: $('#list'), state: $('#state'), count: $('#count'), results: $('#results'), form: $('#filters') };
let all = [];
const filter = { q: '', mode: '', domain: '' };

async function load() {
  els.results.setAttribute('aria-busy', 'true');
  showState('Loading internships…');
  try {
    const res = await fetch('data/internships.json');
    if (!res.ok) throw new Error('Server returned ' + res.status);
    all = await res.json();
    buildChips();
    render();
  } catch (err) {
    els.list.replaceChildren();
    els.count.textContent = '';
    showState('Could not load internships. Check your connection and try again.', true, load);
  } finally {
    els.results.setAttribute('aria-busy', 'false');
  }
}

function showState(msg, isError = false, retry) {
  els.state.hidden = false;
  els.state.className = 'state' + (isError ? ' error' : '');
  els.state.replaceChildren(Object.assign(document.createElement('p'), { textContent: msg }));
  if (retry) {
    const b = Object.assign(document.createElement('button'), { type: 'button', textContent: 'Try again' });
    b.addEventListener('click', retry);
    els.state.append(b);
  }
}

function buildChips() {
  const domains = ['All domains', ...new Set(all.map((i) => i.domain))];
  els.chips.replaceChildren(...domains.map((d, idx) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = d;
    b.dataset.domain = idx === 0 ? '' : d;
    b.setAttribute('aria-pressed', String(idx === 0));
    return b;
  }));
}

function setDomain(btn) {
  filter.domain = btn.dataset.domain;
  els.chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === btn)));
  render();
}

function matches(i) {
  const q = filter.q.trim().toLowerCase();
  const hay = [i.title, i.company, ...i.skills].join(' ').toLowerCase();
  return (!q || hay.includes(q)) && (!filter.mode || i.mode === filter.mode) && (!filter.domain || i.domain === filter.domain);
}

function card(i) {
  const el = document.createElement('article');
  el.className = 'card';
  const h = Object.assign(document.createElement('h3'), { textContent: i.title });
  const meta = Object.assign(document.createElement('p'), { className: 'meta', textContent: `${i.company}, ${i.location} (${i.mode})` });
  const tags = document.createElement('ul'); tags.className = 'tags';
  i.skills.forEach((s) => tags.append(Object.assign(document.createElement('li'), { textContent: s })));
  const id = 'details-' + i.id;
  const details = Object.assign(document.createElement('p'), { id, className: 'details', hidden: true,
    textContent: `${i.description} Duration: ${i.durationWeeks} weeks. Stipend: ₹${i.stipend.toLocaleString('en-IN')}/month. Apply by ${i.deadline}.` });
  const btn = Object.assign(document.createElement('button'), { type: 'button', className: 'ghost more', textContent: 'Show details' });
  btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.textContent = open ? 'Show details' : 'Hide details';
    details.hidden = open;
  });
  el.append(h, meta, tags, details, btn);
  return el;
}

function render() {
  const rows = all.filter(matches);
  els.list.replaceChildren(...rows.map(card));
  els.count.textContent = `${rows.length} of ${all.length} internships`;
  if (rows.length) els.state.hidden = true;
  else showState('No internships match these filters. Clear a filter or try a different keyword.');
}

els.q.addEventListener('input', () => { filter.q = els.q.value; render(); });
els.mode.addEventListener('change', () => { filter.mode = els.mode.value; render(); });
els.form.addEventListener('submit', (e) => e.preventDefault());
els.form.addEventListener('reset', () => setTimeout(() => {
  filter.q = ''; filter.mode = '';
  const first = els.chips.querySelector('.chip'); if (first) setDomain(first);
}));
els.chips.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) setDomain(b); });
els.chips.addEventListener('keydown', (e) => {   // arrow-key navigation inside the chip group
  const chips = [...els.chips.querySelectorAll('.chip')];
  const i = chips.indexOf(document.activeElement);
  if (i < 0) return;
  const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: chips.length - 1 }[e.key];
  if (next === undefined) return;
  e.preventDefault(); chips[(next + chips.length) % chips.length].focus();
});
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); els.q.focus(); }
});
load();
