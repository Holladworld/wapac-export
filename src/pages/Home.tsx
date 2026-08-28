import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowRight, Package, Globe, ShieldCheck, FileText, Loader2,
  Ship, Layers, BadgeCheck, Tag, Plus, Minus, Star, Sparkles,
} from 'lucide-react';
import { supabase, type Product, type BlogPost } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';
import InquiryForm from '../components/InquiryForm';
import { useSEO } from '../hooks/useSEO';
import Slider from '../components/Slider'; // <-- ADD THIS IMPORT

export default function Home() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const faqs = [
    { q: 'What is the minimum order quantity?', a: 'Our MOQ is one 20GP container (~18 metric tons). For allied commodities like cocoa and cashew, MOQ varies by product — contact us for details.' },
    { q: 'Which ports do you ship from?', a: 'We export primarily through Lagos ports (Apapa and Tin Can Island). We can arrange shipping to any global destination port with complete export documentation.' },
    { q: 'What export documents are included?', a: 'Every shipment includes certificate of origin, phytosanitary certificate, commercial invoice, packing list, and bill of lading. Additional certificates can be arranged on request.' },
    { q: 'How are payments structured?', a: 'Standard terms are 50% advance deposit via T/T (bank transfer) to secure production, with the balance due before container loading. Letter of credit (L/C) is accepted for orders above 3 containers.' },
    { q: 'Do you offer private-label branding?', a: 'Yes. We provide custom packaging, private-label branding, and retail-ready packaging for distributors and retail chains. Minimum quantities apply for custom branding.' },
  ];

  useSEO({
    title: 'Wapac Export',
    description: 'Premium Nigerian charcoal and allied agricultural commodities for global importers. SGS certified, export-ready, shipped from Lagos.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Wapac Export',
      url: 'https://wapacexport.com',
      description: 'Premium Nigerian charcoal and allied agricultural commodities for global importers.',
      address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
      faqPage: {
        '@type': 'FAQPage',
        hasPart: [
          { '@type': 'Question', name: 'What is the minimum order quantity?', acceptedAnswer: { '@type': 'Answer', text: 'Our MOQ is one 20GP container (~18 metric tons). For allied commodities like cocoa and cashew, MOQ varies by product.' } },
          { '@type': 'Question', name: 'Which ports do you ship from?', acceptedAnswer: { '@type': 'Answer', text: 'We export primarily through Lagos ports (Apapa and Tin Can Island) to any global destination.' } },
          { '@type': 'Question', name: 'What export documents are included?', acceptedAnswer: { '@type': 'Answer', text: 'Certificate of origin, phytosanitary certificate, commercial invoice, packing list, and bill of lading.' } },
          { '@type': 'Question', name: 'How are payments structured?', acceptedAnswer: { '@type': 'Answer', text: '50% advance via T/T, balance before loading. L/C accepted for orders above 3 containers.' } },
          { '@type': 'Question', name: 'Do you offer private-label branding?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, we provide custom packaging and private-label branding for distributors and retail chains.' } },
        ],
      },
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const [{ data: prodData, error: prodErr }, { data: postData }] = await Promise.all([
          supabase.from('products').select('*').eq('service_type', 'charcoal').order('created_at', { ascending: false }).limit(4),
          supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(3),
        ]);
        if (prodErr) throw prodErr;
        setProducts(prodData || []);
        setPosts(postData || []);
      } catch {
        setFetchError(true);
      }
      setLoading(false);
    })();
  }, []);

  const heroBg = settings.hero_bg_image || settings.hero_image_url || 'https://images.pexels.com/photos/9877234/pexels-photo-9877234.jpeg?auto=compress&cs=tinysrgb&w=1920';

  const trustFeatures = [
    { icon: Ship, title: 'Export Ready' },
    { icon: Layers, title: 'Scalable Supply' },
    { icon: BadgeCheck, title: 'Consistent Quality' },
    { icon: Tag, title: 'Private Label Support' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[640px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg, #09090b 0%, #09090b 35%, rgba(9,9,11,0.85) 55%, rgba(9,9,11,0.25) 100%)' }}
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[11px] tracking-[0.3em] uppercase font-semibold text-orange-400 inline-flex items-center gap-2 mb-5 animate-fade-in">
              <Sparkles size={14} /> West African Export Specialists
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] text-white mb-6 animate-slide-up">
              Premium Nigerian Charcoal
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Trusted by Global Importers
              </span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-zinc-300/90 mb-8 max-w-xl animate-slide-up">
              WAPAC supplies premium export-grade Nigerian charcoal and allied agricultural commodities to distributors, wholesalers, and industrial buyers worldwide. We deliver consistent quality, scalable supply, private labeling, and full export documentation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12 animate-slide-up">
              <button
                onClick={() => setInquiryOpen(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 text-sm tracking-wide uppercase font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                Request Bulk Quote <ArrowRight size={16} />
              </button>
              <Link
                to="/products"
                className="flex items-center justify-center gap-2 px-8 py-4 text-sm tracking-wide uppercase font-semibold border border-white/25 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50"
              >
                Explore Products
              </Link>
            </div>

            {/* Trust Badges — inside hero */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 animate-fade-in">
              {trustFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                      boxShadow: '0 0 18px rgba(249,115,22,0.45), 0 0 6px rgba(245,158,11,0.3)',
                    }}
                  >
                    <feature.icon size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-white leading-tight">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
              {settings.featured_eyebrow || 'Featured Catalog'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3" style={{ color: 'var(--tcf-text)' }}>
              {settings.featured_title || 'Premium Charcoal for Every Market'}
            </h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>
          ) : fetchError ? (
            <p className="text-center text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>Failed to load products. Please refresh the page.</p>
          ) : products.length === 0 ? (
            <p className="text-center text-sm" style={{ color: 'var(--tcf-secondary-text)' }}>Products coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm tracking-wide uppercase font-medium border transition-all duration-300 hover:shadow-lg"
              style={{ borderColor: 'var(--tcf-accent)', color: 'var(--tcf-accent)' }}
            >
              View All Charcoal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--tcf-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
              Why Importers Choose Wapac
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3" style={{ color: 'var(--tcf-text)' }}>
              Built for international trade.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: 'Global Bulk Shipping', desc: settings.trust_badge_1_desc || '40+ countries served with full export documentation on every shipment.' },
              { icon: ShieldCheck, title: 'SGS Certified Quality', desc: settings.trust_badge_2_desc || 'Every batch independently verified for fixed carbon, ash, and moisture content.' },
              { icon: FileText, title: 'Flexible Payment Options', desc: settings.trust_badge_3_desc || 'Pay via FlutterWave, Paystack, Payoneer, or T/T bank transfer.' },
              { icon: Package, title: 'Custom OEM Packaging', desc: settings.trust_badge_4_desc || 'Private-label branding, custom carton weights, and retail-ready packaging.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 transition-all duration-300 hover:shadow-xl"
                style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}
                >
                  <item.icon size={22} className="text-white" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-3" style={{ color: 'var(--tcf-text)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--tcf-secondary-text)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
              {settings.process_eyebrow || 'How It Works'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3" style={{ color: 'var(--tcf-text)' }}>
              {settings.process_title || 'From inquiry to shipment in four steps.'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit Inquiry', desc: 'Tell us your product, quantity, and destination port.' },
              { step: '02', title: 'Receive Quote', desc: 'Get a detailed quote with pricing and shipping within 24 hours.' },
              { step: '03', title: 'Confirm Order', desc: 'Approve the quote and arrange payment via your preferred method.' },
              { step: '04', title: 'Shipment', desc: 'We process, document, and ship your order with full tracking.' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div
                  className="w-12 h-12 flex items-center justify-center font-serif text-lg font-bold mb-4 rounded-full"
                  style={{ backgroundColor: 'var(--tcf-accent)', color: 'var(--tcf-button-text)' }}
                >
                  {item.step}
                </div>
                <h3 className="font-serif text-lg font-bold mb-2" style={{ color: 'var(--tcf-text)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--tcf-secondary-text)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SLIDER SECTION (NEW - ADDED HERE) ===== */}
      {/* See Us in Operation Slider - before FAQ */}
      <Slider />

      {/* FAQ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--tcf-primary)' }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3" style={{ color: 'var(--tcf-text)' }}>
              Everything importers need to know.
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { q: 'What is the minimum order quantity?', a: 'Our MOQ is one 20GP container (~18 metric tons). For allied commodities like cocoa and cashew, MOQ varies by product — contact us for details.' },
              { q: 'Which ports do you ship from?', a: 'We export primarily through Lagos ports (Apapa and Tin Can Island). We can arrange shipping to any global destination port with complete export documentation.' },
              { q: 'What export documents are included?', a: 'Every shipment includes certificate of origin, phytosanitary certificate, commercial invoice, packing list, and bill of lading. Additional certificates can be arranged on request.' },
              { q: 'How are payments structured?', a: 'Standard terms are 50% advance deposit via T/T (bank transfer) to secure production, with the balance due before container loading. Letter of credit (L/C) is accepted for orders above 3 containers.' },
              { q: 'Do you offer private-label branding?', a: 'Yes. We provide custom packaging, private-label branding, and retail-ready packaging for distributors and retail chains. Minimum quantities apply for custom branding.' },
            ].map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {posts.length > 0 && (
        <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--tcf-bg)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
                Latest Insights
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3" style={{ color: 'var(--tcf-text)' }}>
                News & Resources
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group transition-all duration-300 hover:shadow-xl"
                  style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}
                >
                  <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--tcf-bg)' }}>
                    {post.hero_image_url && (
                      <img src={post.hero_image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--tcf-accent)' }}>
                      {post.category || 'General'}
                    </span>
                    <h3 className="font-serif text-lg font-bold mt-2 mb-2 transition-colors group-hover:opacity-80" style={{ color: 'var(--tcf-text)' }}>
                      {post.title}
                    </h3>
                    <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--tcf-secondary-text)' }}>
                      {post.excerpt || post.body.substring(0, 100)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <InquiryForm isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid var(--tcf-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:opacity-80"
      >
        <span className="font-medium text-sm md:text-base" style={{ color: 'var(--tcf-text)' }}>{question}</span>
        {open ? <Minus size={18} style={{ color: 'var(--tcf-accent)' }} /> : <Plus size={18} style={{ color: 'var(--tcf-accent)' }} />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--tcf-secondary-text)' }}>
          {answer}
        </div>
      )}
    </div>
  );
}