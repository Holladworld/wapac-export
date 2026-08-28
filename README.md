# Wapac Export - Nigerian Export Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deployed-F38020?logo=cloudflare)](https://pages.cloudflare.com/)

## 📋 Overview

Wapac Export is a modern, full-stack web platform for a Nigerian export company specializing in premium charcoal, cocoa, cashew nuts, ginger, and soya beans. The platform provides a professional B2B interface for international buyers to explore products, request bulk quotes, and connect with the export team.

### 🎯 Target Audience
- International importers and distributors
- Wholesale buyers of Nigerian agricultural commodities
- B2B partners looking for export-ready products

### 🌍 Global Reach
- Serving buyers in 40+ countries worldwide
- Export documentation and logistics support
- SGS certified quality assurance

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI Framework |
| TypeScript | 5.0 | Type Safety |
| Tailwind CSS | 3.0 | Styling |
| React Router | 6.0 | Navigation |
| Lucide React | Latest | Icons |

### Backend & Infrastructure
| Technology | Purpose |
|------------|---------|
| Supabase | Database, Auth, Storage |
| Cloudflare Pages | Hosting & CDN |
| Cloudflare Edge Functions | Serverless API |

### Key Libraries
- `react-router-dom` - Client-side routing
- `@supabase/supabase-js` - Database interactions
- `lucide-react` - Icon library
- Custom hooks for SEO, validation, and state management

---

## 📁 Project Structure
-----

---

##  Key Features

### 🏠 Public Website
- **Responsive Landing Page** - Hero section with dynamic background
- **Product Catalog** - Search, filter by category
- **Bulk Ordering** - Request quotes for wholesale quantities
- **Inquiry Cart** - Collect products for a single quote request
- **Blog** - Company news and export insights
- **Contact Forms** - Direct communication with export team
- **Dark/Light Theme** - User preference persistence

### 🔐 Admin Dashboard
- **Secure Authentication** - JWT-based admin login with 8-hour sessions
- **Product Management** - CRUD operations with pricing
- **Order Management** - Track quote requests and orders
- **Blog Management** - Create/edit/publish blog posts
- **Slider Management** - Manage homepage carousel slides
- **Media Library** - Upload and organize images
- **Email Templates** - Customize automated emails
- **Site Settings** - Update logos, colors, and content
- **Integration Settings** - Configure third-party services

### 📊 Database Schema
- **Products** - Bulk and branded pricing options
- **Orders** - Quote requests with shipping details
- **Blog Posts** - With SEO fields and categories
- **Slider Slides** - Active/inactive carousel slides
- **Admin Users** - Secure admin authentication
- **Email Templates** - Customizable email content
- **Site Settings** - Key-value store for site configuration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Cloudflare Pages account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wapac-export.git
cd wapac-export

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key

# Start development server
npm run dev

SEO & Analytics
Built-in SEO hooks for meta tags

Open Graph support

JSON-LD structured data

Custom page titles and descriptions

Blog posts with SEO metadata

🛡️ Security
Admin Authentication - JWT-based with 8-hour sessions

Rate Limiting - 5 failed attempts before 15-minute lockout

CORS Protection - Configurable allowed origins

Row Level Security - Supabase RLS policies

Password Hashing - PBKDF2 with SHA-256

🤝 Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Open a Pull Request

📄 License
This project is proprietary software. All rights reserved.

📞 Contact
Wapac Export

Email: wapacexport@gmail.com

Phone: +234 803 046 3210

Website: https://wapacexport.com.ng

