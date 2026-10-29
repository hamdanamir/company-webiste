const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader = document.querySelector('#site-loader');
function finishLoading() {
  clearTimeout(window.loaderFallback);
  loader.classList.add('is-complete');
  setTimeout(() => { loader.hidden = true; }, reducedMotion ? 0 : 500);
}
Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1200))]).then(finishLoading);
document.addEventListener('keydown', finishLoading, {once: true});

const policyDialog = document.querySelector('#policy-dialog');
const policies = {
  privacy: {
    title: 'Your privacy, clearly.',
    body: '<h3>Project enquiries</h3><p>When the button says “Send project enquiry”, your name, email, project details, and any optional company or phone information are submitted through the form provider named below the button (Formspree or Web3Forms) so Veytrixa can respond. The provider processes your submission under its own privacy policy. When the button says “Prepare project brief”, the form only generates a local text file and sends nothing. Do not include sensitive or confidential information.</p><h3>Website resources</h3><p>Fonts, graphics, and scripts are served with this website. This version does not include analytics, advertising trackers, or account registration. The hosting provider may process standard request information to deliver the website.</p><h3>Questions</h3><p>Before sharing confidential material, arrange an appropriate contact channel with the Veytrixa team. This notice describes the current website; it should be reviewed when enquiry delivery or analytics is added.</p>'
  },
  terms: {
    title: 'Using this website.',
    body: '<h3>Project previews</h3><p>ProcureGuard AI, n8n automation, and VoiceOps AI are presented through team-supplied project and workflow artwork. Promotional figures shown in the artwork are not independently verified performance results.</p><h3>Starting a project</h3><p>Website content is general information. Scope, pricing, delivery dates, ownership, and support are agreed separately before a project begins.</p><h3>Availability</h3><p>Content and previews may change as the portfolio develops. The project brief download is a local preparation tool and does not constitute a submitted enquiry or a service agreement.</p>'
  }
};
document.querySelectorAll('[data-policy]').forEach(button => button.addEventListener('click', () => {
  const policy = policies[button.dataset.policy];
  document.querySelector('#policy-title').textContent = policy.title;
  document.querySelector('#policy-body').innerHTML = policy.body;
  policyDialog.showModal();
}));
document.querySelector('.policy-close').addEventListener('click', () => policyDialog.close());
policyDialog.addEventListener('click', event => {
  if (event.target === policyDialog) {
    const bounds = policyDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) policyDialog.close();
  }
});
if ('IntersectionObserver' in window) {
  const projectMotion = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting)));
  document.querySelectorAll('.project').forEach(project => projectMotion.observe(project));
}
if ('IntersectionObserver' in window && !reducedMotion) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  mobileNav.hidden = expanded;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 721px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

document.querySelectorAll('[data-service]').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelector('#service').value = card.dataset.service;
  });
});

const projects = Object.fromEntries(window.veytrixaProjects.map(project => [project.id, project]));
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(project => {
  project.addEventListener('click', () => {
    const content = projects[project.dataset.project];
    document.querySelector('#dialog-title').textContent = content.name;
    document.querySelector('#dialog-description').textContent = content.description;
    const gallery = document.querySelector('#dialog-gallery');
    gallery.replaceChildren();
    const images = content.screenshot ? [{src: content.screenshot, caption: content.name}, ...(content.gallery || [])] : [];
    images.forEach(item => {
      const figure = document.createElement('figure');
      const link = document.createElement('a');
      link.href = item.src; link.target = '_blank'; link.rel = 'noopener';
      link.setAttribute('aria-label', `Open full-size image: ${item.caption}`);
      const image = document.createElement('img');
      image.src = item.src; image.alt = item.caption; image.loading = 'lazy'; image.decoding = 'async';
      const caption = document.createElement('figcaption'); caption.textContent = `${item.caption} — open full size ↗`;
      link.append(image); figure.append(link, caption); gallery.append(figure);
    });
    document.querySelector('#project-dialog .dialog-disclaimer').textContent = content.imageNote || 'Illustrative interface study. Full project details and screenshots will be added as supplied.';
    const meta = document.querySelector('#dialog-meta');
    meta.replaceChildren(...content.disciplines.map(label => {
      const tag = document.createElement('span'); tag.textContent = label; return tag;
    }));
    const live = document.querySelector('#dialog-live');
    live.hidden = !validProjectUrl(content.liveUrl);
    if (!live.hidden) live.href = content.liveUrl;
    else live.removeAttribute('href');
    dialog.showModal();
  });
});
document.querySelectorAll('.dialog-close').forEach(button => {
  button.type = 'button';
  button.addEventListener('click', () => button.closest('dialog').close());
});
document.querySelector('#dialog-cta').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});

