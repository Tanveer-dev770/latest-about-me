/* ==========================================================================
   Tanveer — Personal Portfolio
   Core interactions: navigation, scroll state, scrollspy, project filter,
   project modal, contact form validation, back-to-top.
   No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Helpers ---------- */
  function lockScroll(on) {
    document.body.style.overflow = on ? "hidden" : "";
  }

  function smoothScrollTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById("siteHeader");
  var onScrollState = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    backToTop.classList.toggle("is-visible", window.scrollY > 560);
  };

  /* ==========================================================================
     Mobile navigation
     ========================================================================== */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  var mobileOpen = false;

  function toggleMenu(open) {
    mobileOpen = open;
    navMenu.classList.toggle("is-open", open);
    header.classList.toggle("is-active", open);
    navToggle.setAttribute("aria-expanded", String(open));
    lockScroll(open);
  }

  navToggle.addEventListener("click", function () {
    toggleMenu(!mobileOpen);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileOpen) toggleMenu(false);
  });

  window.addEventListener("resize", function () {
    if (mobileOpen && window.innerWidth > 940) toggleMenu(false);
  });

  // Close the menu when a navigation link is selected.
  navMenu.addEventListener("click", function (e) {
    if (e.target.closest("a") && mobileOpen) toggleMenu(false);
  });

  /* ==========================================================================
     Scrollspy — highlight the section currently in view
     ========================================================================== */
  var sectionIds = ["home", "about", "services", "projects", "skills", "process", "contact"];
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var spySections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var headerOffset = 110;
  function updateSpy() {
    var pos = window.scrollY + header.offsetHeight + headerOffset;
    var current = "home";
    spySections.forEach(function (s) {
      if (pos >= s.offsetTop) current = s.id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
      current = spySections[spySections.length - 1].id;
    }
    setActive(current);
  }

  /* ==========================================================================
     Project filtering
     ========================================================================== */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
  var projectItems = Array.prototype.slice.call(document.querySelectorAll(".project-item"));

  function applyFilter(key) {
    projectItems.forEach(function (item) {
      var match = key === "all" || item.getAttribute("data-categories").split(" ").indexOf(key) !== -1;
      item.classList.remove("is-shown");
      item.classList.toggle("is-hidden", !match);
    });
    // Let hidden items leave first, then animate the remaining ones in.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        projectItems.forEach(function (item) {
          if (!item.classList.contains("is-hidden")) item.classList.add("is-shown");
        });
      });
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.classList.contains("is-active")) return;
      filterButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  /* ==========================================================================
     Project modal
     ========================================================================== */
  var modal = document.getElementById("projectModal");
  var modalDialog = modal.querySelector(".modal-dialog");
  var lastActive = null;
  var modalFocusables = null;

  var projectData = {
    p1: {
      title: "Portfolio Website",
      category: "Web Design · Development",
      img: "assets/images/project-1.jpg",
      desc: "A personal portfolio site focused on clean layout, subtle motion, and strong typography.",
      role: "Full Stack Developer",
      tools: ["HTML5", "CSS3", "JavaScript", "Figma"],
      challenge: "Build a premium, responsive personal site from scratch — no frameworks — with a fast load and easy maintenance.",
      solution: "Created a small design-system approach with CSS variables, semantic HTML, and minimal vanilla JavaScript.",
      result: "A fast, accessible portfolio that adapts cleanly from mobile to desktop and is simple to update.",
      live: "",
      github: "https://github.com/Tanveer-dev770"
    },
    p2: {
      title: "Academic Learning Platform",
      category: "UI/UX · Education",
      img: "assets/images/project-2.jpg",
      desc: "A user-focused learning interface designed around clear navigation and progress tracking.",
      role: "UI/UX Designer",
      tools: ["Figma", "Wireframing", "Prototyping", "UX Research"],
      challenge: "Design an interface that keeps learners oriented across many courses, modules, and lessons.",
      solution: "Mapped user flows first, then built a clean navigation system, progress indicators, and consistent card-based layouts.",
      result: "An intuitive, low-friction learning experience validated with a clickable prototype and usability walkthroughs.",
      live: "",
      github: "https://github.com/Tanveer-dev770"
    },
    p3: {
      title: "Data Dashboard",
      category: "Data Analysis",
      img: "assets/images/project-3.jpg",
      desc: "An interactive dashboard that turns raw metrics into clear, sharable visual stories.",
      role: "Data Analyst",
      tools: ["Excel", "Charts", "Data Cleaning", "Data Visualization"],
      challenge: "Make a large, messy dataset understandable at a glance for non-technical stakeholders.",
      solution: "Cleaned and structured the data, then chose the right chart types and highlights for each metric.",
      result: "A clear dashboard that supports quicker, more confident business decisions.",
      live: "",
      github: "https://github.com/Tanveer-dev770"
    },
    p4: {
      title: "Business Website",
      category: "Web Development",
      img: "assets/images/project-4.jpg",
      desc: "A professional company website balancing strong branding with clear user journeys.",
      role: "Designer & Developer",
      tools: ["HTML5", "CSS3", "JavaScript", "SEO"],
      challenge: "Communicate credibility while keeping the site light, fast, and easy to navigate.",
      solution: "Established a strong visual system, simplified the page structure, and optimized images and code.",
      result: "A polished online presence that loads quickly and guides visitors toward meaningful actions.",
      live: "",
      github: "https://github.com/Tanveer-dev770"
    },
    p5: {
      title: "Digital Marketing Campaign",
      category: "Digital Marketing",
      img: "assets/images/project-5.jpg",
      desc: "A focused campaign strategy with clear messaging, audience targeting, and results tracking.",
      role: "Marketing Specialist",
      tools: ["Strategy", "Social Media", "Copywriting", "Analytics"],
      challenge: "Reach the right audience with limited budget and measure what actually works.",
      solution: "Defined the audience and message, planned content across platforms, and tracked key performance metrics.",
      result: "A measurable campaign that improved reach and engagement while keeping costs controlled.",
      live: "",
      github: "https://github.com/Tanveer-dev770"
    },
    p6: {
      title: "Custom Landing Page",
      category: "UI/UX · Conversion",
      img: "assets/images/project-6.jpg",
      desc: "A conversion-focused landing page designed to guide visitors toward a single action.",
      role: "Designer & Developer",
      tools: ["HTML5", "CSS3", "Copywriting", "A/B Testing"],
      challenge: "Turn casual visitors into clear, confident action-takers without a cluttered page.",
      solution: "Kept one goal in mind, wrote benefit-led copy, and reduced every distraction outside the call to action.",
      result: "A focused landing page that improved clarity and conversion while staying fully responsive.",
      live: "",
      github: "https://github.com/Tanveer-dev770"
    }
  };

  function getFocusables() {
    return Array.prototype.slice.call(
      modalDialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.hasAttribute("disabled"); });
  }

  function openModal(id) {
    var p = projectData[id];
    if (!p) return;

    lastActive = document.activeElement;

    document.getElementById("modalMedia").src = p.img;
    document.getElementById("modalMedia").alt = "Preview of the " + p.title + " project";
    document.getElementById("modalCategory").textContent = p.category;
    document.getElementById("modalTitle").textContent = p.title;
    document.getElementById("modalDesc").textContent = p.desc;
    document.getElementById("modalRole").textContent = p.role;
    document.getElementById("modalTools").innerHTML = p.tools
      .map(function (t) { return "<span>" + t + "</span>"; })
      .join("");
    document.getElementById("modalChallenge").textContent = p.challenge;
    document.getElementById("modalSolution").textContent = p.solution;
    document.getElementById("modalResult").textContent = p.result;

    var live = document.getElementById("modalLive");
    var github = document.getElementById("modalGithub");
    live.href = p.live;
    github.href = p.github;

    modal.hidden = false;
    lockScroll(true);
    modalFocusables = getFocusables();
    (modalFocusables[0] || modalDialog).focus();
  }

  function closeModal() {
    modal.hidden = true;
    lockScroll(false);
    if (lastActive && lastActive.focus) lastActive.focus();
  }

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-modal-close")) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key === "Tab") {
      // Keep keyboard focus inside the dialog.
      var first = modalFocusables[0];
      var lastEl = modalFocusables[modalFocusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-project]");
    if (trigger) openModal(trigger.getAttribute("data-project"));
  });

  /* ==========================================================================
     Contact form validation
     To connect a real backend later, replace the submit handler body with a
     fetch() call to your email/API endpoint (e.g. Formspree, a server route),
     then use the same success/error status element below.
     ========================================================================== */
  var form = document.getElementById("contactForm");
  var formStatus = form.querySelector(".form-status");

  var fields = [
    { el: document.getElementById("cf-name"),
      error: document.getElementById("cf-name").nextElementSibling,
      validate: function (v) { return v.trim().length > 0; },
      message: "Please enter your name." },
    { el: document.getElementById("cf-email"),
      error: document.getElementById("cf-email").nextElementSibling,
      validate: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
      },
      message: "Please enter a valid email address." },
    { el: document.getElementById("cf-message"),
      error: document.getElementById("cf-message").nextElementSibling,
      validate: function (v) { return v.trim().length >= 10; },
      message: "Please write a message of at least 10 characters." }
  ];

  function showError(field, message) {
    var group = field.el.closest(".form-group");
    group.classList.add("is-error");
    field.el.setAttribute("aria-invalid", "true");
    field.error.textContent = message;
    field.error.hidden = false;
  }

  function clearError(field) {
    var group = field.el.closest(".form-group");
    group.classList.remove("is-error");
    field.el.removeAttribute("aria-invalid");
    field.error.textContent = "";
    field.error.hidden = true;
  }

  function validateField(field) {
    if (field.el.value.trim() === "") return true; // only validate non-empty on submit
    if (!field.validate(field.el.value)) {
      showError(field, field.message);
      return false;
    }
    clearError(field);
    return true;
  }

  fields.forEach(function (field) {
    field.el.addEventListener("input", function () {
      if (field.el.closest(".form-group").classList.contains("is-error")) {
        validateField(field);
      }
    });
    field.el.addEventListener("blur", function () {
      if (field.el.value.trim() !== "") validateField(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var valid = true;
    fields.forEach(function (field) {
      if (!field.validate(field.el.value)) {
        showError(field, field.message);
        valid = false;
      } else {
        clearError(field);
      }
    });

    if (!valid) {
      formStatus.textContent = "Please fix the highlighted fields above.";
      formStatus.hidden = false;
      return;
    }

    // Placeholder success state.
    formStatus.textContent = "Thanks! Your message was validated. Connect a backend or email service to send it for real.";
    formStatus.hidden = false;
    form.reset();
    form.querySelector(".form-submit").blur();
    if (reduceMotion) return;
    formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ==========================================================================
     Back to top + placeholder links
     ========================================================================== */
  var backToTop = document.getElementById("backToTop");
  backToTop.addEventListener("click", smoothScrollTop);

  // Privacy Policy and other placeholder links should not jump to the top.
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href="#"]');
    if (link) e.preventDefault();
  });

  window.addEventListener("scroll", function () {
    onScrollState();
    updateSpy();
  }, { passive: true });
  onScrollState();
  updateSpy();
})();