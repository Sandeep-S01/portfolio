/* ===================================================================
   script.js — Editorial Portfolio Interactions
   Theme toggle, mobile navigation, scroll-aware header,
   scrollspy, reveal animations, clipboard copy & dynamic year
   =================================================================== */

(function () {
  "use strict";

  /* -----------------------------------------------------------------
     1. THEME TOGGLE (Circular View Transition & Icon Spring)
     ----------------------------------------------------------------- */
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = document.documentElement.dataset.theme || "light";
      var next = current === "dark" ? "light" : "dark";

      // Trigger spring-spin animation on button icon
      themeBtn.classList.remove("theme-toggle-active");
      void themeBtn.offsetWidth; // force DOM reflow
      themeBtn.classList.add("theme-toggle-active");

      // Check if View Transition API is supported and user hasn't requested reduced motion
      var hasViewTransition = typeof document.startViewTransition === "function";
      var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!hasViewTransition || prefersReducedMotion) {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch (e) {}
        return;
      }

      // Calculate the circular clip origin from the clicked button
      var rect = themeBtn.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;

      // Distance to the farthest viewport corner
      var endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      var transition = document.startViewTransition(function () {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch (e) {}
      });

      transition.ready.then(function () {
        var clipPath = [
          "circle(0px at " + x + "px " + y + "px)",
          "circle(" + endRadius + "px at " + x + "px " + y + "px)"
        ];

        document.documentElement.animate(
          {
            clipPath: clipPath
          },
          {
            duration: 520,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)"
          }
        );
      });
    });
  }

  /* -----------------------------------------------------------------
     2. MOBILE NAVIGATION MENU
     ----------------------------------------------------------------- */
  var menuBtn = document.getElementById("menu-btn");
  var siteNav = document.getElementById("site-nav");

  function closeMenu() {
    if (!siteNav || !menuBtn) return;
    siteNav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  }

  if (menuBtn && siteNav) {
    menuBtn.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    siteNav.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeMenu();
      }
    });
  }

  /* -----------------------------------------------------------------
     3. HEADER SCROLL DETECTION & READING PROGRESS BAR (rAF-throttled)
     ----------------------------------------------------------------- */
  var header = document.getElementById("site-header");
  var progressBar = document.getElementById("scroll-progress");
  var scrollTicking = false;

  var checkScroll = function () {
    var scrollY = window.scrollY || window.pageYOffset || 0;

    // Header border toggle
    if (header) {
      if (scrollY > 8) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    // Reading scroll progress indicator
    if (progressBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + "%";
    }

    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(checkScroll);
      }
    },
    { passive: true }
  );
  checkScroll();

  /* -----------------------------------------------------------------
     4. SCROLLSPY (Active Navigation Link Indicator)
     ----------------------------------------------------------------- */
  var navLinks = document.querySelectorAll(".site-nav a[href^='#']");
  var trackedSections = [];

  navLinks.forEach(function (link) {
    var hash = link.getAttribute("href");
    if (hash && hash.length > 1) {
      var targetEl = document.querySelector(hash);
      if (targetEl) {
        trackedSections.push({ element: targetEl, link: link });
      }
    }
  });

  if (trackedSections.length > 0 && "IntersectionObserver" in window) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) {
              l.classList.remove("active");
            });
            var match = trackedSections.find(function (item) {
              return item.element === entry.target;
            });
            if (match) {
              match.link.classList.add("active");
            }
          }
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );

    trackedSections.forEach(function (item) {
      spyObserver.observe(item.element);
    });
  }

  /* -----------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS
     ----------------------------------------------------------------- */
  var revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* -----------------------------------------------------------------
     6. COPY EMAIL ON CLICK (with Toast Feedback)
     ----------------------------------------------------------------- */
  var emailAction = document.getElementById("email-action");
  var toast = document.getElementById("toast");
  var toastTimer;

  function showToast(msg) {
    if (!toast) return;
    if (msg) toast.textContent = msg;
    clearTimeout(toastTimer);
    toast.classList.add("is-visible");
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  if (emailAction) {
    emailAction.addEventListener("click", function (e) {
      var emailText = "getsinghsandeep@gmail.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailText).then(function () {
          showToast("Email copied to clipboard");
        });
      } else {
        /* Fallback for environments without Clipboard API */
        var tempInput = document.createElement("textarea");
        tempInput.value = emailText;
        tempInput.style.position = "fixed";
        tempInput.style.opacity = "0";
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand("copy");
          showToast("Email copied to clipboard");
        } catch (err) {
          /* allow default mailto fallback */
        }
        document.body.removeChild(tempInput);
      }
    });
  }

  /* -----------------------------------------------------------------
     7. DYNAMIC FOOTER YEAR
     ----------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
