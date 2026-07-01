const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const toast = document.querySelector('.toast');
document.querySelectorAll('[data-placeholder]').forEach(card => card.addEventListener('click', event => {
  event.preventDefault();
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}));

document.querySelector('#year').textContent = new Date().getFullYear();

if (!reducedMotion) {
  const motionGroups = [
    ['.section-heading, .intro > div, .project-title, .category-heading, .category-intro', 'motion-rise'],
    ['.chapter, .art-card, .month-card, .logo-card, .capabilities article', 'motion-rise'],
    ['.reel', 'motion-pop'],
    ['.strategy-card', 'motion-left'],
    ['.social-proof', 'motion-right'],
    ['.ui-feature', 'motion-scale'],
    ['.contact .section-label, .contact h2, .availability, .contact-links', 'motion-rise']
  ];

  motionGroups.forEach(([selector, className]) => {
    document.querySelectorAll(selector).forEach((item, index) => {
      item.classList.add('motion-item', className);
      item.style.setProperty('--motion-delay', `${Math.min(index % 6, 5) * 75}ms`);
    });
  });

  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.motion-item').forEach(item => observer.observe(item));
}

const progress = document.querySelector('.scroll-progress');
let scrollFrame;
const updateScrollEffects = () => {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const amount = distance > 0 ? window.scrollY / distance : 0;
  progress.style.transform = `scaleX(${amount})`;
  document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 24);
  scrollFrame = null;
};
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateScrollEffects);
}, { passive: true });
updateScrollEffects();

const interactiveShapes = document.querySelectorAll('.interactive-shape');
if (!reducedMotion) {
  interactiveShapes.forEach(shape => {
    const strength = Number(shape.dataset.magnet || 14);
    let shapeFrame;

    shape.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      if (shapeFrame) cancelAnimationFrame(shapeFrame);
      shapeFrame = requestAnimationFrame(() => {
        const bounds = shape.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        shape.style.setProperty('--mag-x', `${x * strength}px`);
        shape.style.setProperty('--mag-y', `${y * strength}px`);
        shape.style.setProperty('--mag-r', `${x * strength * 0.7}deg`);
        shape.style.setProperty('--mag-scale', '1.14');
      });
    });

    shape.addEventListener('pointerleave', () => {
      shape.style.setProperty('--mag-x', '0px');
      shape.style.setProperty('--mag-y', '0px');
      shape.style.setProperty('--mag-r', '0deg');
      shape.style.setProperty('--mag-scale', '1');
    });

    shape.addEventListener('click', () => {
      shape.classList.remove('shape-burst');
      requestAnimationFrame(() => shape.classList.add('shape-burst'));
      window.setTimeout(() => shape.classList.remove('shape-burst'), 650);
    });
  });
}
