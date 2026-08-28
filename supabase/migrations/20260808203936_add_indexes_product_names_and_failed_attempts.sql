-- Add indexes on unindexed foreign keys
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_post_id ON reviews(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at);
CREATE INDEX IF NOT EXISTS idx_products_service_type ON products(service_type);
CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(status, created_at DESC);

-- Add product_name column to order_items so order history survives product deletion
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name text;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_name text;

-- Add failed_attempts column to admin_users for brute-force protection
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS failed_attempts integer DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login timestamptz;
