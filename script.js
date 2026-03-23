// =============================================
// Navbar scroll effect
// =============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// =============================================
// Mobile menu toggle
// =============================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function closeMenu() {
  navToggle.classList.remove('open');
  navMenu.classList.remove('open');
  navOverlay.classList.remove('open');
}

function openMenu() {
  navToggle.classList.add('open');
  navMenu.classList.add('open');
  navOverlay.classList.add('open');
}

navToggle.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});

navOverlay.addEventListener('click', closeMenu);

// Close menu when a link is clicked
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    closeMenu();
  }
});

// =============================================
// Active nav link on scroll
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
  root: null,
  rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim()} 0px -40% 0px`,
  threshold: 0,
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// =============================================
// Scroll reveal animations
// =============================================
const revealElements = document.querySelectorAll(
  '.project-card, .about-content, .about-photo-wrapper, .contact-form'
);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach(el => {
  if (el.classList.contains('project-card')) {
    const cards = [...document.querySelectorAll('.project-card')];
    const i = cards.indexOf(el);
    el.style.transitionDelay = `${i * 0.15}s`;
    el.style.transitionDuration = '0.6s';
    el.style.transitionProperty = 'opacity, transform';
  }
  revealObserver.observe(el);
});

// =============================================
// Contact form handling
// =============================================
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');
const contactReset = document.getElementById('contactReset');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const inputs = contactForm.querySelectorAll('.form-input[required]');
  let valid = true;

  inputs.forEach(input => {
    input.classList.remove('error');
    if (!input.value.trim()) {
      input.classList.add('error');
      valid = false;
    }
    if (input.type === 'email' && input.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value.trim())) {
        input.classList.add('error');
        valid = false;
      }
    }
  });

  if (!valid) return;

  contactForm.style.display = 'none';
  contactSuccess.classList.add('show');
});

// Clear error on input
contactForm.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error');
  });
});

// Reset form
contactReset.addEventListener('click', () => {
  contactForm.reset();
  contactForm.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
  contactSuccess.classList.remove('show');
  contactForm.style.display = 'flex';
});
