# Smart To-Do Project Documentation

## 📌 Project Overview
**Smart To-Do** is a full-stack, role-based task management application built with Next.js (App Router), TypeScript, Tailwind CSS, MongoDB, and NextAuth.

It supports two user roles:
- **USER**: can register, log in, and manage their personal todos.
- **ADMIN**: can view users, activate/deactivate accounts, and view platform statistics.

The app enforces authentication, authorization, and data isolation between users. It is designed for both development and production (deployed on Vercel with MongoDB Atlas or local MongoDB).

---

## 🎯 Product Requirements (PRD)
*Purpose & Vision*: Build a secure, role-based To-Do web application demonstrating authentication, RBAC, scalable architecture, and clean UI/UX.

**Primary Goals**
- User registration/login
- Personal todo CRUD operations
- Admin dashboard and user management
- Clean UI & responsive design

**User Roles & Permissions**
- **Normal User**: manage own todos, access user dashboard, cannot access admin features.
- **Admin**: manage users, view stats, access admin dashboard.

**Pages & Features**
- `/`: homepage with explanation and navigation
- `/register`: signup form
- `/login`: signin form
- `/dashboard`: user todos
- `/admin/dashboard`: admin overview
- `/admin/users`: manage users

**Data Models**
```
User: { id, name, email, password (hashed), role, isActive, createdAt }
Todo: { id, title, completed, userId, createdAt }
```

**Security**
- Password hashing (bcrypt)
- Session-based auth (NextAuth)
- Role-based middleware
- Environment variables for secrets
- Ownership checks on todos

**Non-goals**: social login, email verification, password reset, notifications, real-time.

---

## ⚙️ Technical Requirements (TRD)
**Architecture**: Full-stack, serverless with Next.js App Router. Separation of routing, components, server logic, and utilities.

**Technology Stack**
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: NextAuth, API Routes, Server Actions
- Database: MongoDB with Mongoose
- Deployment: Vercel (or local)

**Project Structure**
```
src/
 ├── app/                      # routes and layouts
 │   ├── (public)/page.tsx     # homepage
 │   ├── (auth)/login,...      # auth pages
 │   ├── (user)/dashboard      # user area
 │   ├── (admin)/admin/...     # admin area
 │   ├── api/
 │   │   ├── auth/[...nextauth]/route.ts
 │   │   ├── todos/route.ts
 │   │   └── admin/users/route.ts
 │   ├── layout.tsx
 │   └── globals.css
 ├── components/
 │   ├── ui/                   # Button, Input
 │   ├── layout/               # Header, Footer
 │   └── todo/                 # TodoItem, TodoList
 ├── lib/
 │   ├── db.ts                 # Mongo connection
 │   ├── auth.ts               # NextAuth config + helper
 │   └── permissions.ts        # role checks
 ├── models/
 │   ├── User.ts
 │   └── Todo.ts
 ├── actions/
 │   ├── auth.actions.ts       # register
 │   ├── todo.actions.ts
 │   └── admin.actions.ts
 └── types/                    # TS interfaces
     ├── user.ts
     └── todo.ts
```

**Middleware** (`middleware.ts`)
- Redirects unauthorized access
- Works now only for static checks; page components enforce auth

**Authentication & Authorization**
- Credentials provider via NextAuth
- `authOptions` exported
- `auth()` helper returns server session

**State & Data Fetching**
- Use server actions for side effects
- Client components manage form state

**UI/UX & Styling**
- Tailwind CSS classes throughout
- Components are reusable and accessible

**Build & Development**
- `npm run dev` to start
- `.env.local` holds `DATABASE_URL`, `NEXTAUTH_SECRET`, etc.
- Build errors surfaced via Turbopack

**Deployment**
- Vercel configuration via `next.config.ts` (default)
- Environment variables set in Vercel dashboard
- Database URL points to MongoDB Atlas or local

---

## 🧪 Testing Instructions
1. Start MongoDB locally or use Atlas
2. Generate a NEXTAUTH_SECRET and update `.env.local`
3. Run `npm install` then `npm run dev`
4. Register a user at `/register`
5. Log in via `/login`
6. Verify todos: add, toggle, delete, filter
7. Promote user to admin (update DB) to access `/admin/dashboard` and `/admin/users`
8. Test middleware by accessing unauthorized URLs,

---

## 🔧 Utilities & Helper Functions
- `dbConnect()` - handles single Mongo connection across hot reloads
- `isUser`, `isAdmin`, `checkUserOwnership` in `lib/permissions.ts`
- Server Actions for CRUD and admin operations
- `auth()` wrapper to get session in server components

---

## ✅ Features Summary
- User registration/login with validation and hashing
- Session management with JWT
- Todo CRUD linked to user
- Filtering by status
- Admin statistics and user management
- Role-based navigation/redirection
- Responsive, mobile-first UI

---

## 🚀 Future Enhancements
- Edit todos, priorities, due dates
- Dark mode
- Email notifications
- Social login
- Real-time collaboration
- Audit logs
- Automated tests

---

## 📄 Version Control
This project is structured for easy collaboration. Each major change (models, auth, UI, actions) is isolated.

---

## 🎯 Conclusion
This documentation provides a complete reference covering requirements, architecture, implementation details, and usage instructions. Any developer or AI agent can take this repo, set up environment variables, connect a MongoDB instance, and immediately begin working or building upon the Smart To-Do application.