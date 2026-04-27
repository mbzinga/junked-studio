# JUNKED STUDIO

One-of-one handmade phone case boutique — built with Next.js 14, Supabase, Tailwind, and Resend.

## Setup

1. **Clone & install**
   ```bash
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com)

3. **Run this SQL** in the Supabase SQL editor to create the orders table:
   ```sql
   create table orders (
     id uuid default gen_random_uuid() primary key,
     created_at timestamptz default now(),
     name text not null,
     contact text not null,
     phone_model text not null,
     tier text not null,
     colors text,
     shipping text not null,
     status text default 'new'
   );

   -- Allow authenticated users (admin) to read and update orders
   alter table orders enable row level security;
   create policy "Admin reads orders" on orders for select using (auth.role() = 'authenticated');
   create policy "Admin updates orders" on orders for update using (auth.role() = 'authenticated');
   -- Inserts come from the API route using the service role key (bypasses RLS)
   ```

4. **Create a storage bucket** called `gallery`:
   - Go to Storage → New bucket → name it `gallery` → toggle **Public** on
   - Add a storage policy: allow `authenticated` users to INSERT and DELETE

5. **Create an admin user** in Supabase Auth → Users → Add user (email + password)

6. **Set up env vars** — copy `.env.local.example` to `.env.local` and fill in:
   - Supabase URL + anon key + service role key (from Settings → API)
   - Resend API key (from [resend.com](https://resend.com))
   - `NOTIFY_EMAIL` = Falola's email for order notifications

7. **Run locally**
   ```bash
   npm run dev
   ```

## Deploy to Vercel

Push to GitHub, import into Vercel, and add the same env vars from `.env.local` to your Vercel project settings.

## Routes

| Path            | What it does                        |
|-----------------|-------------------------------------|
| `/`             | Landing page (gallery, pricing, order form) |
| `/admin/login`  | Admin login (Supabase auth)         |
| `/admin`        | Gallery uploads + orders table      |
| `/api/order`    | POST — writes order, sends email    |
