const filterButtons = document.querySelectorAll('.filter-button');
const projects = document.querySelectorAll('.project-card');
const hero = document.querySelector('.hero');
const heroFrames = document.querySelectorAll('.hero-frame');
const projectOpeners = document.querySelectorAll('.project-open');
const videoModal = document.getElementById('video-modal');
const videoPlayer = document.getElementById('video-player');
const videoTitle = document.getElementById('video-modal-title');
const videoPlatform = document.getElementById('video-platform');
const videoOriginalLink = document.getElementById('video-original-link');
const videoCloseButton = videoModal.querySelector('.video-close');
let lastVideoTrigger = null;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

projects.forEach((project) => revealObserver.observe(project));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    projects.forEach((project) => {
      const visible = selected === 'all' || project.dataset.group === selected;
      project.classList.toggle('is-hidden', !visible);
      if (visible) {
        project.classList.add('in-view');
      }
    });
  });
});

function openVideo(button) {
  lastVideoTrigger = button;
  const platform = button.dataset.platform;
  let embedUrl = button.dataset.embed;

  if (platform === 'Instagram') {
    embedUrl += embedUrl.includes('?') ? '&autoplay=1' : '?autoplay=1';
  }

  videoTitle.textContent = button.dataset.title;
  videoPlatform.textContent = platform;
  videoOriginalLink.href = button.dataset.original;
  videoOriginalLink.textContent = `View on ${platform} ↗`;
  videoPlayer.src = embedUrl;
  videoModal.hidden = false;
  document.body.classList.add('modal-open');
  window.requestAnimationFrame(() => videoCloseButton.focus());
}

function closeVideo() {
  videoModal.hidden = true;
  videoPlayer.src = 'about:blank';
  document.body.classList.remove('modal-open');
  if (lastVideoTrigger) {
    lastVideoTrigger.focus();
  }
}

projectOpeners.forEach((button) => {
  button.addEventListener('click', () => openVideo(button));
});

videoModal.querySelectorAll('[data-close-modal]').forEach((control) => {
  control.addEventListener('click', closeVideo);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !videoModal.hidden) {
    closeVideo();
  }
});

if (window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    heroFrames.forEach((frame) => {
      frame.style.setProperty('--px', x.toFixed(3));
      frame.style.setProperty('--py', y.toFixed(3));
    });
  });

  hero.addEventListener('pointerleave', () => {
    heroFrames.forEach((frame) => {
      frame.style.setProperty('--px', 0);
      frame.style.setProperty('--py', 0);
    });
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
