# [YOUR NAME] — Personal Portfolio

A premium, fully responsive single-page portfolio built with **HTML5, CSS3, and vanilla JavaScript** — no frameworks, no libraries, no plugins.

## Quick start

Open `index.html` in a browser (double-click, or serve locally):

```bash
npx serve .        # or: python -m http.server
```

## Structure

```
.
├── index.html          # Single-page portfolio with anchor navigation
├── css/
│   ├── style.css       # Design tokens + all component styles
│   └── responsive.css  # Breakpoint overrides (320px → 1440px+)
├── js/
│   ├── main.js         # Nav, scrollspy, filter, modal, form, back-to-top
│   └── animations.js   # IntersectionObserver scroll reveals
└── assets/
    ├── images/         # placeholder.jpg + 6 project previews
    ├── icons/          # favicon.svg
    └── resume/         # YOUR-NAME-CV.pdf (placeholder)
```

## Customize before publishing

Everything is clearly marked with `[PLACEHOLDER]`:

| Find | Replace with |
| --- | --- |
| `[YOUR NAME]` | Your name |
| `[YOUR ROLE]` | e.g. Web Designer & Developer |
| `your@email.com`, `tel:+880XXXXXXXXXX` | Contact details |
| `[YOUR-GITHUB]`, `[YOUR-LINKEDIN]`, `[YOUR-FACEBOOK]`, `[YOUR-INSTAGRAM]` | Profile URLs |
| `[YOUR-DOMAIN]` | Your live site URL |
| `XX+` / `XX` / `XX%` in About | Real numbers (not fabricated) |
| `assets/images/profile.jpg` | Your real photo (keep the filename) |
| `assets/images/project-*.jpg` | Real project screenshots |
| `assets/resume/YOUR-NAME-CV.pdf` | Your real CV (keep the filename) |
| Testimonials & pricing | Real feedback and rates |

To remove a section (e.g. Pricing), delete its `<section id="...">` block in `index.html`.

## Form backend

The contact form currently **validates client-side only** and shows a success message.
To actually send messages, connect any email/API endpoint (Formspree, EmailJS, your server) by replacing the submit handler in `js/main.js` — the success/error status element is already wired up.

## Accessibility & performance

- Semantic HTML5, one `h1`, meaningful heading hierarchy
- Keyboard-friendly nav, focus trap in the modal, `aria-*` attributes throughout
- Visible `:focus-visible` states and WCAG-oriented contrast (teal-700 on white)
- Respects `prefers-reduced-motion`
- Lazy-loaded images, no libraries, `defer`ed scripts, zero horizontal overflow

## Interaction checklist

- [x] Sticky nav + glass effect on scroll
- [x] Mobile hamburger menu with scroll lock & auto-close
- [x] Scrollspy active-section indicator
- [x] Project filtering (no page reload)
- [x] Accessible project modal (ESC / overlay close, focus restore, scroll lock)
- [x] Contact form validation with error + success states
- [x] Scroll-reveal animations and back-to-top button