# 💇 GlowSuite — Salon Management SaaS Platform

![Nuxt 3](https://img.shields.io/badge/Nuxt-3.21-00DC82?style=flat-square&logo=nuxt.js)
![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vuedotjs)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-blue.style=flat-square)

**GlowSuite** is a production-grade, multi-tenant SaaS application for managing salons, barbershops, and spas. It features a modern dark-themed glassmorphic design system, an interactive staff resource calendar, automated booking conflict prevention, a customer CRM, analytics, platform super admin tenant management, and a public 5-step self-booking wizard.

---

## 🌟 Key Features

### 👑 Super Admin Platform Portal (`/admin`)
- **Global KPI Metrics**: Track platform-wide salons, active tenants, total appointments, users, and estimated revenue.
- **Tenant Management**: Provision new salon businesses, suspend/activate accounts, upgrade subscription plans.
- **⚡ One-Click Impersonation ("Login As")**: Instantly access any salon's portal as its owner for troubleshooting.
- **Subscription Tiers**: Configure Free ($0), Pro ($49/mo), and Enterprise ($149/mo) plans and resource limits.

### 💈 Salon Owner & Staff Portal (`/app`)
- **Interactive Resource Calendar (`/app/calendar`)**: Column view by staff member with 15-min time slots, drag-free appointment cards, and real-time conflict checking.
- **Service Catalog (`/app/services`)**: Categorized services with prices, durations, buffer times, and staff assignments.
- **Staff Roster & Shifts (`/app/staff`)**: Manage staff profiles, weekly work shifts (Mon-Sun), and assigned service capabilities.
- **Client CRM (`/app/clients`)**: Searchable client database tracking visit history, lifetime spend, and allergy warnings.
- **Analytics (`/app/analytics`)**: SVG revenue trend charts, appointment status breakdown, and staff performance leaderboards.

### 🌐 Public Client Booking Wizard (`/book/[slug]`)
- **Frictionless 5-Step Self-Booking**: Branch Location → Service → Specialist → Date & Slot → Contact Info.
- **No Login Required**: Instant appointment scheduling for salon clients.
- **Auto-CRM Synchronization**: Automatically creates or links customer profiles in the salon database.

---

## 📸 Tech Stack

| Layer | Technology | Description |
|:---|:---|:---|
| **Framework** | Nuxt 3.21 | Full-stack Vue 3 framework with SSR and Nitro server engine |
| **Database** | Prisma ORM & SQLite / PostgreSQL | Multi-tenant schema with composite indexes |
| **State** | Pinia | Reactive global stores for Auth, App Location, and UI |
| **Auth** | JWT + HTTP-Only Cookies | Role-based Access Control (`SUPER_ADMIN`, `OWNER`, `STAFF`) |
| **Security** | OWASP Hardened | Rate limiting, strict JWT secrets, security headers, input sanitization |
| **Testing** | Vitest | Unit test suite for auth, tokens, and logic |

---

## 🚀 Quick Start (Local Development)

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/your-username/glowsuite.git
cd glowsuite
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="glowsuite-dev-secret-change-in-production-2026"
```

### 3. Initialize Database & Seed Demo Data
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Landing Page |
|:---|:---|:---|:---|
| **Super Admin** | `admin@glowsuite.com` | `admin1234` | `http://localhost:3000/admin` |
| **Salon Owner** | `demo@glowsuite.com` | `demo1234` | `http://localhost:3000/app` |
| **Public Client** | *(No login required)* | *(N/A)* | `http://localhost:3000/book/glowsuite-demo` |

---

## ☁️ Deployment Guides

### Deploy to Render.com (1-Click Blueprint)
GlowSuite includes a pre-configured `render.yaml` Infrastructure Blueprint:
1. Push this repo to GitHub.
2. Log into **Render.com** → **New +** → **Blueprint**.
3. Select your repository. Render will automatically launch the Web Service & Managed PostgreSQL Database.

### Deploy with Docker
```bash
docker-compose up -d --build
```

---

## 🧪 Testing

Run the automated Vitest unit test suite:
```bash
npm test
```

---

## 📄 License

MIT License. Built with Nuxt 3 & Prisma.
