# Satish Mutton — Fresh Mutton Delivery Website + Admin Dashboard

This is a production-grade, fast, and fully responsive e-commerce web application with an admin dashboard built for **Satish Mutton** in **Rajahmundry, Andhra Pradesh**.

Built using **Next.js 15 (App Router)**, **Tailwind CSS v4**, **Zustand**, and **React Query**.

## 🚀 Setup & Local Development

### 1. Install Dependencies
Run the following command in the project directory:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

### 3. Run the Development Server
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, and [http://localhost:3000/admin](http://localhost:3000/admin) to view the Admin Dashboard.

## 🗄️ Supabase Configuration

To connect this application to a real Supabase database:

1. Create a new project in your **Supabase Dashboard**.
2. Go to **SQL Editor** and run the contents of the migration file:
   - [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)
3. Seed the initial categories, products, and default settings by running the contents of:
   - [`supabase/seed.sql`](./supabase/seed.sql)
4. Enable **Supabase Auth** (Email/Password) to allow admin users to log in. You can invite your first admin user directly from the **Authentication** tab in the Supabase dashboard.
