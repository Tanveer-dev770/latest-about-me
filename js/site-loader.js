/* ==========================================================================
   Tanveer — Personal Portfolio
   Site content loader.
   Fetches data/site-content.json and applies it to the page so the
   index.html hardcoded content can be edited from the admin dashboard.
   Falls back silently to the hardcoded content if JSON is unavailable.
   ========================================================================== */
(function () {
  "use strict";

  var ICONS = {
    // Inline SVG bodies (paths) keyed by short name.
    github: '<path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.9c.58.11.79-.25.79-.56v-2.76c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/>',
    linkedin: '<path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z"/>',
    facebook: '<path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.09 24 18.1 24 12.07Z"/>',
    feather: '<path d="M13 2.5 3.5 12.5 12 14l1.5 8.5L23 12.5 14.5 11 13 2.5Z"/>',
    screen: '<rect x="2.5" y="4" width="19" height="13" rx="2.5"/><path d="M8 21h8M12 17v4"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 4l-3 16"/>',
    chart: '<path d="M3.5 3v13.5A1.5 1.5 0 0 0 5 18h15.5"/><path d="M7.5 13.5 11 10l3 3 5-6"/>',
    globe: '<path d="M3.5 12a8.5 8.5 0 0 1 17 0"/><path d="M3.5 12a8.5 8.5 0 0 0 17 0"/><path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4"/><circle cx="12" cy="12" r="1.8"/>',
    devices: '<rect x="2.5" y="3.5" width="14" height="13" rx="2.5"/><path d="M6.5 21h6M9.5 16.5v4.5"/><rect x="14.5" y="9" width="7" height="8.5" rx="2"/>',
    sparkles: '<path d="M12 20.5c-7 0-10.5-3-10.5-5.5C1.5 12.5 5 10 12 10s10.5 2.5 10.5 5c0 2.5-3.5 5.5-10.5 5.5Z"/><path d="M12 13.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/><path d="M7.5 16.5h.01M9.5 12.5v1M14.5 12.5v1M16.5 16.5h.01"/>',
    clipboard: '<rect x="2.5" y="6" width="14" height="10" rx="2"/><path d="M16.5 11h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2"/><path d="M8 14h8M11 6v4"/>',
    plus: '<circle cx="12" cy="12" r="9.5"/><path d="M12 8v8M8 12h8"/>',
    compass: '<circle cx="12" cy="12" r="9.5"/><path d="M12 3v18M3 12h18"/>',
    document: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    home: '<path d="M3.5 21h17M5.5 21V9.5L12 4l6.5 5.5V21"/><path d="M9.5 21v-7h5v7"/>',
    sparkle: '<circle cx="12" cy="8" r="5"/><path d="M2.5 21c.8-4 4.6-6.5 9.5-6.5s8.7 2.5 9.5 6.5"/><path d="M17 3l1 1.5L19.5 5 18 6.5 17 8l-1-1.5L13.5 5 16 4.5 17 3Z"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/>',
    chat: '<path d="M4 5h16v11h-8l-4 4v-4H4Z"/><path d="M8 9h8M8 12h5"/>',
    check: '<path d="M8 13 11 16l9-9"/><path d="M4 3h11v2H4v14h14v-8h2v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>',
    speed: '<path d="M20.5 12c0 4.7-3.8 8.5-8.5 8.5S3.5 16.7 3.5 12 7.3 3.5 12 3.5c1.4 0 2.7.3 3.9.9"/><path d="M20.5 3.5 12 12l-.4-4"/>'
  };

  function svg(name, size) {
    size = size || 24;
    return ICONS[name]
      ? '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>'
      : '';
  }

  function svgSocial(name, size) {
    size = size || 20;
    return ICONS[name]
      ? '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="currentColor" aria-hidden="true">' + ICONS[name] + '</svg>'
      : '';
  }

  function setText(sel, el, value) {
    var node = document.querySelector(sel);
    if (node) node[el === "innerHTML" ? "innerHTML" : "textContent"] = value;
    return node;
  }

  function setMeta(name, content) {
    var node = document.querySelector('meta[name="' + name + '"]');
    if (node) node.setAttribute("content", content);
  }

  function setContainer(sel, html) {
    var node = document.querySelector(sel);
    if (node) node.innerHTML = html;
    return node;
  }

  function applyHero(h) {
    setText(".hero-greeting", "innerHTML", '<span class="dot" aria-hidden="true"></span> ' + h.greeting);
    setText(".hero-title", "innerHTML", h.title);
    setText(".hero-sub", "innerHTML", h.subtitle);

    var primary = document.querySelector(".hero-actions .btn--primary");
    var secondary = document.querySelector(".hero-actions .btn--outline");
    if (primary) {
      primary.innerHTML = h.primaryCta + ' <span class="btn-arrow" aria-hidden="true">&rarr;</span>';
      primary.setAttribute("href", "#projects");
    }
    if (secondary) {
      secondary.innerHTML = h.secondaryCta + ' <span class="btn-arrow" aria-hidden="true">&darr;</span>';
      secondary.setAttribute("href", h.cvUrl || "assets/resume/cv.pdf");
      secondary.setAttribute("download", (h.cvUrl || "assets/resume/cv.pdf").split("/").pop());
    }

    var exp = document.querySelector(".hero-card--exp");
    if (exp) {
      setText(".hero-card--exp .hero-card-num", "textContent", h.experienceNum);
      setText(".hero-card--exp .hero-card-lbl", "innerHTML", h.experienceLabel);
    }
    var proj = document.querySelector(".hero-card--proj");
    if (proj) {
      setText(".hero-card--proj .hero-card-num", "textContent", h.projectsNum);
      setText(".hero-card--proj .hero-card-lbl", "innerHTML", h.projectsLabel);
    }

    var img = document.querySelector(".hero-img");
    if (img) {
      img.setAttribute("src", h.picture);
      var prev = img.previousElementSibling;
      if (prev && prev.tagName === "SOURCE") prev.remove();
    }
    var badge = document.querySelector(".hero-badge");
    if (badge && h.openToWork) badge.style.display = h.openToWork ? "" : "none";

    var social = document.querySelector(".hero-social");
    if (social && h.social) {
      var label = social.querySelector(".hero-social-label");
      social.innerHTML = '';
      if (label) social.appendChild(label);
      (h.social || []).forEach(function (s) {
        var a = document.createElement("a");
        a.href = s.url;
        a.setAttribute("aria-label", s.label || s.key);
        a.setAttribute("rel", "noopener");
        a.innerHTML = svgSocial(s.key);
        social.appendChild(a);
      });
    }
  }

  function applyAbout(a) {
    setText("#about .section-title", "textContent", a.heading);
    setText(".about-content .lead", "innerHTML", a.lead);

    if (a.downloadCv) {
      var dl = document.querySelector(".about-actions .btn--primary");
      if (dl) dl.innerHTML = a.downloadCv + ' <span class="btn-arrow" aria-hidden="true">&darr;</span>';
    }
    if (a.workTogether) {
      setText(".about-actions .btn--ghost", "textContent", a.workTogether);
    }

    var wrap = document.querySelector(".about-content");
    var lead = document.querySelector(".about-content .lead");
    if (wrap && lead && a.paragraphs) {
      // Remove existing body paragraphs (the hardcoded ones) before inserting.
      wrap.querySelectorAll("p:not(.lead)").forEach(function (p) { p.parentNode.removeChild(p); });
      lead.insertAdjacentHTML("afterend", a.paragraphs.map(function (p) { return "<p>" + p + "</p>"; }).join(""));
    }

    var tools = document.querySelector(".about-tools");
    if (tools && a.tools) {
      tools.innerHTML = a.tools.map(function (t) { return "<span>" + t + "</span>"; }).join("");
    }

    var statsEl = document.querySelector(".about-stats");
    if (statsEl && a.stats) {
      statsEl.innerHTML = a.stats.map(function (s) {
        return '<div class="stat-card"><span class="stat-num">' + s.num + '</span><span class="stat-lbl">' + s.label + '</span></div>';
      }).join("");
    }
  }

  function applyServices(s) {
    setText("#services .section-title", "textContent", s.heading);
    setText("#services .section-sub", "textContent", s.subtitle);
    if (!s.items) return;
    var html = s.items.map(function (item, i) {
      var num = String(i + 1).padStart(2, "0");
      return '<article class="service-card reveal">' +
        '<div class="service-top">' +
          '<span class="service-num">' + num + '</span>' +
          '<span class="service-icon" aria-hidden="true">' + svg(item.icon, 24) + '</span>' +
        '</div>' +
        '<h3 class="service-title">' + item.title + '</h3>' +
        '<p class="service-text">' + item.text + '</p>' +
      '</article>';
    }).join("");
    setContainer(".services-grid", html);
  }

  function applyProjects(p) {
    setText("#projects .section-title", "textContent", p.heading);
    setText("#projects .section-sub", "textContent", p.subtitle);
    if (!p.items) return;
    var html = p.items.map(function (item) {
      return '<li class="project-item reveal" data-categories="' + item.categories + '">' +
        '<article class="project-card">' +
          '<div class="project-media">' +
            '<img src="' + item.image + '" alt="Preview of the ' + item.title + ' project" loading="lazy" width="600" height="450">' +
            '<span class="project-badge">' + item.badge + '</span>' +
          '</div>' +
          '<div class="project-body">' +
            '<h3 class="project-title">' + item.title + '</h3>' +
            '<p class="project-text">' + item.summary + '</p>' +
            '<ul class="project-tags" aria-label="Technologies used">' +
              item.tags.map(function (t) { return "<li>" + t + "</li>"; }).join("") +
            '</ul>' +
            '<div class="project-actions">' +
              '<button class="project-link" type="button" data-project="' + item.id + '">View Project <span aria-hidden="true">&rarr;</span></button>' +
              (item.github ? '<a class="project-icon-link" href="' + item.github + '" aria-label="View ' + item.title + ' on GitHub" rel="noopener">' + svgSocial("github", 19) + '</a>' : '') +
            '</div>' +
          '</div>' +
        '</article>' +
      '</li>';
    }).join("");
    setContainer(".projects-grid", html);

    // Expose project modal data to main.js
    var data = {};
    p.items.forEach(function (item) {
      data[item.id] = {
        title: item.title,
        category: item.category,
        img: item.image,
        desc: item.summary,
        role: item.role,
        tools: item.tools,
        challenge: item.challenge,
        solution: item.solution,
        result: item.result,
        live: item.live,
        github: item.github
      };
    });
    window.__PORTFOLIO_DATA__ = data;
  }

  function applySkills(s) {
    setText("#skills .section-title", "textContent", s.heading);
    setText("#skills .section-sub", "textContent", s.subtitle);
    if (!s.items) return;
    var html = "";
    s.items.forEach(function (item) {
      if (item.noteTitle) {
        html += '<article class="skill-card skill-card--note reveal">' +
          '<div class="skill-card-head">' +
            '<span class="skill-icon" aria-hidden="true">' + svg("plus", 22) + '</span>' +
            '<h3>' + item.noteTitle + '</h3>' +
          '</div>' +
          '<p class="skill-note-text">' + item.noteText + '</p>' +
        '</article>';
      } else {
        html += '<article class="skill-card reveal">' +
          '<div class="skill-card-head">' +
            '<span class="skill-icon" aria-hidden="true">' + svg(item.icon, 22) + '</span>' +
            '<h3>' + item.title + '</h3>' +
          '</div>' +
          '<ul class="skill-list">' +
            item.list.map(function (li) { return "<li>" + li + "</li>"; }).join("") +
          '</ul>' +
        '</article>';
      }
    });
    setContainer(".skills-grid", html);
  }

  function applyTestimonials(t) {
    setText("#testimonials .section-title", "textContent", t.heading);
    setText("#testimonials .section-sub", "innerHTML", t.subtitle);
    if (!t.items) return;
    var star = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/></svg>';
    var html = t.items.map(function (item) {
      var stars = '';
      for (var i = 0; i < (item.rating || 5); i++) stars += star;
      var initials = (item.name || "?")[0];
      return '<article class="testimonial-card reveal">' +
        '<div class="testimonial-stars" role="img" aria-label="Rated ' + (item.rating || 5) + ' out of 5 stars">' + stars + '</div>' +
        '<blockquote><p>&quot;' + item.quote + '&quot;</p></blockquote>' +
        '<footer class="testimonial-author">' +
          '<span class="testimonial-avatar" aria-hidden="true">' + initials + '</span>' +
          '<div><strong>' + item.name + '</strong><span>' + item.role + '</span></div>' +
        '</footer>' +
      '</article>';
    }).join("");
    setContainer(".testimonials-grid", html);
  }

  function applyPricing(pr) {
    setText("#pricing .section-title", "textContent", pr.heading);
    setText("#pricing .section-sub", "innerHTML", pr.subtitle);
    if (!pr.items) return;
    var html = pr.items.map(function (item) {
      var cls = item.featured ? "pricing-card pricing-card--featured reveal" : "pricing-card reveal";
      var badge = item.featured ? '<span class="pricing-badge">Most Popular</span>' : "";
      var btn = item.featured ? "btn btn--primary pricing-cta" : "btn btn--outline pricing-cta";
      return '<article class="' + cls + '"' + (item.featured ? ' aria-label="Most popular plan"' : '') + '>' +
        badge +
        '<h3 class="pricing-name">' + item.name + '</h3>' +
        '<p class="pricing-price"><span class="pricing-cur">$</span>' + item.price + '</p>' +
        '<p class="pricing-desc">' + item.desc + '</p>' +
        '<ul class="pricing-features">' +
          item.features.map(function (f) { return "<li>" + f + "</li>"; }).join("") +
        '</ul>' +
        '<a class="' + btn + '" href="#contact">' + item.cta + '</a>' +
      '</article>';
    }).join("");
    setContainer(".pricing-grid", html);
  }

  function applyContact(c) {
    setText("#contact .section-title", "textContent", c.heading);
    setText("#contact .section-sub", "textContent", c.subtitle);

    var emailA = document.querySelector('.contact-list a[href^="mailto:"]');
    if (emailA) {
      emailA.textContent = c.email;
      emailA.setAttribute("href", "mailto:" + c.email);
    }
    var phoneA = document.querySelector('.contact-list a[href^="tel:"]');
    if (phoneA) {
      phoneA.textContent = c.phone;
      phoneA.setAttribute("href", "tel:" + (c.phoneHref || c.phone.replace(/\s/g, "")));
    }
    var valueSpans = document.querySelectorAll(".contact-list .contact-value");
    if (valueSpans.length >= 2) {
      valueSpans[0].textContent = c.location;
      valueSpans[1].textContent = c.availability;
    }
    var note = document.querySelector(".contact-note");
    if (note) {
      var strong = note.querySelector("strong");
      var p = note.querySelector("p");
      if (strong) strong.textContent = c.noteTitle;
      if (p) p.textContent = c.noteText;
    }

    // Expose form endpoint to main.js
    window.__CONTACT_CONFIG__ = {
      endpoint: c.formEndpoint || "",
      service: c.formService || ""
    };
  }

  function applyFooter(f) {
    var brand = document.querySelector(".site-footer .footer-brand p");
    if (brand && f.brandText) brand.textContent = f.brandText;

    var social = document.querySelector(".footer-social");
    if (social && f.social) {
      social.innerHTML = f.social.map(function (s) {
        return '<li><a href="' + s.url + '" aria-label="' + (s.label || s.key) + '" rel="noopener">' + svgSocial(s.key, 18) + '</a></li>';
      }).join("");
    }
  }

  function applySite(site) {
    if (!site) return;
    document.title = site.title || document.title;
    setMeta("description", site.description);
    setMeta("author", site.author);
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute("content", site.themeColor);
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", site.ogTitle);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", site.ogDescription);
    var ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", site.ogImage);

    var brands = document.querySelectorAll(".brand-name");
    if (brands.length && site.brandName) {
      brands.forEach(function (b) { b.textContent = site.brandName; });
    }
    var heroBrand = document.querySelector('.site-header .brand');
    if (heroBrand) heroBrand.setAttribute("aria-label", site.brandName + " - back to top");
    var footerBrand = document.querySelector('.site-footer .brand');
    if (footerBrand) footerBrand.setAttribute("aria-label", site.brandName + " - back to top");

    document.querySelectorAll(".footer-bottom p").forEach(function (p, i) {
      if (i === 0 && site.copyright) p.textContent = site.copyright;
    });
  }

  function applyAll(data) {
    if (data.hero) applyHero(data.hero);
    if (data.about) applyAbout(data.about);
    if (data.services) applyServices(data.services);
    if (data.projects) applyProjects(data.projects);
    if (data.skills) applySkills(data.skills);
    if (data.testimonials) applyTestimonials(data.testimonials);
    if (data.pricing) applyPricing(data.pricing);
    if (data.contact) applyContact(data.contact);
    if (data.footer) applyFooter(data.footer);
    if (data.site) applySite(data.site);

    // Re-trigger reveal for dynamically added content.
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      el.classList.add("is-visible");
    });

    // Let main.js re-bind project filters & modal data.
    document.dispatchEvent(new CustomEvent("portfolio:render"));
  }

  fetch("data/site-content.json")
    .then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(applyAll)
    .catch(function () {
      // Hardcoded content remains — nothing to do.
    });
})();