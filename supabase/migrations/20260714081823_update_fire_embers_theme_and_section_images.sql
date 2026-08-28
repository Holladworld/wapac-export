/*
# Fire & Embers Theme + Section Background Images

## Overview
Updates the default site_settings to the "Fire and Embers" premium industrial
theme with vibrant amber/orange accents on deep carbon black, and adds new
section background image keys for the CMS image manager.

## Changes to site_settings

### Updated values (upsert)
- primary_color: #09090b (deep carbon/zinc black — stays dark for hero)
- bg_color: #09090b (deep carbon black — dark theme base)
- text_color: #f4f4f5 (near-white text on dark)
- button_color: #ea580c (vibrant charcoal amber/orange)
- button_text_color: #ffffff (white on orange buttons)
- accent_color: #f97316 (vibrant amber accent)
- hero_image_url: gritty charcoal hero background

### New keys (insert if not exists)
- hero_bg_image: URL for the dark, gritty charcoal hero background image
- features_bg_image: URL for a subtle slate/industrial texture behind features
- secondary_text_color: #d4d4d8 (cool zinc gray for hero subtitle/overlays)

## Security
No schema changes — only data upserts into the existing site_settings table.
RLS policies already allow authenticated users to insert/update.
*/

-- Update existing color settings to fire & embers theme
INSERT INTO site_settings (key, value, updated_at) VALUES
  ('primary_color', '#09090b', now()),
  ('bg_color', '#09090b', now()),
  ('text_color', '#f4f4f5', now()),
  ('button_color', '#ea580c', now()),
  ('button_text_color', '#ffffff', now()),
  ('accent_color', '#f97316', now()),
  ('hero_image_url', 'https://images.pexels.com/photos/48884/pexels-photo-48884.jpeg?auto=compress&cs=tinysrgb&w=1920', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- Add new section background image keys
INSERT INTO site_settings (key, value, updated_at) VALUES
  ('hero_bg_image', 'https://images.pexels.com/photos/48884/pexels-photo-48884.jpeg?auto=compress&cs=tinysrgb&w=1920', now()),
  ('features_bg_image', 'https://images.pexels.com/photos/2798190/pexels-photo-2798190.jpeg?auto=compress&cs=tinysrgb&w=1920', now()),
  ('secondary_text_color', '#d4d4d8', now())
ON CONFLICT (key) DO NOTHING;
