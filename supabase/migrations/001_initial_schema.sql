-- Create categories table
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Create products table
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  name text not null,
  slug text unique not null,
  description text,
  cooking_tips text,
  image_urls text[] default '{}',
  is_active boolean default true,
  is_featured boolean default false,
  low_stock_threshold int default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create product variants table
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  weight_label text not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock_qty int default 100,
  is_active boolean default true
);

-- Create testimonials table
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  quote text not null,
  rating int check (rating between 1 and 5) default 5,
  is_active boolean default true,
  sort_order int default 0
);

-- Create orders table
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text unique not null,
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_slot text,
  delivery_date text,
  notes text,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  total_amount numeric(10,2) not null,
  status text default 'pending_confirmation'
    check (status in ('pending_confirmation','confirmed','out_for_delivery','delivered','cancelled')),
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create order status history table
create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  status text not null,
  changed_at timestamptz default now()
);

-- Create contact messages table
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Create settings table
create table settings (
  key text primary key,
  value jsonb not null
);

-- RLS (Row Level Security) Configuration
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table testimonials enable row level security;
alter table orders enable row level security;
alter table order_status_history enable row level security;
alter table contact_messages enable row level security;
alter table settings enable row level security;

-- Create Policies

-- 1. Categories Policies
create policy "Allow public read-only access to categories" on categories
  for select using (is_active = true);

create policy "Allow authenticated admin full control over categories" on categories
  for all using (auth.role() = 'authenticated');

-- 2. Products Policies
create policy "Allow public read-only access to products" on products
  for select using (is_active = true);

create policy "Allow authenticated admin full control over products" on products
  for all using (auth.role() = 'authenticated');

-- 3. Product Variants Policies
create policy "Allow public read-only access to variants" on product_variants
  for select using (is_active = true);

create policy "Allow authenticated admin full control over variants" on product_variants
  for all using (auth.role() = 'authenticated');

-- 4. Testimonials Policies
create policy "Allow public read-only access to testimonials" on testimonials
  for select using (is_active = true);

create policy "Allow authenticated admin full control over testimonials" on testimonials
  for all using (auth.role() = 'authenticated');

-- 5. Orders Policies
create policy "Allow public insert on orders" on orders
  for insert with check (true);

create policy "Allow authenticated admin full control over orders" on orders
  for all using (auth.role() = 'authenticated');

-- 6. Order Status History Policies
create policy "Allow public insert on order status history" on order_status_history
  for insert with check (true);

create policy "Allow authenticated admin full control over status history" on order_status_history
  for all using (auth.role() = 'authenticated');

-- 7. Contact Messages Policies
create policy "Allow public insert on contact messages" on contact_messages
  for insert with check (true);

create policy "Allow authenticated admin full control over contact messages" on contact_messages
  for all using (auth.role() = 'authenticated');

-- 8. Settings Policies
create policy "Allow public read-only access to settings" on settings
  for select using (true);

create policy "Allow authenticated admin full control over settings" on settings
  for all using (auth.role() = 'authenticated');

-- Postgres Function for Secure Order Lookup (Phone + Order Ref match only)
create or replace function lookup_order(ref_input text, phone_input text)
returns setof orders as $$
begin
  return query
  select * from orders
  where order_ref = ref_input and customer_phone = phone_input;
end;
$$ language plpgsql security definer;

-- Trigger to auto-insert order status history
create or replace function log_order_status_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') or (OLD.status <> NEW.status) then
    insert into order_status_history(order_id, status)
    values (NEW.id, NEW.status);
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_order_status_change
after insert or update on orders
for each row execute function log_order_status_change();

-- Trigger to auto-update updated_at timestamp
create or replace function update_modified_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger trg_update_products_timestamp before update on products for each row execute function update_modified_column();
create trigger trg_update_orders_timestamp before update on orders for each row execute function update_modified_column();
