# Agro/Coconut Product Catalog Website

MERN stack project: product catalog + customer/admin login + inquiry system (no cart/payment — inquiry-based, like Agriwhale.com).

## Structure
```
coconut-ecommerce/
  server/     Express + MongoDB backend
  client/     React (Vite) frontend
```

## Day 1 Setup Steps

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
```
Edit `.env`:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string

Run it:
```bash
npm run dev
```
Server runs on http://localhost:5000

### 2. Create your first admin account
Edit `seedAdmin.js` with your desired admin email/password, then:
```bash
node seedAdmin.js
```

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Client runs on http://localhost:5173

## What's already built
- User model with `role` field (customer/admin)
- JWT auth (register/login) — reused pattern from Personal Finance Manager
- Role-based route protection (`protect` + `adminOnly` middleware)
- Product CRUD API (public read, admin-only write)
- Inquiry system (customer submits, admin views/manages status)
- Frontend routing skeleton: Home, Products, Product Detail (with inquiry form), Login, Signup, My Inquiries, Admin Login, Admin Dashboard

## What's still TODO (Day 2 onward)
- Style all pages to match coconutwebsite.vercel.app reference layout
- Add product images (upload handling — consider Cloudinary free tier, or store image URLs)
- Rewrite Agriwhale product descriptions in your own words, populate via admin panel
- Category filter on Products page
- Edit product functionality in admin dashboard
- WhatsApp click-to-chat button (Home + Product Detail pages)
- Responsive/mobile pass
- Deploy: client → Vercel, server → Render, DB → MongoDB Atlas (all free tier to start)

## Notes
- Admin and customer both log in via the same `/api/auth/login` endpoint — role is stored on the user record, not chosen at login time. This means the very first admin has to be created via `seedAdmin.js`; any admin after that, promote manually in the DB or add an admin-only "create admin" endpoint later if needed.
- Inquiries require login — confirm with Rupesh this is actually wanted vs. a no-login WhatsApp/contact form like Agriwhale uses. Easy to remove the `protect` requirement on `POST /api/inquiries` if he wants zero-friction inquiries.
