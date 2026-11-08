# EdVyro Full Stack Development – Task 2: Responsive Internship Board

Accessible, framework-free internship listing UI (HTML, CSS, vanilla JS).

## Features
- Semantic HTML with skip link, labelled form controls, `role="search"`, live result count
- Search (title, company, skill), work-mode select, domain chips
- Loading, empty and error states (with retry)
- Keyboard: Tab through everything, arrow keys / Home / End inside domain chips, `/` focuses search
- Responsive CSS grid (mobile, tablet, desktop), visible focus, reduced-motion support
- Data from `data/internships.json` (fictional records). Replace with EdVyro's supplied seed if needed – same fields.

## Run locally
```bash
npx serve .        # or: python3 -m http.server 8000
```
(`fetch` needs HTTP, so don't open index.html with file://)

## Deploy (GitHub Pages)
Repo → Settings → Pages → Deploy from branch → `main` / root. Submit the repo link and the Pages URL.

## Screenshots
Add `docs/mobile.png`, `docs/tablet.png`, `docs/desktop.png` here before submitting.
