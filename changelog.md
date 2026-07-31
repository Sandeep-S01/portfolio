# Portfolio Application Notes

## Current Implementation

This portfolio is implemented as a lightweight static site with no build step. The public entry point is `index.html`, with shared styling in `style.css` and browser behavior in `script.js`.

## Site Structure

- `index.html` contains the main portfolio experience: sidebar identity area, About, Experience, Projects, Contact, social links, and resume links.
- `resume.html` contains a print-friendly HTML resume layout.
- `Resume_Sandeep.pdf` is the downloadable resume linked from the portfolio.
- `favicon.svg` provides the browser icon.

## UI And Content

- Desktop uses a sticky left sidebar with name, role, navigation, social links, and availability badge.
- Main content is organized into About, Experience, Projects, and Contact sections.
- The current visual system uses a dark navy background with cyan accents, Syne headings, DM Sans body text, and Fira Code for technical labels.
- Project cards are static HTML cards. Public GitHub builds link to their repositories; closed-source professional projects still use the GitHub profile link until dedicated public demos or case studies are available.

## JavaScript Behavior

- Highlights the active sidebar navigation item while scrolling.
- Reveals `.fade-in` elements with `IntersectionObserver`.
- Smooth-scrolls internal anchor links.
- Adds a subtle cursor glow on devices that do not request reduced motion.
- Rotates the role text in the sidebar unless reduced motion is preferred.

## Accessibility And Performance

- Icon links include `aria-label` values.
- External links use `rel="noopener noreferrer"`.
- Motion-heavy effects respect `prefers-reduced-motion`.
- The site is static and should load quickly on any static host.

## Audit-Driven Design Updates

- Increased body copy size and contrast for better scanning on laptops and mobile devices.
- Added clearer hero positioning with direct project and resume calls to action.
- Added outcome-focused About highlights for experience, domain breadth, and security-minded implementation.
- Reworked the main experience entry with proof-oriented bullets.
- Expanded project cards with Problem, Contribution, and Impact details.
- Strengthened the final contact section with a more specific hiring-oriented CTA.
- Added visible focus states and mobile-friendly full-width hero buttons.
- Added additional public GitHub projects, including Loom, Velt, AuditTrail AI, ConnectAgents, AlphaGate / Sentra, and NutriSnap.
- Updated the HTML resume with selected public GitHub projects and regenerated `Resume_Sandeep.pdf`.
- Increased A4 resume font sizes and regenerated the PDF for better print/readability.
