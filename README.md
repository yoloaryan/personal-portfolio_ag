# Aryan Gupta — Personal Portfolio

A sleek, high-performance static portfolio website built entirely with **pure HTML5, CSS3, and Vanilla JavaScript**.

## 🌟 Highlights & Features
- **Zero Frameworks / Zero Dependencies**: Pure static web standards. No React, Next.js, TypeScript, or npm required.
- **Theme Switcher**: Instant switching between **Dark (🌑)**, **Light (☀️)**, and **Warm Reader (☕)** themes with persistent state in `localStorage` and zero theme flash.
- **Tactical Neural AI HUD**: Holographic HUD activated via `CMD+K` / `Ctrl+K` or the central AI Core button, featuring real-time telemetry streaming and rapid keyboard navigation.
- **Interactive Expertise Radar**: Fully responsive SVG radar visualization showcasing machine learning and software engineering capabilities with dynamic tooltip readouts.
- **Projects Filter**: Fast, animated filtering of featured engineering and data science projects by technology tag.
- **Data Science Joke Widget**: Multi-stage joke generator featuring humorous data science & developer punchlines.
- **Full-Featured About & Experience Showcase**: Detailed breakdown of education, skills, campus ambassador experience, certifications, and embedded resume viewer with PDF download.
- **Interactive Contact & Newsletter**: Responsive contact form and newsletter subscription with client-side validation and immediate feedback.

---

## 📂 Project Structure

```text
portfolio/
│
├── index.html          # Main HTML5 document
├── style.css           # Pure CSS3 styles, theme variables, and custom animations
├── script.js           # Vanilla JavaScript for theme, HUD, radar, filters & modals
│
├── assets/
│   ├── images/
│   │   └── favicon.ico # Portfolio favicon
│   ├── icons/          # SVG iconography
│   └── documents/
│       └── resume.pdf  # Downloadable PDF resume
│
└── README.md           # Documentation & deployment guide
```

---

## 🚀 Vercel Deployment Instructions

This website is a **100% static site** and requires **NO build command** and **NO output directory settings**.

### Option 1 — Deploy with GitHub + Vercel
1. Push this folder to your GitHub repository.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** → **"Project"**.
4. Import your GitHub repository.
5. In the configuration dialog:
   - **Framework Preset**: Select `Other` (or leave default).
   - **Build Command**: Leave empty / disabled.
   - **Output Directory**: Leave empty / disabled.
6. Click **Deploy**.

Your website will be live in seconds at:
```text
https://your-project.vercel.app
```

---

## 💻 Local Preview
To preview locally, open `index.html` directly in any web browser, or run a simple local web server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node (optional)
npx serve .
```
Then visit `http://localhost:8000`.
