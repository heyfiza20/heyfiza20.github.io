const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.animate(
      [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' }
    );
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08 });
document.querySelectorAll('.chapter, .project-title, .art-card, .month-card, .logo-card, .ui-feature, .capabilities article').forEach(item => observer.observe(item));
