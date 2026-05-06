# 🍴 FridgeToFork

> **An AI-powered meal planner that solves the daily "what should I cook?" problem — just enter the ingredients you already own and get personalized recipes instantly.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai)](https://openai.com/)

---

## 🧠 The Problem

Every day, millions of people stare into their fridge not knowing what to cook — leading to food waste, last-minute takeout orders, and decision fatigue. Traditional recipe sites require you to search manually and rarely match what you actually have at home.

**FridgeToFork flips this:** you tell it what you have, and AI figures out what you can make.

---

## ✨ Features

- **AI Recipe Generation** — Enter your ingredients and get full recipes instantly via GPT-4o-mini
- **Ingredient Tag Input** — Add ingredients one by one with a clean tag-style UI
- **Dietary Preferences** — Set cuisine preferences on the dashboard to personalize results
- **Save Recipes** — Bookmark recipes to your personal collection
- **My Recipes Page** — Browse saved recipes with cuisine-based filtering
- **Weekly Meal Planner** — Assign recipes to days of the week and remove as needed
- **Shopping List** — Auto-generated shopping list based on your meal plan
- **Rate Limiting** — 10 AI generations per user per day to keep costs controlled
- **Authentication** — Secure register/login with JWT-based sessions via NextAuth v4
- **Protected Routes** — Middleware-level route protection across all authenticated pages
- **Loading Skeletons** — Skeleton loaders on every page for smooth perceived performance

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Database | MongoDB + Mongoose |
| Auth | NextAuth v4 (Credentials + JWT) |
| AI | OpenAI API — `gpt-4o-mini` |
| Styling | Tailwind CSS v3 |
| Notifications | react-hot-toast |
| Password Hashing | bcryptjs |

---

## 📁 Project Structure

```
FridgeToFork/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── (auth)/
│   │   ├── register/             # Register page
│   │   └── login/                # Login page
│   ├── dashboard/                # Ingredient input + preferences
│   ├── recipes/
│   │   └── [id]/                 # Recipe detail + save
│   ├── my-recipes/               # Saved recipes with filter
│   ├── meal-planner/             # Weekly meal planner
│   ├── shopping-list/            # Shopping list
│   └── api/
│       ├── auth/                 # NextAuth endpoints
│       ├── generate-recipes/     # OpenAI recipe generation
│       ├── recipes/              # Save / fetch recipes
│       └── meal-plan/            # Assign / remove from planner
├── components/                   # Reusable UI components
├── lib/                          # DB connection, auth config, utilities
├── models/
│   ├── User.ts
│   ├── Recipe.ts
│   └── MealPlan.ts
├── types/                        # Shared TypeScript types
└── middleware.ts                 # Route protection
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

### 1. Clone the repository

```bash
git clone https://github.com/Piyush495/FridgeToFork.git
cd FridgeToFork
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
```

> **Generate a secure `NEXTAUTH_SECRET`:**
> ```bash
> openssl rand -base64 32
> ```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment (Vercel)

1. Push the repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add all four environment variables in **Project Settings → Environment Variables**
4. Deploy — Vercel will auto-detect Next.js
5. After deployment, update `NEXTAUTH_URL` to your production URL (e.g. `https://fridgetofork.vercel.app`) and redeploy

> **MongoDB Atlas:** Make sure to allow connections from anywhere under **Network Access → 0.0.0.0/0** for Vercel deployments.

---

## 🗃 Data Models

**User** — stores hashed password, email, daily generation count + reset timestamp

**Recipe** — stores title, ingredients, steps, cuisine, cook time, linked to user

**MealPlan** — stores weekly day-to-recipe assignments per user

---

## 🔐 Authentication Flow

- Credentials-based login (email + password)
- Passwords hashed with `bcryptjs`
- Sessions managed via JWT strategy (NextAuth v4)
- All routes under `/dashboard`, `/recipes`, `/my-recipes`, `/meal-planner`, `/shopping-list` are protected at the middleware level

---

## ⚡ Rate Limiting

Each user is limited to **10 AI recipe generations per day**. The counter resets at midnight. This is enforced server-side in the `/api/generate-recipes` route to prevent API abuse and manage OpenAI costs.

---

## 🧩 Known Issues Resolved During Development

| Issue | Fix Applied |
|---|---|
| NextAuth v4 incompatibility | Downgraded Next.js 16 → 14 |
| Gemini free tier blocked in India | Switched to OpenAI API |
| Tailwind v4 breaking styles | Downgraded to Tailwind v3 |
| Turbopack infinite reload on Windows | Disabled Turbopack in dev script |
| `next.config.ts` not recognized | Renamed to `next.config.js` |
| Geist font missing in Next.js 14 | Replaced with Inter |

---

## 📄 License

MIT License — feel free to fork and build on this.

---

*Built by [Piyush Gupta](https://github.com/Piyush495)*