import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔥 ADD ERROR HANDLING
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// 🔥 ADD DEBUG LOGS (remove after testing)
console.log('🔍 Supabase initialized with:');
console.log('  URL:', supabaseUrl);
console.log('  Key exists:', !!supabaseAnonKey);
console.log('  Key length:', supabaseAnonKey?.length);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

// Type definitions
export type Product = {
  id: string;
  name: string;
  description: string;
  grade: string;
  category: string;
  specifications: Record<string, string>;
  price_per_ton: number;
  image_url: string | null;
  created_at: string;
  bulk_price_per_unit: number;
  bulk_min_qty: number;
  bulk_unit_name: string;
  branded_price_per_unit: number;
  branded_min_qty: number;
  branded_unit_name: string;
  branded_pack_desc: string | null;
  service_type: string;
};

export type Review = {
  id: string;
  product_id: string | null;
  post_id: string | null;
  author_name: string;
  author_email: string;
  rating: number;
  title: string | null;
  body: string;
  status: string;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  hero_image_url: string | null;
  category: string | null;
  tags: string[] | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
  unit_name: string;
  image_url: string | null;
};

export type Order = {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  vat_number: string | null;
  shipping_address: string;
  payment_method: string;
  total_price: number;
  total_tons: number;
  status: string;
  created_at: string;
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery: string | null;
  admin_notes: string | null;
};

export type SiteSettings = Record<string, string>;

export type EmailTemplate = {
  id: string;
  template_key: string;
  display_name: string;
  subject: string;
  body: string;
  enabled: boolean;
};

export type Integration = {
  id: string;
  service_name: string;
  display_name: string;
  api_key_encrypted: string | null;
  webhook_url: string | null;
  enabled: boolean;
  config: Record<string, unknown>;
};

export type MediaItem = {
  id: string;
  url: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  alt_text: string | null;
  tags: string[] | null;
  folder: string | null;
  uploaded_by: string | null;
  created_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  display_name: string;
  role: string;
  active: boolean;
};