/*
# Seed sample blog posts and charcoal products

## Overview
Seeds the database with sample blog posts and charcoal products matching
thecharcoalfactory.com content and product range.

## Changes
- Inserts 3 blog posts with real content from thecharcoalfactory.com blog.
- Inserts 6 charcoal products with TCF images and specifications.
- All inserts are idempotent (ON CONFLICT DO NOTHING for products, ON CONFLICT slug for posts).
*/

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, body, hero_image_url, category, tags, author, published, published_at) VALUES
  ('Charcoal Container Loading Guide 2026', 'charcoal-container-loading-guide', 'A complete guide to loading charcoal into shipping containers for maximum capacity and safe transport.', '## Why Container Loading Matters

Proper container loading is critical for maximizing cargo capacity and ensuring product safety during international shipping. At The Charcoal Factory, we optimize every container for maximum payload while maintaining product integrity.

### Container Specifications

A standard 20GP container holds approximately 18 metric tons of charcoal. The internal dimensions are 5.9m × 2.35m × 2.39m, providing about 33 cubic meters of usable space.

### Loading Process

1. **Pallet preparation** — Products are stacked on heat-treated wooden pallets
2. **Carton arrangement** — Cartons are arranged to minimize empty space
3. **Securing cargo** — Cargo is secured with straps and dunnage bags
4. **Final inspection** — Container is sealed and photographed before shipping

### Documentation

Every shipment includes:
- Packing list
- Commercial invoice
- Certificate of origin
- Phytosanitary certificate
- Bill of lading

For more information about our export process, contact our team.', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/Machine-Made-Bamboo-Charcoal.jpg', 'Bulk Supply & Export', '{"container loading","export","shipping","logistics"}', 'The Charcoal Factory', true, now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (title, slug, excerpt, body, hero_image_url, category, tags, author, published, published_at) VALUES
  ('Charcoal Manufacturing Explained In 2026', 'charcoal-manufacturing', 'Understanding how charcoal is made — from primitive earthen pits to fully automated industrial furnaces.', '## The Science of Charcoal

When you burn wood in an open fire with full oxygen exposure, you get ash — the end product of complete combustion. But behind that piece of charcoal is a surprisingly involved manufacturing process.

### Pyrolysis: The Heart of Charcoal Making

This process — thermal decomposition in a low-oxygen environment — is called **pyrolysis**, and it is the heart of every charcoal manufacturing method in the world, from the most primitive to the most sophisticated.

### Modern Industrial Production

At The Charcoal Factory, we use advanced carbonization kilns that:

- Maintain precise temperature control (400-700°C)
- Capture and recycle pyrolysis gases
- Produce consistent quality across every batch
- Minimize environmental impact

### Quality Testing

Every batch is tested for:
- Moisture content (≤8%)
- Ash content (≤4% for A-Grade)
- Fixed carbon (≥78% for wood, ≥80% for bamboo)
- Size uniformity
- Burn time performance

This ensures predictable performance for our wholesale buyers worldwide.', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/High-Temperature-Bamboo-Charcoal-1.jpg', 'Manufacturing', '{"manufacturing","pyrolysis","quality control","bamboo"}', 'The Charcoal Factory', true, now())
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (title, slug, excerpt, body, hero_image_url, category, tags, author, published, published_at) VALUES
  ('Wholesale Price of Charcoal: A 2026 Market Guide', 'wholesale-price-of-charcoal', 'Understanding charcoal pricing factors and how to get the best wholesale rates from factory-direct suppliers.', '## Factors Affecting Charcoal Pricing

Charcoal prices vary based on several key factors that every wholesale buyer should understand.

### Raw Material

- **Bamboo charcoal** — Premium pricing due to 3-5 year growth cycle and superior burn characteristics
- **Wood charcoal** — Mid-range pricing, widely available
- **Coconut shell charcoal** — Higher cost, premium market positioning

### Grade Selection

| Grade | Fixed Carbon | Ash Content | Price Range |
|-------|-------------|------------|------------|
| A-Grade | ≥80% | ≤3% | Premium |
| B-Grade | 75-80% | 3-5% | Standard |
| C-Grade | <75% | >5% | Budget |

### Order Volume

Factory-direct pricing scales with volume:
- 1×20GP container: Standard rate
- 3+ containers: 5-10% discount
- Annual contracts: Negotiable rates

### Getting the Best Price

1. **Buy direct from factory** — Eliminate trader margins
2. **Plan ahead** — Avoid rush production surcharges
3. **Long-term contracts** — Lock in favorable rates
4. **Flexible grades** — Consider B-Grade for cost-sensitive markets

Contact us for a customized quote based on your specific requirements.', 'https://thecharcoalfactory.com/wp-content/uploads/2026/04/Wholesale-Price-of-Charcoal-1024x576.jpg', 'Pricing & Market', '{"pricing","wholesale","market guide","export"}', 'The Charcoal Factory', true, now())
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (name, description, grade, category, image_url, specifications, price_per_ton, bulk_price_per_unit, bulk_min_qty, bulk_unit_name, branded_price_per_unit, branded_min_qty, branded_unit_name, branded_pack_desc) VALUES
  ('A-Grade Machine-Made Bamboo Charcoal', 'High-temperature bamboo charcoal with low ash content. Fixed carbon ≥80%, ash ≤3%. Ideal for shisha, BBQ, and premium retail markets.', 'Grade A', 'Bamboo', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/Machine-Made-Bamboo-Charcoal.jpg', '{"Fixed Carbon": "≥80%", "Ash Content": "≤3%", "Moisture": "≤8%", "Burn Time": "3-4 hours"}', 850, 850, 18, 'ton', 15, 10, 'box', 'Custom OEM retail packaging available')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, grade, category, image_url, specifications, price_per_ton, bulk_price_per_unit, bulk_min_qty, bulk_unit_name, branded_price_per_unit, branded_min_qty, branded_unit_name, branded_pack_desc) VALUES
  ('Shaped Bamboo Charcoal', 'Custom-shaped bamboo charcoal for grilling and shisha applications. Consistent shape and size for uniform burn performance.', 'Grade A', 'Bamboo', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/High-Temperature-Bamboo-Charcoal-1.jpg', '{"Fixed Carbon": "≥80%", "Ash Content": "≤3%", "Shape": "Custom", "Density": "High"}', 920, 920, 18, 'ton', 18, 10, 'box', 'Custom shapes and branding available')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, grade, category, image_url, specifications, price_per_ton, bulk_price_per_unit, bulk_min_qty, bulk_unit_name, branded_price_per_unit, branded_min_qty, branded_unit_name, branded_pack_desc) VALUES
  ('Low Ash Shaped Bamboo Shisha Charcoal', 'Premium shisha charcoal with ultra-low ash content. Designed for hookah lounges and premium shisha markets in the Middle East.', 'Grade A', 'Bamboo', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/BC-B021-5.jpg', '{"Fixed Carbon": "≥82%", "Ash Content": "≤2.5%", "Burn Time": "2+ hours", "Smoke": "Odorless"}', 1100, 1100, 18, 'ton', 22, 10, 'box', 'Retail-ready shisha packaging')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, grade, category, image_url, specifications, price_per_ton, bulk_price_per_unit, bulk_min_qty, bulk_unit_name, branded_price_per_unit, branded_min_qty, branded_unit_name, branded_pack_desc) VALUES
  ('Eco-Friendly Shisha Charcoal', 'Machine-made shisha charcoal with custom packaging options. Clean-burning, no chemical additives.', 'Grade A', 'Bamboo', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/BC-B020-1.jpg', '{"Fixed Carbon": "≥80%", "Ash Content": "≤3%", "Additives": "None", "Packaging": "Custom"}', 1050, 1050, 18, 'ton', 20, 10, 'box', 'Eco-friendly branded packaging')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, grade, category, image_url, specifications, price_per_ton, bulk_price_per_unit, bulk_min_qty, bulk_unit_name, branded_price_per_unit, branded_min_qty, branded_unit_name, branded_pack_desc) VALUES
  ('A-Grade Low-Ash Shaped Wood Charcoal', 'High-heat, low-smoke wood charcoal for BBQ and food service. Fixed carbon ≥78%, ash content ≤4%. Multiple sizes available.', 'Grade A', 'Wood', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/BC-W008-3.jpg', '{"Fixed Carbon": "≥78%", "Ash Content": "≤4%", "Moisture": "≤8%", "Sizes": "Multiple"}', 720, 720, 18, 'ton', 12, 10, 'box', 'Custom carton weights and branding')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, grade, category, image_url, specifications, price_per_ton, bulk_price_per_unit, bulk_min_qty, bulk_unit_name, branded_price_per_unit, branded_min_qty, branded_unit_name, branded_pack_desc) VALUES
  ('A-Grade Wood Charcoal for Grilling', 'Premium grilling charcoal with long burn time and consistent heat output. Perfect for restaurant chains and BBQ distributors.', 'Grade A', 'Wood', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/BC-W006-1.jpg', '{"Fixed Carbon": "≥78%", "Ash Content": "≤4%", "Burn Time": "4+ hours", "Heat": "High"}', 750, 750, 18, 'ton', 13, 10, 'box', 'Private-label retail packaging')
ON CONFLICT DO NOTHING;
