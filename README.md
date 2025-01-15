# ExpensePad — NestJS + Next.js Expense Tracker

![NestJS](https://img.shields.io/badge/NestJS-11.1-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.1-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack expense tracker built with NestJS, Next.js, PostgreSQL, and Prisma. Track expenses by category, visualize monthly spending with charts, and manage your budget with JWT-authenticated accounts.

![ExpensePad Screenshot](docs/images/screenshot.png)

---

## Features

- **JWT Authentication** — register, login, persistent sessions via localStorage and cookie
- **Expense CRUD** — add, edit, and delete expenses with amount, description, date, and category
- **Dashboard** — monthly spending total, category breakdown chart, and 5 most recent expenses
- **Filters & Pagination** — filter expenses by category and date range, paginated list
- **7 Predefined Categories** — Food, Transport, Shopping, Health, Entertainment, Bills, Other
- **Protected Routes** — unauthenticated users are redirected to `/login`
- **Responsive UI** — Tailwind CSS v4, works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS 11.1, TypeScript 5.9 |
| ORM | Prisma 7.4 |
| Database | PostgreSQL 17 |
| Auth | JWT, Passport, bcrypt |
| Frontend | Next.js 16.1 (App Router), React 19.2 |
| CSS | Tailwind CSS v4 |
| Forms | Zod 4.3 + React Hook Form 7.71 |
| Charts | Recharts 3.7 |
| HTTP Client | Axios 1.13 |

---

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # User, Category, Expense models
│   │   └── seed.ts              # Demo user + current-month expenses
│   ├── src/
│   │   ├── auth/                # JWT auth, guards, strategy, DTOs
│   │   ├── users/               # User lookup and creation
│   │   ├── categories/          # 7 predefined categories, auto-seeded on startup
│   │   ├── expenses/            # Expense CRUD with pagination and filters
│   │   └── dashboard/           # Monthly total, by-category breakdown, recent 5
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/              # Login and register pages
│   │   └── (dashboard)/         # Dashboard and expenses pages
│   ├── components/
│   │   ├── ui/                  # Shared primitives: Input, Select, Button, FormField
│   │   ├── ExpenseTable.tsx
│   │   ├── ExpenseModal.tsx
│   │   └── CategoryChart.tsx
│   ├── context/                 # AuthContext (global auth state)
│   ├── lib/                     # Axios instance, token helpers
│   ├── .env.example
│   └── package.json
│
├── docs/images/                 # Screenshots
├── docker-compose.yml           # PostgreSQL 17 via Docker
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js 20+ (tested on 24.13.0)](https://nodejs.org)
- [Docker](https://www.docker.com) — for PostgreSQL (or PostgreSQL installed locally)

### 1. Clone the repository

```bash
git clone https://github.com/saadshahidit/expense-pad.git
cd expense-pad
```

---

### 2. Set up environment variables

**backend/.env:**

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expense_pad
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
```

**frontend/.env.local:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start PostgreSQL

**Option A — Docker (recommended):**

```bash
docker compose up -d
```

**Option B — Local PostgreSQL:** Make sure PostgreSQL is running locally or use a [Supabase](https://supabase.com) connection string in `backend/.env`.

### 4. Install dependencies and start

```bash
# Backend
cd backend
npm install
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expense_pad npx prisma db push
npm run start:dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 5. Seed demo data (optional)

```bash
cd backend && npm run seed
```

> Demo login — `demo@expensepad.com` / `password123`

Open `http://localhost:3000` in your browser.

---

## API Reference

### Auth — `/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user, returns JWT + user |
| POST | `/login` | Login, returns JWT + user |

### Categories — `/categories` (auth required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all categories |

### Expenses — `/expenses` (auth required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List expenses (page, limit, categoryId, from, to) |
| POST | `/` | Create an expense |
| PATCH | `/:id` | Update expense (owner only) |
| DELETE | `/:id` | Delete expense (owner only) |

### Dashboard — `/dashboard` (auth required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Monthly total, by-category breakdown, recent 5 expenses |

---

## Deployment

| Part | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [Supabase](https://supabase.com) |

When deploying, set the environment variables on each platform:
- On Render: set `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`
- On Vercel: set `NEXT_PUBLIC_API_URL` to your live Render backend URL (e.g. `https://your-app.onrender.com`)

---

## License

MIT
