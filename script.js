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
