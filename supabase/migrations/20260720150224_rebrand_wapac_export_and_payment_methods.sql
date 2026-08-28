/*
# Wapac Export Rebrand + New Payment Methods

## Overview
Rebrands the site from "The Charcoal Factory" to "Wapac Export" (West African
Prime Allied Commodities Limited) and updates the hero text and trust badge
copy to reflect the new company identity and payment options.

## Changes to site_settings (upsert)
- hero_eyebrow: West African Prime Allied Commodities
- hero_title: Premium export commodities,from West Africa to the world.
- hero_subtitle: Updated copy mentioning Wapac Export + FlutterWave/Paystack/Payoneer
- trust_badge_3_title: Flexible Payment Options
- trust_badge_3_desc: Pay via FlutterWave, Paystack, Payoneer, or T/T bank transfer.
- featured_title: Export-grade commodities from West Africa.
- process_title: From inquiry to shipment in four steps.

No schema changes — only data upserts.
*/

INSERT INTO site_settings (key, value, updated_at) VALUES
  ('hero_eyebrow', 'West African Prime Allied Commodities', now()),
  ('hero_title', 'Premium export commodities,from West Africa to the world.', now()),
  ('hero_subtitle', 'Wapac Export (West African Prime Allied Commodities Ltd.) is a vertically integrated exporter of charcoal, cashew nuts, and allied commodities. We ship SGS-verified, export-grade products from Lagos and Tema to wholesale buyers across four continents — with flexible payment via FlutterWave, Paystack, and Payoneer.', now()),
  ('trust_badge_3_title', 'Flexible Payment Options', now()),
  ('trust_badge_3_desc', 'Pay via FlutterWave, Paystack, Payoneer, or T/T bank transfer.', now()),
  ('featured_title', 'Export-grade commodities from West Africa.', now()),
  ('process_title', 'From inquiry to shipment in four steps.', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
