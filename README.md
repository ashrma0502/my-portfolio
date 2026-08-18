# Ayush Sharma — Developer Portfolio

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r185-000000?style=flat&logo=three.js&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-0055FF?style=flat&logo=framer&logoColor=white)

A dark-themed, animation-heavy personal portfolio built with **React 19**, **Vite**, **Tailwind CSS**, and **Three.js**. It features a 3D particle hero scene, a custom cursor, glassmorphism UI, buttery-smooth scrolling, and a Projects/Certificates section whose content is pulled live from a GitHub README instead of being hardcoded.

🔗 **Live Demo:** [https://ashrma0502.vercel.app](https://ashrma0502.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How Project and Certificate Data Loads](#how-project-and-certificate-data-loads)
- [Available Scripts](#available-scripts)
- [Customization Guide](#customization-guide)
- [Deployment](#deployment)
- [Connect](#connect)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

This is the personal portfolio site for **Ayush Sharma**, a B.Tech CSE (AI & ML) student at GLA University. The site introduces him as a Frontend Developer / Data Engineer / AI-ML Enthusiast / Full-Stack Developer, and showcases his projects, certifications, education, and skills, along with a working contact form.

## Features

**Design & Interaction**
- Custom animated cursor that morphs on hover over interactive elements, automatically disabled on touch devices
- Smooth, inertia-based scrolling powered by [Lenis](https://github.com/darkroomengineering/lenis)
- Glassmorphism UI (frosted-glass cards/panels) with a purple → cyan → pink gradient accent system
- Animated progress loader shown before the site reveals itself
- Scroll-triggered entrance animations throughout via Framer Motion

**3D Backgrounds (React Three Fiber)**
- Hero section: a rotating field of 5,000 particles rendered with Three.js
- Skills section: a slowly rotating, distorted wireframe sphere

**Content Sections**
| Section | What it does |
|---|---|
| Hero | Animated name/role intro, social links, resume download, CTA to Projects |
| About | Bio + "Core Expertise" tag grid |
| Projects | Filterable by type (Personal / College / Hackathon); cards expand on mobile; links to repo, live demo, frontend & backend deployments |
| Certificates | Certification/award cards linking out to certificate files or folders |
| Education | Alternating vertical timeline |
| Skills | Categorized skill tags layered over the animated 3D sphere |
| Contact | Working contact form ([Web3Forms](https://web3forms.com)) plus direct email/LinkedIn/GitHub links |

**Dynamic Content**
- Projects and Certificates are **not hardcoded** — they're fetched at runtime from a README file in a separate GitHub repository and cached per session. See [How Project and Certificate Data Loads](#how-project-and-certificate-data-loads).

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer |
| 3D / WebGL | Three.js, `@react-three/fiber`, `@react-three/drei`, `maath` |
| Animation | Framer Motion, GSAP¹ |
| Smooth Scroll | Lenis (`@studio-freight/lenis`) |
| Icons | `lucide-react`, `react-icons` |
| Forms | Web3Forms (contact form backend, no server required) |
| Linting | ESLint 10 with React / React Hooks / React Refresh plugins |

¹ GSAP is included as a dependency but isn't currently imported by any component — it's available if you want to add more advanced animations.

## Project Structure

```
My-Portfolio/
├── public/
│   └── Ayush_Sharma_Resume.pdf   # Downloadable resume (served at /Ayush_Sharma_Resume.pdf)
├── src/
│   ├── components/
│   │   ├── Cursor.jsx            # Custom animated cursor
│   │   ├── HeroScene.jsx         # 3D particle field (hero background)
│   │   ├── Loader.jsx            # Animated page-load progress screen
│   │   └── SkillsScene.jsx       # 3D distorted sphere (skills background)
│   ├── hooks/
│   │   └── useGithubReadme.js    # Loads + exposes remote project/certificate data
│   ├── lib/
│   │   ├── constants.js          # Roles, expertise, skills, education, project types
│   │   └── github.js             # Fetches & parses the remote README data
│   ├── sections/
│   │   ├── About.jsx
│   │   ├── Certificates.jsx
│   │   ├── Contact.jsx
│   │   ├── Education.jsx
│   │   ├── Hero.jsx
│   │   ├── Projects.jsx
│   │   └── Skills.jsx
│   ├── App.jsx                   # Composes sections, sets up Lenis + loader
│   ├── index.css                 # Tailwind directives + glass/gradient utilities
│   └── main.jsx                  # React entry point
├── index.html
├── package.json
├── tailwind.config.js            # Color tokens (background, primary, accent)
├── vite.config.js
├── postcss.config.js
├── eslint.config.js
└── .npmrc                        # legacy-peer-deps=true
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ and npm
- A free [Web3Forms](https://web3forms.com) access key (only required for the contact form to actually send messages)

### Installation
```bash
git clone https://github.com/ashrma0502/My-Portfolio.git
cd My-Portfolio
npm install
```
This repo ships an `.npmrc` with `legacy-peer-deps=true`, so `npm install` resolves peer-dependency mismatches from the React 19 ecosystem automatically.

### Environment Variables
Create a `.env` file in the project root:
```env
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

| Variable | Required | Description |
|---|---|---|
| `VITE_WEB3FORMS_ACCESS_KEY` | For the contact form | Access key from Web3Forms used to deliver messages submitted through the Contact section. Without a valid key the form will submit but show an error state. |

### Development
```bash
npm run dev
```
Starts the Vite dev server (default `http://localhost:5173`) with hot module replacement.

### Production Build
```bash
npm run build     # outputs to dist/
npm run preview   # optional: preview the production build locally
```

## How Project and Certificate Data Loads

Instead of hardcoding portfolio items, `src/lib/github.js` fetches the raw README of a separate data repository (`ashrma0502/My-Projects`) and extracts two JSON blocks embedded as HTML comments:

```
<!-- PROJECTS_JSON
[ ... ]
PROJECTS_JSON_END -->

<!-- CERTIFICATES_JSON
[ ... ]
CERTIFICATES_JSON_END -->
```

The result is cached in `sessionStorage` (`github_portfolio_data`) so repeat visits within the same tab don't refetch. This means content can be updated just by editing that README — no redeploy of the portfolio itself required.

Each **project** object supports:
```json
{
  "name": "Project Name",
  "type": "personal | college | hackathon",
  "description": "Short description shown on the card",
  "image": "https://... (optional)",
  "techStack": ["React", "Node.js"],
  "repo": "https://github.com/...",
  "links": {
    "live": "https://...",
    "frontend": "https://...",
    "backend": "https://..."
  }
}
```

Each **certificate** object supports:
```json
{
  "issuer": "Certificate name / issuer",
  "folder": "https://... (link to the certificate file or folder)"
}
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reloading |
| `npm run build` | Build an optimized production bundle into `dist/` |
| `npm run preview` | Serve the production build locally for a final check |
| `npm run lint` | Run ESLint across the project |

## Customization Guide

If you're adapting this as your own portfolio template:

- **Personal info, roles, skills, education** → `src/lib/constants.js`
- **Colors / theme** → `tailwind.config.js` (`background`, `primary`, `accent` tokens) and the `.glass` / `.glass-card` / `.text-gradient` utilities in `src/index.css`
- **Social links & resume** → `src/sections/Hero.jsx` and `src/sections/Contact.jsx`; swap out `public/Ayush_Sharma_Resume.pdf`
- **Projects/Certificates source** → update the `README_URL` constant in `src/lib/github.js` to point at your own data repository

## Deployment

This is a static Vite single-page app, so it deploys to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.):

1. Set the `VITE_WEB3FORMS_ACCESS_KEY` environment variable in your host's dashboard
2. Build command: `npm run build`
3. Output/publish directory: `dist`

## Connect

- **GitHub:** [github.com/ashrma0502](https://github.com/ashrma0502)
- **LinkedIn:** [linkedin.com/in/ashrma0502](https://www.linkedin.com/in/ashrma0502/)
- **Email:** ashrma0502@gmail.com

## License

No license file is currently included in this repository, so all rights are reserved by default. If you'd like to reuse this project as a template, please reach out first, or add an open-source license (e.g., MIT) to clarify usage terms.

## Acknowledgments

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Drei](https://github.com/pmndrs/drei) — React renderer and helpers for Three.js
- [Framer Motion](https://www.framer.com/motion/) — animation library
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scrolling
- [Web3Forms](https://web3forms.com) — serverless contact form backend
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
