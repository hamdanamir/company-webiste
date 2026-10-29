// Project cards are built from data, so screenshots and new projects need no layout changes.
function validProjectUrl(value) {
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}
const arrowMarkup = '<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5"/></svg>';
const procurementArtwork = `<div class="product-preview" aria-hidden="true"><div class="product-topbar"><b><span>◈</span>ProcureGuard AI</b><span>PROCUREMENT OVERVIEW</span></div><div class="product-greeting">Clarity at every step.</div><div class="product-subtitle">AI-powered procurement & invoice anomaly detection.</div><div class="procurement-cards"><div><small>PROCESSING</small><strong>Invoices</strong></div><div><small>DETECTION</small><strong>Anomalies</strong></div><div><small>WORKFLOW</small><strong>Approvals</strong></div></div><div class="procurement-table"><div class="table-heading"><span>WORKSPACE ACTIVITY</span><span>STATUS</span></div><div><span>Supplier & PO management</span><em>In review</em></div><div><span>Price & quantity checks</span><em>Pending</em></div><div><span>Invoice processing</span><em>Complete</em></div></div></div>`;
const waveMarkup = Array.from({length: 27}, (_, i) => `<i style="--bar:${10 + Math.sin(i * 1.7) ** 2 * 24}px;--delay:${i * -0.11}s"></i>`).join('');
const voiceArtwork = `<div class="product-preview" aria-hidden="true"><div class="product-topbar"><b><span>✳</span>VoiceOps Agent</b><span>VOICE WORKSPACE</span></div><div class="voice-center"><div class="voice-orb"></div><div class="voice-state">A more human connection.</div><div class="voice-wave">${waveMarkup}</div><p class="voice-caption">VOICE × INTELLIGENCE × POSSIBILITY</p></div><div class="voice-bottom"><span>INTERFACE EXPLORATION</span><span>● VOICEOPS</span></div></div>`;
window.veytrixaProjects.forEach((project, index) => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'project reveal';
  card.dataset.project = project.id;
  card.setAttribute('aria-label', `Explore ${project.name}`);
  const art = document.createElement('div');
  art.className = `project-art ${project.artwork === 'voice' ? 'voice-art' : 'procurement-art'}`;
  if (project.screenshot) {
    art.classList.add('has-project-image');
    const image = document.createElement('img');
    image.className = 'project-screenshot'; image.src = project.screenshot;
    image.alt = `${project.name} — ${project.summary}`; image.loading = 'lazy'; image.decoding = 'async';
    image.addEventListener('error', () => {
      image.remove(); art.insertAdjacentHTML('afterbegin', project.artwork === 'voice' ? voiceArtwork : procurementArtwork);
    }, {once: true});
    art.append(image);
  } else art.innerHTML = project.artwork === 'voice' ? voiceArtwork : procurementArtwork;
  const category = document.createElement('span'); category.className = 'project-pill'; category.textContent = project.category;
  const open = document.createElement('span'); open.className = 'project-open'; open.innerHTML = arrowMarkup;
  art.append(category, open);
  const caption = document.createElement('div'); caption.className = 'project-caption';
  const heading = document.createElement('h3'); heading.className = 'project-name';
  heading.append(document.createTextNode(project.name));
  const number = document.createElement('small'); number.textContent = `PROJECT / ${String(index + 1).padStart(2, '0')}`; heading.append(number);
  const summary = document.createElement('p'); summary.textContent = project.summary;
  const disciplines = document.createElement('span'); disciplines.textContent = project.disciplines.join(' · ');
  caption.append(heading, summary, disciplines); card.append(art, caption);
  document.querySelector('#project-grid').append(card);
});
