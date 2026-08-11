const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-circle');
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

function updateCursorPosition(e) {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = `${mx}px`;
  dot.style.top = `${my}px`;
}

document.addEventListener('mousemove', updateCursorPosition);

function animateCursor() {
  rx += (mx - rx) * 0.16;
  ry += (my - ry) * 0.16;
  ring.style.left = `${rx}px`;
  ring.style.top = `${ry}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-card, .skill-card, .about-card, .research-card, .contact-card, .photo-card').forEach((el) => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

const header = document.getElementById('nav');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
let lastScrollY = window.scrollY;

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.classList.toggle('open');
    siteNav.classList.toggle('open');
  });

  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      siteNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  header.classList.toggle('solid', currentScrollY > 40);

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }

  lastScrollY = currentScrollY;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        entry.target.classList.add('in-view');
        if (entry.target.classList.contains('counter')) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
);

const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((el, index) => {
  const delay = parseFloat(el.dataset.delay || `${index * 0.05}`);
  el.style.transitionDelay = `${delay}s`;
  observer.observe(el);
});

document.querySelectorAll('.counter').forEach((el) => observer.observe(el));
document.querySelectorAll('.section').forEach((section) => observer.observe(section));

function animateCounter(el) {
  const target = Number(el.dataset.target || 0);
  const duration = 1200;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    el.textContent = value.toString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toString();
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('.exp-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.exp-tab').forEach((tab) => tab.classList.remove('active'));
    document.querySelectorAll('.exp-panel').forEach((panel) => panel.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(`panel-${btn.dataset.panel}`);
    if (target) target.classList.add('active');
  });
});

const heroVisual = document.querySelector('.hero-visual');
const photoCard = document.querySelector('.photo-card');
if (heroVisual && photoCard) {
  heroVisual.addEventListener('mousemove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    photoCard.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateY(-4px)`;
  });
  heroVisual.addEventListener('mouseleave', () => {
    photoCard.style.transform = 'perspective(1200px) rotateY(-6deg) rotateX(6deg)';
  });
}

const parallaxItems = document.querySelectorAll('.parallax');
let ticking = false;

function updateParallax() {
  const scrollY = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = parseFloat(item.dataset.speed || '0.08');
    const offset = scrollY * speed;
    item.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
  ticking = false;
}

function requestParallax() {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

window.addEventListener('scroll', requestParallax, { passive: true });
window.addEventListener('load', updateParallax);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  document.querySelectorAll('.project-card, .skill-card, .research-card, .about-card, .contact-card').forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const offset = rect.top - windowHeight * 0.8;
    if (offset < 0) {
      card.style.transform = `translateY(0) rotateX(0deg)`;
      card.style.opacity = '1';
    }
  });
});
