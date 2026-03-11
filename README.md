# 🌌 AstroDaily

**Your cosmic guide to the day ahead.** AstroDaily is a sleek, AI-powered astrology web app that delivers personalized daily horoscope readings and Vedic Kundali (birth chart) analysis — all powered by Google's Gemini API.

![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_API-2.0_Flash-4285F4?logo=google&logoColor=white)

---

## ✨ Features

### 🔮 Daily Horoscope Readings
- Select any of the **12 zodiac signs** from a beautifully designed card grid.
- Get an AI-generated daily reading with:
  - **Cosmic Insight** — a personalized daily horoscope message.
  - **Personalized Focus** — tailored advice for the day.
  - **Energy Type** — the dominant energy for your sign today.
  - **Lucky Number** — your number of the day (1–99).
  - **What to Avoid** — specific things to steer clear of.

### 🪐 Kundali (Vedic Birth Chart)
- Enter your **Name, Date of Birth, Time of Birth, and Place of Birth**.
- Receive a detailed AI-generated Kundali including:
  - ☀️ **Sun Sign**, 🌙 **Moon Sign (Rashi)**, ⬆️ **Ascendant (Lagna)**
  - 🪐 **Planetary Positions** — all 9 Vedic planets (Sun through Ketu)
  - 🧠 **Personality Traits** — based on your chart
  - 🛤️ **Life Path & Career Guidance**
  - 💪 **Strengths** & ⚡ **Challenges**

### ⚡ Smart Caching & Rate Limiting
- **Per-sign daily caching** using `localStorage`:
  - First click on a sign → fetches from Gemini API and caches.
  - Subsequent clicks (same day, even after reload) → **instant from cache, zero API calls**.
  - Next day → fresh readings, old cache auto-cleaned.
- **Kundali caching** by birth details — same inputs always return cached results.
- **Deterministic fallback** — if the API rate limit is exceeded, the app generates unique offline readings using a hash-based algorithm (no two signs ever show the same fallback).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- A [Google Gemini API Key](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Astro.git
cd Astro

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Important:** The `.env` file is listed in `.gitignore` and will **never** be committed to GitHub. Your API key stays safe.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview  # Preview the production build
```

---

## 📁 Project Structure

```
Astro/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── SignSelector.jsx     # Zodiac sign grid (home screen)
│   │   ├── SignSelector.css
│   │   ├── DailyReading.jsx     # Daily horoscope display (async)
│   │   ├── DailyReading.css
│   │   ├── KundaliForm.jsx      # Birth details input form
│   │   ├── KundaliForm.css
│   │   ├── KundaliReading.jsx   # Kundali results display
│   │   └── KundaliReading.css
│   ├── utils/
│   │   └── astrologyData.js     # Gemini API integration, caching logic
│   ├── App.jsx                  # Main app with view navigation
│   ├── index.css                # Global styles & design system
│   └── main.jsx                 # React entry point
├── .env                         # API key (git-ignored)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                  App.jsx                     │
│         (View Router / State Manager)        │
├──────────┬──────────┬───────────┬────────────┤
│  Home    │ Reading  │  Kundali  │  Kundali   │
│  View    │  View    │  Form     │  Reading   │
├──────────┴──────────┴───────────┴────────────┤
│              astrologyData.js                │
│     (Gemini API + localStorage Cache)        │
├──────────────────────────────────────────────┤
│           Google Gemini 2.0 Flash            │
└──────────────────────────────────────────────┘
```

### How Caching Works

```
User clicks Libra
    │
    ├── Cache exists for today? ──YES──► Return instantly (⚡ 0ms)
    │
    └── NO
         │
         ├── Gemini API available? ──YES──► Fetch → Cache → Return
         │
         └── NO (rate limited)
              │
              └── Generate deterministic fallback → Cache → Return
```

---

## 🎨 Design

- **Dark Theme** with deep cosmic colors (`#05050f` background)
- **Glassmorphism** cards with frosted glass effects
- **Gradient text** for headings and accent values
- **Micro-animations** — fade-ins, scale transitions, hover glow effects
- **Responsive** — works on desktop, tablet, and mobile
- **Typography** — [Outfit](https://fonts.google.com/specimen/Outfit) font family

---

## 🛡️ API Key Security

| Protection Layer | Details |
|-----------------|---------|
| `.env` file | API key stored as `VITE_GEMINI_API_KEY` |
| `.gitignore` | `.env`, `.env.local`, `.env.*.local` all ignored |
| Vite prefix | Only `VITE_` prefixed vars are exposed to the client |

> **Note:** Since this is a client-side app, the API key is visible in the browser's network requests. For production, consider proxying API calls through a backend server.

---

## 🧰 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite 7** | Build tool & dev server |
| **Google Gemini 2.0 Flash** | AI-powered readings |
| **localStorage** | Client-side caching |
| **Vanilla CSS** | Styling with CSS variables |
| **ESLint** | Code quality |

---

## 📜 License

This project is private and not licensed for redistribution.

---

Built with 💫 by **Krrish Jaidka**
