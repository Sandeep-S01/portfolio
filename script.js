// =============================================
// Navbar scroll effect
// =============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
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
  document.body.style.overflow = '';
}

function openMenu() {
  navToggle.classList.add('open');
  navMenu.classList.add('open');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
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
  rootMargin: '-80px 0px -40% 0px',
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
// Add base structural styles dynamically for elements we want to animate
const revealSelectors = [
  '.about-content', 
  '.identity-card', 
  '.case-study-card', 
  '.contact-info', 
  '.contact-form-wrapper'
];

document.querySelectorAll(revealSelectors.join(', ')).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll(revealSelectors.join(', ')).forEach(el => {
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

  // Simulate API call delay
  const btn = contactForm.querySelector('.btn-submit');
  const ogText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    contactForm.style.display = 'none';
    contactSuccess.classList.add('show');
    btn.textContent = ogText;
    btn.disabled = false;
  }, 800);
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