document.querySelector('.contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const brief = [
    'VEYTRIXA TECHNOLOGIES — PROJECT BRIEF',
    '',
    `Name: ${String(data.get('name')).trim()}`,
    `Email: ${String(data.get('email')).trim()}`,
    `Service: ${data.get('service') || 'To be discussed'}`,
    '',
    `Company: ${String(data.get('company') || '').trim() || 'Not provided'}`,
    `Phone: ${String(data.get('phone') || '').trim() || 'Not provided'}`,
    '',
    'Project details:',
    String(data.get('message')).trim(),
    '',
    'Prepared locally. This brief has not been sent.'
  ].join('\n');
  const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'veytrixa-project-brief.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('.form-status').textContent = 'Your project brief is ready. Save it and share it with the Veytrixa team. Nothing has been sent.';
});
document.querySelector('#year').textContent = String(new Date().getFullYear());

// A projected toroidal sculpture. Local canvas artwork, with no image or WebGL dependency.
const canvas = document.querySelector('#particle-canvas');
const context = canvas.getContext('2d');
const hero = document.querySelector('.hero');
const motionButton = document.createElement('button');
motionButton.className = 'motion-toggle';
motionButton.type = 'button';
motionButton.setAttribute('aria-pressed', String(reducedMotion));
motionButton.textContent = reducedMotion ? 'PLAY MOTION' : 'PAUSE MOTION';
hero.append(motionButton);
let paused = reducedMotion;
if (paused) document.body.classList.add('motion-paused');
let heroVisible = true;
let frame = 0;
let time = 0;
let lastTime = 0;
let width = 0;
let height = 0;
let pointerX = 0;
let pointerY = 0;
let rotationX = 0;
let rotationY = 0;
const points = [];
const ringCount = window.innerWidth < 721 ? 60 : 100;
for (let ring = 0; ring < ringCount; ring++) {
  const u = ring / ringCount * Math.PI * 2;
  for (let segment = 0; segment < 28; segment++) {
    const v = segment / 28 * Math.PI * 2;
    const twist = v + u * 3;
    const tube = 0.31 + Math.sin(u * 3) * 0.045;
    points.push({
      x: (0.77 + tube * Math.cos(twist)) * Math.cos(u),
      y: (0.77 + tube * Math.cos(twist)) * Math.sin(u),
      z: tube * Math.sin(twist),
      accent: segment % 7 === 0,
      phase: u
    });
  }
}
function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  width = bounds.width;
  height = bounds.height;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawSculpture();
}
function drawSculpture() {
  if (!context || !width || !height) return;
  context.clearRect(0, 0, width, height);
  const scale = Math.min(width * 0.43, height * 0.43);
  const cx = width * 0.54;
  const cy = height * 0.49;
  const glow = context.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.6);
  glow.addColorStop(0, '#a4d35b12');
  glow.addColorStop(0.65, '#7d9e3c06');
  glow.addColorStop(1, '#10111200');
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
  const a = time * 0.12 + rotationX + 0.65;
  const b = Math.sin(time * 0.14) * 0.22 + rotationY + 0.85;
  const c = time * 0.06 - 0.4;
  const projected = points.map(point => {
    const x1 = point.x * Math.cos(a) - point.z * Math.sin(a);
    const z1 = point.x * Math.sin(a) + point.z * Math.cos(a);
    const y1 = point.y * Math.cos(b) - z1 * Math.sin(b);
    const z2 = point.y * Math.sin(b) + z1 * Math.cos(b);
    const x2 = x1 * Math.cos(c) - y1 * Math.sin(c);
    const y2 = x1 * Math.sin(c) + y1 * Math.cos(c);
    const perspective = 3.2 / (3.2 - z2);
    return {x: cx + x2 * scale * perspective, y: cy + y2 * scale * perspective,
      depth: z2, radius: perspective * (point.accent ? 1.5 : 0.8), accent: point.accent};
  }).sort((a, b) => a.depth - b.depth);
  for (const point of projected) {
    const opacity = 0.18 + (point.depth + 1.2) / 2.4 * 0.67;
    context.fillStyle = point.accent ? `rgba(224,255,159,${opacity})` : `rgba(157,187,115,${opacity * 0.85})`;
    context.beginPath();
    context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    context.fill();
  }
  // Thin orbital paths give the particle volume an architectural frame.
  context.save();
  context.translate(cx, cy);
  context.rotate(-0.36 + Math.sin(time * 0.08) * 0.06);
  context.strokeStyle = '#bdde8630';
  context.lineWidth = 0.6;
  context.beginPath();
  context.ellipse(0, 0, scale * 1.3, scale * 0.4, 0, 0, Math.PI * 2);
  context.stroke();
  const satellite = time * 0.28;
  context.fillStyle = '#deffa5';
  context.shadowColor = '#c6ff78';
  context.shadowBlur = 14;
  context.beginPath();
  context.arc(Math.cos(satellite) * scale * 1.3, Math.sin(satellite) * scale * 0.4, 2.8, 0, Math.PI * 2);
  context.fill();
  context.restore();
}
function animate(timestamp) {
  frame = 0;
  if (paused || !heroVisible || document.hidden) return;
  if (lastTime && timestamp - lastTime < (window.innerWidth < 721 ? 32 : 16)) {
    frame = requestAnimationFrame(animate);
    return;
  }
  const delta = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.05) : 0;
  lastTime = timestamp;
  time += delta;
  rotationX += (pointerX * 0.3 - rotationX) * 0.035;
  rotationY += (pointerY * 0.3 - rotationY) * 0.035;
  drawSculpture();
  frame = requestAnimationFrame(animate);
}
function synchronizeAnimation() {
  cancelAnimationFrame(frame);
  frame = 0;
  lastTime = 0;
  if (!paused && heroVisible && !document.hidden) frame = requestAnimationFrame(animate);
}
motionButton.addEventListener('click', () => {
  paused = !paused;
  document.body.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'PLAY MOTION' : 'PAUSE MOTION';
  synchronizeAnimation();
});
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
  paused = event.matches;
  document.body.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'PLAY MOTION' : 'PAUSE MOTION';
  synchronizeAnimation();
});
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    synchronizeAnimation();
  }).observe(hero);
}
document.addEventListener('visibilitychange', synchronizeAnimation);
new ResizeObserver(resizeCanvas).observe(canvas);
resizeCanvas();
synchronizeAnimation();

const finePointer = window.matchMedia('(pointer: fine)');
const aura = document.querySelector('.cursor-aura');
document.addEventListener('pointermove', event => {
  if (!finePointer.matches || paused) return;
  pointerX = event.clientX / window.innerWidth * 2 - 1;
  pointerY = event.clientY / window.innerHeight * 2 - 1;
  aura.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  aura.classList.add('active');
}, { passive: true });
document.documentElement.addEventListener('pointerleave', () => aura.classList.remove('active'));
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (!finePointer.matches || paused) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
  }, { passive: true });
});
let scrollScheduled = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.scroll-progress').style.scale = `${max > 0 ? window.scrollY / max : 0} 1`;
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(updateProgress);
  }
}, { passive: true });
updateProgress();
