const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".sidebar-nav a");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const id = entry.target.getAttribute("id");
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  });
}, { rootMargin: "-40% 0px -40% 0px" });

sections.forEach((section) => sectionObserver.observe(section));

const fadeEls = document.querySelectorAll(".fade-in");

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("visible");
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

fadeEls.forEach((el) => fadeObserver.observe(el));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const glow = document.createElement("div");
  glow.id = "cursor-glow";

  Object.assign(glow.style, {
    position: "fixed",
    pointerEvents: "none",
    zIndex: "9999",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(100,255,218,0.04) 0%, transparent 70%)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    transition: "left 0.15s ease, top 0.15s ease",
    left: "-999px",
    top: "-999px"
  });

  document.body.appendChild(glow);

  document.addEventListener("mousemove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

const roles = [
  "Full Stack Developer",
  ".NET & ASP.NET MVC Engineer",
  "Backend Developer",
  "Enterprise Web Developer"
];

let roleIndex = 0;
let charIndex = roles[0].length;
let isDeleting = true;
const typedEl = document.getElementById("typed-role");

function typeRole() {
  if (!typedEl || prefersReducedMotion) return;

  const current = roles[roleIndex];

  if (!isDeleting) {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex += 1;

    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex -= 1;

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeRole, isDeleting ? 60 : 90);
}

setTimeout(typeRole, 1800);
