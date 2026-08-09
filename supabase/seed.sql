-- Seed Categories
insert into categories (id, name, slug, sort_order, is_active) values
  ('c1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o', 'Mutton Cuts', 'mutton-cuts', 0, true),
  ('b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6q', 'Specialty Cuts', 'specialty-cuts', 1, true);

-- Seed Products (Mutton Cuts)
insert into products (id, category_id, name, slug, description, cooking_tips, image_urls, is_featured, is_active) values
  (
    'p1a1a1a1-1111-2222-3333-444444444444',
    'c1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o',
    'Mutton (Curry Cut)',
    'mutton-curry-cut',
    'Perfectly sized pieces of fresh goat meat, ideal for traditional curries, biryanis, and gravies. Bone-in cuts deliver rich flavour and tender texture when slow-cooked.',
    'Marinate for at least 30 minutes. Slow-cook on low flame for tender, fall-off-the-bone results. Pairs well with rice or roti.',
    array['/images/products/mutton-curry-cut.webp'],
    true,
    true
  ),
  (
    'p2a2a2a2-2222-3333-4444-555555555555',
    'c1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o',
    'Boneless Mutton',
    'boneless-mutton',
    'Premium boneless goat meat, cleaned and ready to cook. Perfect for kebabs, keema, curries, and stir-fry recipes where convenience matters.',
    'Cut into even-sized pieces for uniform cooking. Great for pressure-cooker curries — cooks in 15-20 minutes.',
    array['/images/products/boneless-mutton.webp'],
    true,
    true
  );

-- Seed Product Variants (Mutton Cuts)
insert into product_variants (product_id, weight_label, price, stock_qty, is_active) values
  ('p1a1a1a1-1111-2222-3333-444444444444', '500g', 500.00, 50, true),
  ('p1a1a1a1-1111-2222-3333-444444444444', '1kg', 1000.00, 30, true),
  ('p2a2a2a2-2222-3333-4444-555555555555', '500g', 600.00, 40, true),
  ('p2a2a2a2-2222-3333-4444-555555555555', '1kg', 1200.00, 20, true);

-- Seed Products (Specialty Cuts)
insert into products (id, category_id, name, slug, description, cooking_tips, image_urls, is_featured, is_active) values
  (
    'p3a3a3a3-3333-4444-5555-666666666666',
    'b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6q',
    'Kalu Thalakai (Leg & Head)',
    'kalu-thalakai',
    'Traditional pack of goat legs and head — a delicacy prized across Andhra Pradesh. Slow-cooked to perfection, it yields a gelatinous, deeply flavourful broth.',
    'Clean thoroughly and boil with turmeric before cooking. Best slow-cooked for 2-3 hours for maximum flavour.',
    array['/images/products/kalu-thalakai.webp'],
    true,
    true
  ),
  (
    'p4a4a4a4-4444-5555-6666-777777777777',
    'b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6q',
    'Botti Set (Cleaned Tripe Set)',
    'botti-set',
    'Thoroughly cleaned and processed tripe set, ready for cooking. A staple in Andhra-style botti curries and fry preparations.',
    'Pressure-cook for 10-15 minutes until tender. Fry with spices for a crispy botti fry or simmer in gravy.',
    array['/images/products/botti-set.webp'],
    false,
    true
  ),
  (
    'p5a5a5a5-5555-6666-7777-888888888888',
    'b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6q',
    'Mutton Salthilu',
    'mutton-salthilu',
    'A traditional specialty — carefully prepared goat parts, cleaned and ready for authentic Andhra recipes.',
    'Best prepared with traditional spice blends. Slow-cook for rich, deep flavours.',
    array['/images/products/mutton-salthilu.webp'],
    false,
    true
  ),
  (
    'p6a6a6a6-6666-7777-8888-999999999999',
    'b2c3d4e5-f6g7-4h8i-9j0k-1l2m3n4o5p6q',
    'Killi (Spleen)',
    'killi-spleen',
    'Fresh goat spleen, cleaned and ready to cook. A nutritious delicacy perfect for fry and curry preparations.',
    'Pan-fry with onions and spices for a quick, flavourful dish. Do not overcook — it toughens quickly.',
    array['/images/products/killi.webp'],
    false,
    true
  ),
  (
    'p7a7a7a7-7777-8888-9999-000000000000',
    'c1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o',
    'Mutton Keema',
    'mutton-keema',
    'Premium minced mutton (goat meat), finely ground for perfect texture. Ideal for making keema curry, meatballs, and kebabs.',
    'Cook with spices and peas for a classic Keema Matar. Cook on medium heat for 15-20 minutes.',
    array['/images/products/mutton-keema.webp'],
    false,
    true
  );

-- Seed Product Variants (Specialty & Keema Cuts)
insert into product_variants (product_id, weight_label, price, stock_qty, is_active) values
  ('p3a3a3a3-3333-4444-5555-666666666666', 'Pack of 4', 800.00, 15, true),
  ('p4a4a4a4-4444-5555-6666-777777777777', '1 Set', 300.00, 20, true),
  ('p5a5a5a5-5555-6666-7777-888888888888', '1 Set', 1000.00, 10, true),
  ('p6a6a6a6-6666-7777-8888-999999999999', '1 Set', 100.00, 25, true),
  ('p7a7a7a7-7777-8888-9999-000000000000', '500g', 600.00, 20, true),
  ('p7a7a7a7-7777-8888-9999-000000000000', '1kg', 1200.00, 10, true);

-- Seed Testimonials
insert into testimonials (customer_name, quote, rating, sort_order, is_active) values
  ('Ramesh Kumar', 'The freshest mutton I''ve ever had delivered. You can tell it''s cut the same day. My family loves the curry cut!', 5, 0, true),
  ('Lakshmi Devi', 'Satish Mutton has been our go-to for months. The boneless mutton is perfectly cleaned and the price is very fair.', 5, 1, true),
  ('Venkat Rao', 'Ordered Kalu Thalakai for a family gathering. Everyone asked where I got such quality meat. Highly recommended!', 5, 2, true),
  ('Priya Sharma', 'Love the WhatsApp ordering — so convenient. The delivery is always on time and the meat is hygienically packed.', 4, 3, true),
  ('Suresh Babu', 'Best botti set in Rajahmundry! Perfectly cleaned and ready to cook. Saves me so much preparation time.', 5, 4, true);

-- Seed Settings
insert into settings (key, value) values
  ('whatsapp_config', '{"whatsappNumber": "919030458174", "phone": "+91 90304 58174", "email": "contact@satishmutton.com"}'),
  ('delivery_config', '{"slots": ["Morning (8 AM - 11 AM)", "Afternoon (12 PM - 3 PM)", "Evening (4 PM - 7 PM)"], "pincodes": ["533101", "533103", "533104", "533105", "533106", "533201", "533296"]}');
