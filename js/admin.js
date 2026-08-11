/* ==========================================================================
   Tanveer — Personal Portfolio
   Admin dashboard logic.
   Login, section-by-section content editing, and JSON file saving.
   Edits are saved to data/site-content.json.
   ========================================================================== */
(function () {
  "use strict";

  // Demo credentials (replace with real auth in production)
  var DEMO_EMAIL = "admin@example.com";
  var DEMO_PASSWORD = "portfolio2024";

  var state = {
    content: null,      // loaded site-content.json
    fileHandle: null    // File System Access API handle (if available)
  };

  /* ---------------- Schema (what each section exposes for editing) ---------------- */
  var ICONS = ["feather", "screen", "code", "chart", "globe", "devices", "sparkles", "clipboard", "plus", "compass", "document", "home", "sparkle", "eye", "chat", "check", "speed"];
  var SOCIAL_KEYS = ["github", "linkedin", "facebook"];

  var SCHEMA = {
    hero: {
      title: "Hero Section",
      fields: [
        { key: "greeting", label: "Greeting text", type: "text" },
        { key: "title", label: "Headline (HTML allowed)", type: "textarea", rows: 3 },
        { key: "subtitle", label: "Subtitle (HTML allowed)", type: "textarea", rows: 3 },
        { key: "primaryCta", label: "Primary button text", type: "text" },
        { key: "secondaryCta", label: "Secondary button text", type: "text" },
        { key: "cvUrl", label: "CV file path", type: "text" },
        { key: "experienceNum", label: "Experience number", type: "text" },
        { key: "experienceLabel", label: "Experience label (HTML)", type: "text" },
        { key: "projectsNum", label: "Projects number", type: "text" },
        { key: "projectsLabel", label: "Projects label (HTML)", type: "text" },
        { key: "picture", label: "Profile image path", type: "text" }
      ],
      arrays: [
        {
          key: "social", label: "Social links", fields: [
            { key: "key", label: "Icon", type: "select", options: SOCIAL_KEYS },
            { key: "label", label: "Label (aria)", type: "text" },
            { key: "url", label: "URL", type: "text" }
          ]
        }
      ]
    },
    about: {
      title: "About Section",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "lead", label: "Lead paragraph (HTML)", type: "textarea", rows: 3 },
        { key: "downloadCv", label: "Download button text", type: "text" },
        { key: "workTogether", label: "Work-together button text", type: "text" }
      ],
      lists: [
        { key: "paragraphs", label: "Body paragraphs (one per line)", type: "lines" },
        { key: "tools", label: "Tools (one per line)", type: "lines" }
      ],
      arrays: [
        {
          key: "stats", label: "Stats", fields: [
            { key: "num", label: "Number", type: "text" },
            { key: "label", label: "Label", type: "text" }
          ]
        }
      ]
    },
    services: {
      title: "Services",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "textarea", rows: 2 }
      ],
      arrays: [
        {
          key: "items", label: "Service cards", fields: [
            { key: "icon", label: "Icon", type: "select", options: ["feather", "screen", "code", "chart", "globe", "devices"] },
            { key: "title", label: "Title", type: "text" },
            { key: "text", label: "Description", type: "textarea", rows: 2 }
          ]
        }
      ]
    },
    projects: {
      title: "Projects",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "textarea", rows: 2 }
      ],
      arrays: [
        {
          key: "items", label: "Projects", fields: [
            { key: "id", label: "ID (p1, p2 …)", type: "text", listValue: true },
            { key: "title", label: "Title", type: "text" },
            { key: "badge", label: "Badge", type: "text" },
            { key: "categories", label: "Filter categories (space-separated)", type: "text" },
            { key: "image", label: "Image path", type: "text" },
            { key: "summary", label: "Summary", type: "textarea", rows: 2 },
            { key: "category", label: "Modal category", type: "text" },
            { key: "role", label: "Modal role", type: "text" },
            { key: "challenge", label: "Challenge", type: "textarea", rows: 2 },
            { key: "solution", label: "Solution", type: "textarea", rows: 2 },
            { key: "result", label: "Result", type: "textarea", rows: 2 },
            { key: "live", label: "Live demo URL", type: "text" },
            { key: "github", label: "GitHub URL", type: "text" },
            { key: "tags", label: "Tags (one per line)", type: "lines" },
            { key: "tools", label: "Tools (one per line)", type: "lines" }
          ]
        }
      ]
    },
    skills: {
      title: "Skills",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "textarea", rows: 2 }
      ],
      arrays: [
        {
          key: "items", label: "Skill cards (last card = note card)", fields: [
            { key: "icon", label: "Icon", type: "select", options: ["sparkles", "code", "chart", "clipboard", "globe", "plus"] },
            { key: "title", label: "Title", type: "text" },
            { key: "list", label: "Items (one per line)", type: "lines" },
            { key: "noteTitle", label: "Note card title (optional)", type: "text" },
            { key: "noteText", label: "Note card text (optional)", type: "textarea", rows: 2 }
          ]
        }
      ]
    },
    testimonials: {
      title: "Testimonials",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "subtitle", label: "Subtitle (HTML)", type: "textarea", rows: 2 }
      ],
      arrays: [
        {
          key: "items", label: "Testimonials", fields: [
            { key: "quote", label: "Quote", type: "textarea", rows: 4 },
            { key: "name", label: "Name", type: "text" },
            { key: "role", label: "Role / Company", type: "text" },
            { key: "rating", label: "Rating (1–5)", type: "number" }
          ]
        }
      ]
    },
    pricing: {
      title: "Pricing",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "subtitle", label: "Subtitle (HTML)", type: "textarea", rows: 2 }
      ],
      arrays: [
        {
          key: "items", label: "Plans", fields: [
            { key: "name", label: "Plan name", type: "text" },
            { key: "price", label: "Price", type: "text" },
            { key: "desc", label: "Description", type: "textarea", rows: 2 },
            { key: "featured", label: "Featured (most popular)", type: "checkbox" },
            { key: "cta", label: "Button text", type: "text" },
            { key: "features", label: "Features (one per line)", type: "lines" }
          ]
        }
      ]
    },
    contact: {
      title: "Contact",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "textarea", rows: 2 },
        { key: "email", label: "Email address", type: "text" },
        { key: "phone", label: "Phone (display)", type: "text" },
        { key: "phoneHref", label: "Phone (tel: value)", type: "text" },
        { key: "location", label: "Location", type: "text" },
        { key: "availability", label: "Availability", type: "text" },
        { key: "noteTitle", label: "Note title", type: "text" },
        { key: "noteText", label: "Note text", type: "textarea", rows: 2 },
        { key: "formEndpoint", label: "Form endpoint URL (Formspree / EmailJS / API)", type: "text" },
        { key: "formService", label: "Form service name", type: "text" }
      ]
    },
    site: {
      title: "Site Settings",
      fields: [
        { key: "title", label: "Page title", type: "text" },
        { key: "description", label: "Meta description", type: "textarea", rows: 2 },
        { key: "author", label: "Author", type: "text" },
        { key: "themeColor", label: "Theme color", type: "text" },
        { key: "ogTitle", label: "Open Graph title", type: "text" },
        { key: "ogDescription", label: "Open Graph description", type: "textarea", rows: 2 },
        { key: "ogImage", label: "Open Graph image path", type: "text" },
        { key: "brandName", label: "Brand name", type: "text" },
        { key: "copyright", label: "Copyright line", type: "text" }
      ]
    }
  };

  /* Tabs shown on the dashboard. "settings" maps to the site object in JSON. */
  var TAB_MAP = {
    hero: "hero",
    about: "about",
    services: "services",
    projects: "projects",
    skills: "skills",
    testimonials: "testimonials",
    pricing: "pricing",
    contact: "contact",
    settings: "site"
  };

  /* ---------------- DOM refs ---------------- */
  var loginView, dashboardView, editorView;
  var loginForm, loginError, loginSuccess, logoutBtn, logoutBtn2;
  var editorTitle, editorForm, tabs;

  function dom() {
    loginView = document.getElementById("loginView");
    dashboardView = document.getElementById("dashboardView");
    editorView = document.getElementById("editorView");
    loginForm = document.getElementById("loginForm");
    loginError = document.getElementById("loginError");
    loginSuccess = document.getElementById("loginSuccess");
    logoutBtn = document.getElementById("logoutBtn");
    logoutBtn2 = document.getElementById("logoutBtn2");
    editorTitle = document.getElementById("editorTitle");
    editorForm = document.getElementById("editorForm");
    tabs = Array.prototype.slice.call(document.querySelectorAll(".tab-link"));
  }

  /* ---------------- Auth ---------------- */
  function showError(msg) { loginError.textContent = msg; loginError.hidden = false; loginSuccess.hidden = true; }
  function showSuccess(msg) { loginSuccess.textContent = msg; loginSuccess.hidden = false; loginError.hidden = true; }
  function hideAlerts() { loginError.hidden = true; loginSuccess.hidden = true; }

  function showDashboard() {
    loginView.style.display = "none";
    dashboardView.style.display = "block";
    editorView.style.display = "none";
    renderTab();
  }

  function showEditor() {
    loginView.style.display = "none";
    dashboardView.style.display = "none";
    editorView.style.display = "block";
  }

  function doLogin(email, password) {
    hideAlerts();
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      showSuccess("Signing in...");
      setTimeout(function () {
        sessionStorage.setItem("adminAuth", "true");
        showDashboard();
      }, 400);
    } else {
      showError("Invalid email or password. Demo: admin@example.com / portfolio2024");
    }
  }

  function doLogout() {
    sessionStorage.removeItem("adminAuth");
    editorView.style.display = "none";
    dashboardView.style.display = "none";
    loginView.style.display = "block";
    loginForm.reset();
    hideAlerts();
  }

  /* ---------------- Loading content ---------------- */
  function loadContent(done) {
    var msg = document.getElementById("loadStatus");
    fetch("data/site-content.json")
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(function (data) {
        state.content = data;
        if (msg) msg.style.display = "none";
        renderTab();
        done && done();
      })
      .catch(function () {
        if (msg) {
          msg.style.display = "block";
          msg.textContent = "Could not load data/site-content.json. Serve the site over HTTP (e.g. npx serve .) — file:// will not work.";
        }
      });
  }

  /* ---------------- Tab navigation ---------------- */
  function renderTab() {
    tabs.forEach(function (t) {
      var isActive = t.getAttribute("data-tab") === currentTab;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", String(isActive));
    });
  }

  var currentTab = "hero";

  function switchTab(key) {
    currentTab = key;
    renderTab();
    if (state.content) buildEditor(key);
  }

  /* ---------------- Schema utilities ---------------- */
  function blankFor(fields) {
    var obj = {};
    fields.forEach(function (f) {
      if (f.type === "lines") obj[f.key] = [];
      else if (f.type === "checkbox") obj[f.key] = false;
      else if (f.type === "number") obj[f.key] = 5;
      else obj[f.key] = "";
    });
    return obj;
  }

  function fieldHtml(f, value) {
    var extra = "data-sc" + Math.floor(Math.random() * 1e9);
    var id = "f-" + f.key;
    var label = '<label for="' + id + '">' + f.label + "</label>";
    var control;
    if (f.type === "textarea" || f.type === "lines") {
      var rows = f.rows || 3;
      var linesVal = f.type === "lines" ? (value || []).join("\n") : value;
      control = '<textarea class="admin-input" id="' + id + '" rows="' + rows + '" data-key="' + f.key + '" data-kind="' + f.type + '"></textarea>';
      // Set value after insertion to avoid escaping issues with quotes in content.
      return '<div class="form-group"><div class="admin-grow" data-put="' + extra + '">' + label + control + "</div></div>";
    }
    if (f.type === "select") {
      var opts = f.options.map(function (o) {
        return '<option value="' + o + '"' + (o === value ? " selected" : "") + ">" + o + "</option>";
      }).join("");
      control = '<select class="admin-input" id="' + id + '" data-key="' + f.key + '" data-kind="select">' + opts + "</select>";
    } else if (f.type === "checkbox") {
      control = '<input class="admin-check" type="checkbox" id="' + id + '" data-key="' + f.key + '" data-kind="checkbox">';
    } else if (f.type === "number") {
      control = '<input class="admin-input" type="number" min="1" max="5" id="' + id + '" data-key="' + f.key + '" data-kind="attr" data-attr="value">';
    } else {
      control = '<input class="admin-input" type="text" id="' + id + '" data-key="' + f.key + '" data-kind="attr" data-attr="value">';
    }
    return '<div class="form-group"><label for="' + id + '">' + f.label + "</label>" + control + "</div>";
  }

  /* ---------------- Editor builder ---------------- */
  function buildEditor(key) {
    var sectionKey = TAB_MAP[key] || key;
    var info = SCHEMA[sectionKey];
    if (!info) return;
    editorTitle.textContent = info.title;
    editorForm.innerHTML = "";
    var sectionData = state.content[sectionKey] || {};

    // Simple fields
    var fieldsHtml = "";
    (info.fields || []).forEach(function (f) {
      fieldsHtml += fieldHtml(f, sectionData[f.key]);
    });
    if (fieldsHtml) {
      var el = document.createElement("div");
      el.className = "editor-block";
      el.innerHTML = '<h3 class="editor-block-title">Options</h3>' + fieldsHtml;
      editorForm.appendChild(el);
      // Fill textarea values (created empty to avoid HTML-escaping issues).
      el.querySelectorAll("[data-put]").forEach(function (g) {
        var ta = g.querySelector("textarea");
        var v = sectionData[ta.getAttribute("data-key")];
        if (ta.getAttribute("data-kind") === "lines") {
          ta.value = (v || []).join("\n");
        } else {
          ta.value = v || "";
        }
      });
    }

    // One-per-line list fields (nested under section, e.g. about.paragraphs)
    (info.lists || []).forEach(function (listField) {
      var el = document.createElement("div");
      el.className = "editor-block";
      var value = sectionData[listField.key] || [];
      el.innerHTML = '<h3 class="editor-block-title">' + listField.label + "</h3>" +
        '<p class="editor-hint">One item per line</p>' +
        '<textarea class="admin-input admin-lines" data-listkey="' + listField.key + '" rows="5">' + (value || []).join("\n") + "</textarea>";
      editorForm.appendChild(el);
    });

    // Repeating object arrays (nested under section, e.g. services.items)
    (info.arrays || []).forEach(function (arr) {
      var wrap = document.createElement("div");
      wrap.className = "editor-block";
      wrap.innerHTML = '<div class="editor-block-head"><h3 class="editor-block-title">' + arr.label + '</h3>' +
        '<button type="button" class="btn btn--outline btn--sm" data-add="' + arr.key + '">Add</button></div>' +
        '<div data-arraylist="' + arr.key + '"></div>';
      editorForm.appendChild(wrap);
      renderArray(wrap, arr, sectionKey);
    });

    // Save bar
    var bar = document.createElement("div");
    bar.className = "editor-savebar";
    bar.innerHTML =
      '<button type="button" class="btn btn--ghost" id="backBtn">← Back</button>' +
      '<button type="button" class="btn btn--primary" id="saveBtn">Save Changes</button>' +
      '<span id="saveStatus" role="status" aria-live="polite"></span>';
    editorForm.appendChild(bar);
  }

  function renderArray(wrap, arr, sectionKey) {
    var sectionData = state.content[sectionKey] || {};
    var listEl = wrap.querySelector('[data-arraylist="' + arr.key + '"]');
    var items = sectionData[arr.key] || [];
    listEl.innerHTML = "";
    items.forEach(function (item, idx) {
      var card = document.createElement("div");
      card.className = "array-card";
      var head = document.createElement("div");
      head.className = "array-card-head";
      head.innerHTML = '<span class="array-card-num">' + (idx + 1) + "</span>" +
        '<button type="button" class="btn btn--outline btn--sm array-remove" data-remove="' + idx + '">Remove</button>';
      card.appendChild(head);
      arr.fields.forEach(function (f) {
        var val = item[f.key];
        if (f.type === "lines") {
          var el2 = document.createElement("div");
          el2.className = "form-group";
          el2.innerHTML = '<label>' + f.label + '</label><textarea class="admin-input admin-lines" data-arraykey="' + arr.key + '" data-field="' + f.key + '" data-type="lines" rows="' + (f.rows || 3) + '">' + (val || []).join("\n") + "</textarea>";
          card.appendChild(el2);
        } else if (f.type === "checkbox") {
          var el3 = document.createElement("div");
          el3.className = "form-group";
          el3.innerHTML = '<label class="admin-check-label"><input type="checkbox" class="admin-check" data-arraykey="' + arr.key + '" data-field="' + f.key + '" data-type="checkbox"' + (val ? " checked" : "") + "> " + f.label + "</label>";
          card.appendChild(el3);
        } else if (f.type === "select") {
          var opts = f.options.map(function (o) {
            return '<option value="' + o + '"' + (o === val ? " selected" : "") + ">" + o + "</option>";
          }).join("");
          var el4 = document.createElement("div");
          el4.className = "form-group";
          el4.innerHTML = '<label>' + f.label + '</label><select class="admin-input" data-arraykey="' + arr.key + '" data-field="' + f.key + '" data-type="attr">' + opts + "</select>";
          card.appendChild(el4);
        } else {
          var tag = f.type === "number" ? "number" : "text";
          var el5 = document.createElement("div");
          el5.className = "form-group";
          el5.innerHTML = '<label>' + f.label + '</label><input class="admin-input" type="' + tag + '" value="' + (val || "") + '" data-arraykey="' + arr.key + '" data-field="' + f.key + '" data-type="attr">';
          card.appendChild(el5);
        }
      });
      listEl.appendChild(card);
    });

    // Bind add/remove (clear previous listeners by cloning not needed; re-render replaces nodes)
    var addBtn = wrap.querySelector('[data-add="' + arr.key + '"]');
    addBtn.onclick = null;
    addBtn.addEventListener("click", function () {
      var arrData = state.content[sectionKey][arr.key] || [];
      arrData.push(blankFor(arr.fields));
      state.content[sectionKey][arr.key] = arrData;
      renderArray(wrap, arr, sectionKey);
    });

    var removes = listEl.querySelectorAll(".array-remove");
    Array.prototype.forEach.call(removes, function (btn) {
      btn.addEventListener("click", function () {
        var idx = Number(btn.getAttribute("data-remove"));
        var arrData = state.content[sectionKey][arr.key] || [];
        arrData.splice(idx, 1);
        state.content[sectionKey][arr.key] = arrData;
        renderArray(wrap, arr, sectionKey);
      });
    });
  }

  /* ---------------- Collect values back into state ---------------- */
  function readScalar(el, key, target) {
    var kind = el.getAttribute("data-kind");
    if (kind === "attr") target[key] = el.value;
    else if (kind === "select") target[key] = el.value;
    else if (kind === "checkbox") target[key] = el.checked;
    else if (kind === "textarea") target[key] = el.value;
    else if (kind === "lines") target[key] = el.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function collectEditor(key) {
    var sectionKey = TAB_MAP[key] || key;
    if (!state.content[sectionKey]) state.content[sectionKey] = {};

    // Simple scalar fields
    editorForm.querySelectorAll(".editor-block .form-group [data-key]").forEach(function (el) {
      readScalar(el, el.getAttribute("data-key"), state.content[sectionKey]);
    });

    // One-per-line lists at section level (e.g. about.paragraphs, about.tools)
    editorForm.querySelectorAll("textarea[data-listkey]").forEach(function (el) {
      var lines = el.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
      state.content[sectionKey][el.getAttribute("data-listkey")] = lines;
    });

    // Array groups (nested under section, e.g. services.items)
    editorForm.querySelectorAll("[data-arraylist]").forEach(function (listEl) {
      var arrayKey = listEl.getAttribute("data-arraylist");
      var cards = listEl.querySelectorAll(".array-card");
      if (!state.content[sectionKey][arrayKey]) state.content[sectionKey][arrayKey] = [];
      var out = [];
      Array.prototype.forEach.call(cards, function (card) {
        var obj = {};
        Array.prototype.forEach.call(card.querySelectorAll("[data-field]"), function (el) {
          var fld = el.getAttribute("data-field");
          var type = el.getAttribute("data-type");
          if (type === "lines") obj[fld] = el.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
          else if (type === "checkbox") obj[fld] = el.checked;
          else if (type === "attr" && el.value !== "") obj[fld] = el.value;
          else if (type === "text" && el.value !== "") obj[fld] = el.value;
        });
        out.push(obj);
      });
      state.content[sectionKey][arrayKey] = out;
    });
  }

  function serialize() {
    // Prune empty keys added by blankFor so saved JSON stays clean.
    var cloned = JSON.parse(JSON.stringify(state.content));
    (function prune(o) {
      if (Array.isArray(o)) { o.forEach(prune); return; }
      if (o && typeof o === "object") {
        Object.keys(o).forEach(function (k) {
          var v = o[k];
          if (v === "" || v === null || (Array.isArray(v) && v.length === 0)) delete o[k];
          else prune(v);
        });
      }
    })(cloned);
    return JSON.stringify(cloned, null, 2);
  }

  /* ---------------- Saving ---------------- */
  function saveStatus(msg, isError) {
    var s = document.getElementById("saveStatus");
    if (s) {
      s.textContent = msg;
      s.classList.toggle("is-error", !!isError);
    }
  }

  function downloadJson(text) {
    var blob = new Blob([text], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "site-content.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
  }

  function saveToFile(text) {
    // Prefer the modern File System Access API (Chrome/Edge, HTTPS or localhost).
    if (window.showSaveFilePicker) {
      var pick = state.fileHandle
        ? Promise.resolve(state.fileHandle)
        : window.showSaveFilePicker({
            suggestedName: "site-content.json",
            types: [{ description: "JSON", accept: { "application/json": [".json"] } }]
          });
      pick
        .then(function (handle) {
          state.fileHandle = handle;
          return handle.createWritable();
        })
        .then(function (writable) {
          return writable.write(text).then(function () { return writable.close(); });
        })
        .then(function () {
          saveStatus("Saved to site-content.json ✓");
        })
        .catch(function (err) {
          // Under file:// or non-secure contexts the picker is unavailable — fall back.
          if (err && err.name === "AbortError") return;
          saveStatus("Direct save unavailable — downloaded file instead.", true);
          downloadJson(text);
        });
    } else {
      saveStatus("Downloading site-content.json — replace the file in data/ with this.", true);
      downloadJson(text);
    }
  }

  /* ---------------- Events ---------------- */
  function bind() {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      doLogin(loginForm.email.value.trim(), loginForm.password.value);
    });
    logoutBtn.addEventListener("click", doLogout);
    if (logoutBtn2) logoutBtn2.addEventListener("click", doLogout);

    // Dashboard cards open editors
    dashboardView.addEventListener("click", function (e) {
      var card = e.target.closest("[data-section]");
      if (card) {
        if (!state.content) {
          alert("Content not loaded yet — please refresh after the page loads.");
          return;
        }
        showEditor();
        switchTab(card.getAttribute("data-section"));
      }
    });

    editorForm.addEventListener("click", function (e) {
      if (e.target.closest("#backBtn")) {
        showDashboard();
      } else if (e.target.closest("#saveBtn")) {
        collectEditor(currentTab);
        saveToFile(serialize());
      }
    });

    // Tab bar
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        switchTab(t.getAttribute("data-tab"));
      });
    });
  }

  function init() {
    dom();
    bind();
    if (sessionStorage.getItem("adminAuth") === "true") {
      showDashboard();
    } else {
      loginView.style.display = "block";
    }
    loadContent(function () {});
  }

  document.addEventListener("DOMContentLoaded", init);
})();