import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Package,
  Globe,
  ShieldCheck,
  FileText,
  Loader2,
  Ship,
  Layers,
  BadgeCheck,
  Tag,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { supabase, type Product, type BlogPost } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';
import InquiryForm from '../components/InquiryForm';
import { useSEO } from '../hooks/useSEO';
import Slider from '../components/Slider';

export default function Home() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const faqs = [
    {
      q: 'What is the minimum order quantity?',
      a: 'Our MOQ is one 20GP container (~18 metric tons). For allied commodities like cocoa and cashew, MOQ varies by product — contact us for details.',
    },
    {
      q: 'Which ports do you ship from?',
      a: 'We export primarily through Lagos ports (Apapa and Tin Can Island). We can arrange shipping to any global destination port with complete export documentation.',
    },
    {
      q: 'What export documents are included?',
      a: 'Every shipment includes certificate of origin, phytosanitary certificate, commercial invoice, packing list, and bill of lading. Additional certificates can be arranged on request.',
    },
    {
      q: 'How are payments structured?',
      a: 'Standard terms are 50% advance deposit via T/T (bank transfer) to secure production, with the balance due before container loading. Letter of credit (L/C) is accepted for orders above 3 containers.',
    },
    {
      q: 'Do you offer private-label branding?',
      a: 'Yes. We provide custom packaging, private-label branding, and retail-ready packaging for distributors and retail chains. Minimum quantities apply for custom branding.',
    },
  ];

  useSEO({
    title: 'Wapac Export',
    description:
      'Premium Nigerian charcoal and allied agricultural commodities for global importers. SGS certified, export-ready, shipped from Lagos.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Wapac Export',
      url: 'https://wapacexport.com',
      description:
        'Premium Nigerian charcoal and allied agricultural commodities for global importers.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lagos',
        addressCountry: 'NG',
      },
      faqPage: {
        '@type': 'FAQPage',
        hasPart: [
          {
            '@type': 'Question',
            name: 'What is the minimum order quantity?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our MOQ is one 20GP container (~18 metric tons). For allied commodities like cocoa and cashew, MOQ varies by product.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which ports do you ship from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We export primarily through Lagos ports (Apapa and Tin Can Island) to any global destination.',
            },
          },
          {
            '@type': 'Question',
            name: 'What export documents are included?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Certificate of origin, phytosanitary certificate, commercial invoice, packing list, and bill of lading.',
            },
          },
          {
            '@type': 'Question',
            name: 'How are payments structured?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '50% advance via T/T, balance before loading. L/C accepted for orders above 3 containers.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer private-label branding?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, we provide custom packaging and private-label branding for distributors and retail chains.',
            },
          },
        ],
      },
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const [
          { data: prodData, error: prodErr },
          { data: postData },
        ] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('service_type', 'charcoal')
            .order('created_at', { ascending: false })
            .limit(4),

          supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('published_at', { ascending: false })
            .limit(3),
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

  const heroBg =
    settings.hero_bg_image ||
    settings.hero_image_url ||
    'https://images.pexels.com/photos/9877234/pexels-photo-9877234.jpeg?auto=compress&cs=tinysrgb&w=1920';

  const trustFeatures = [
    { icon: Ship, title: 'Export Ready' },
    { icon: Layers, title: 'Scalable Supply' },
    { icon: BadgeCheck, title: 'Consistent Quality' },
    { icon: Tag, title: 'Private Label Support' },
  ];

  return (
    <div>

      {/* =========================================================
          HERO
          ========================================================= */}
      <section className="relative min-h-[680px] h-screen max-h-[900px] flex items-center overflow-hidden bg-black">

        {/* Background Image */}
        <div className="absolute inset-0">

          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover scale-[1.02]"
          />

          {/* Main cinematic overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  rgba(7,7,6,0.96) 0%,
                  rgba(7,7,6,0.90) 28%,
                  rgba(7,7,6,0.68) 48%,
                  rgba(7,7,6,0.30) 72%,
                  rgba(7,7,6,0.16) 100%
                )
              `,
            }}
          />

          {/* Bottom cinematic fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-56"
            style={{
              background:
                'linear-gradient(to top, rgba(7,7,6,0.92), transparent)',
            }}
          />

          {/* Very subtle warm atmospheric glow */}
          <div
            className="absolute left-[42%] top-[20%] w-[420px] h-[420px] rounded-full opacity-20 blur-[120px]"
            style={{
              backgroundColor: '#b45309',
            }}
          />

        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">

          <div className="max-w-3xl">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-7 animate-fade-in">

              <span className="h-px w-10 bg-amber-500" />

              <span className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase font-medium text-amber-400">
                West African Export Specialists
              </span>

            </div>

            {/* Main Heading */}
            <h1
              className="
                font-serif
                text-[42px]
                sm:text-5xl
                md:text-6xl
                lg:text-[72px]
                xl:text-[78px]
                font-medium
                leading-[0.98]
                tracking-[-0.035em]
                text-white
                mb-7
                animate-slide-up
              "
            >
              Premium Nigerian
              <br />

              <span className="text-white">
                Charcoal.
              </span>

              <br />

              <span
                className="text-amber-400"
                style={{
                  textShadow:
                    '0 0 30px rgba(245,158,11,0.12)',
                }}
              >
                Delivered Worldwide.
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                max-w-2xl
                text-[15px]
                md:text-[17px]
                leading-[1.75]
                text-white/70
                mb-9
                animate-slide-up
              "
            >
              WAPAC supplies export-grade Nigerian charcoal and allied
              agricultural commodities to distributors, wholesalers,
              and industrial buyers worldwide — with dependable quality,
              scalable supply, and complete export documentation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12 animate-slide-up">

              <button
                onClick={() => setInquiryOpen(true)}
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  px-7
                  py-4
                  bg-amber-500
                  hover:bg-amber-400
                  text-black
                  text-[11px]
                  tracking-[0.16em]
                  uppercase
                  font-semibold
                  transition-all
                  duration-300
                  shadow-[0_10px_40px_rgba(245,158,11,0.18)]
                  hover:shadow-[0_15px_50px_rgba(245,158,11,0.28)]
                "
              >
                Request Bulk Quote

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <Link
                to="/products"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  px-7
                  py-4
                  border
                  border-white/20
                  bg-white/[0.04]
                  backdrop-blur-md
                  hover:bg-white/[0.09]
                  hover:border-white/35
                  text-white
                  text-[11px]
                  tracking-[0.16em]
                  uppercase
                  font-semibold
                  transition-all
                  duration-300
                "
              >
                Explore Products

                <ArrowRight size={15} />
              </Link>

            </div>

          </div>

          {/* =====================================================
              TRUST FEATURES
              ===================================================== */}
          <div
            className="
              relative
              grid
              grid-cols-2
              lg:grid-cols-4
              max-w-4xl
              border
              border-white/[0.13]
              bg-black/25
              backdrop-blur-xl
              animate-fade-in
            "
          >

            {trustFeatures.map((feature, idx) => (
              <div
                key={idx}
                className={`
                  group
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  md:px-6
                  md:py-5
                  transition-all
                  duration-300
                  hover:bg-white/[0.05]

                  ${idx < 2 ? 'border-b border-white/[0.10] lg:border-b-0' : ''}
                  ${idx % 2 === 0 ? 'border-r border-white/[0.10]' : ''}
                  ${idx === 1 ? 'lg:border-r border-white/[0.10]' : ''}
                  ${idx === 2 ? 'lg:border-r border-white/[0.10]' : ''}
                `}
              >

                {/* Small premium icon */}
                <div
                  className="
                    w-9
                    h-9
                    md:w-10
                    md:h-10
                    shrink-0
                    flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-amber-400/25
                    bg-amber-400/[0.08]
                    text-amber-400
                    transition-all
                    duration-300
                    group-hover:bg-amber-400/[0.14]
                    group-hover:border-amber-400/40
                  "
                >
                  <feature.icon
                    size={17}
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <span
                    className="
                      block
                      text-[10px]
                      md:text-[11px]
                      tracking-[0.08em]
                      uppercase
                      font-medium
                      text-white/90
                    "
                  >
                    {feature.title}
                  </span>

                  <span className="block mt-1 text-[9px] tracking-[0.08em] text-white/40">
                    WAPAC STANDARD
                  </span>
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          FEATURED PRODUCTS
          ========================================================= */}
      <section
        className="py-20 md:py-28"
        style={{ backgroundColor: 'var(--tcf-bg)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-12">

            <span
              className="text-[11px] tracking-[0.25em] uppercase font-medium"
              style={{ color: 'var(--tcf-accent)' }}
            >
              {settings.featured_eyebrow || 'Featured Catalog'}
            </span>

            <h2
              className="font-serif text-3xl md:text-4xl font-bold mt-3"
              style={{ color: 'var(--tcf-text)' }}
            >
              {settings.featured_title ||
                'Premium Charcoal for Every Market'}
            </h2>

          </div>

          {loading ? (

            <div className="flex justify-center py-20">
              <Loader2
                className="animate-spin"
                size={28}
                style={{ color: 'var(--tcf-accent)' }}
              />
            </div>

          ) : fetchError ? (

            <p
              className="text-center text-sm"
              style={{ color: 'var(--tcf-secondary-text)' }}
            >
              Failed to load products. Please refresh the page.
            </p>

          ) : products.length === 0 ? (

            <p
              className="text-center text-sm"
              style={{ color: 'var(--tcf-secondary-text)' }}
            >
              Products coming soon.
            </p>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>

          )}

          <div className="text-center mt-12">

            <Link
              to="/products"
              className="
                inline-flex
                items-center
                gap-2
                px-8
                py-3
                text-sm
                tracking-wide
                uppercase
                font-medium
                border
                transition-all
                duration-300
                hover:shadow-lg
              "
              style={{
                borderColor: 'var(--tcf-accent)',
                color: 'var(--tcf-accent)',
              }}
            >
              View All Charcoal
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>
      </section>


      {/* =========================================================
          WHY CHOOSE US
          ========================================================= */}
      <section
        className="py-20 md:py-28"
        style={{ backgroundColor: 'var(--tcf-primary)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-12">

            <span
              className="text-[11px] tracking-[0.25em] uppercase font-medium"
              style={{ color: 'var(--tcf-accent)' }}
            >
              Why Importers Choose Wapac
            </span>

            <h2
              className="font-serif text-3xl md:text-4xl font-bold mt-3"
              style={{ color: 'var(--tcf-text)' }}
            >
              Built for international trade.
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[
              {
                icon: Globe,
                title: 'Global Bulk Shipping',
                desc:
                  settings.trust_badge_1_desc ||
                  '40+ countries served with full export documentation on every shipment.',
              },
              {
                icon: ShieldCheck,
                title: 'SGS Certified Quality',
                desc:
                  settings.trust_badge_2_desc ||
                  'Every batch independently verified for fixed carbon, ash, and moisture content.',
              },
              {
                icon: FileText,
                title: 'Flexible Payment Options',
                desc:
                  settings.trust_badge_3_desc ||
                  'Pay via FlutterWave, Paystack, Payoneer, or T/T bank transfer.',
              },
              {
                icon: Package,
                title: 'Custom OEM Packaging',
                desc:
                  settings.trust_badge_4_desc ||
                  'Private-label branding, custom carton weights, and retail-ready packaging.',
              },
            ].map((item, idx) => (

              <div
                key={idx}
                className="
                  p-8
                  transition-all
                  duration-300
                  hover:shadow-xl
                "
                style={{
                  backgroundColor: 'var(--tcf-card)',
                  border: '1px solid var(--tcf-border)',
                }}
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-full
                    flex
                    items-center
                    justify-center
                    mb-5
                  "
                  style={{
                    background:
                      'linear-gradient(135deg, #f97316, #f59e0b)',
                  }}
                >
                  <item.icon
                    size={22}
                    className="text-white"
                  />
                </div>

                <h3
                  className="font-serif text-lg font-bold mb-3"
                  style={{ color: 'var(--tcf-text)' }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: 'var(--tcf-secondary-text)',
                  }}
                >
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* =========================================================
          PROCESS
          ========================================================= */}
      <section
        className="py-20 md:py-28"
        style={{ backgroundColor: 'var(--tcf-bg)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-12">

            <span
              className="text-[11px] tracking-[0.25em] uppercase font-medium"
              style={{ color: 'var(--tcf-accent)' }}
            >
              {settings.process_eyebrow || 'How It Works'}
            </span>

            <h2
              className="font-serif text-3xl md:text-4xl font-bold mt-3"
              style={{ color: 'var(--tcf-text)' }}
            >
              {settings.process_title ||
                'From inquiry to shipment in four steps.'}
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {[
              {
                step: '01',
                title: 'Submit Inquiry',
                desc:
                  'Tell us your product, quantity, and destination port.',
              },
              {
                step: '02',
                title: 'Receive Quote',
                desc:
                  'Get a detailed quote with pricing and shipping within 24 hours.',
              },
              {
                step: '03',
                title: 'Confirm Order',
                desc:
                  'Approve the quote and arrange payment via your preferred method.',
              },
              {
                step: '04',
                title: 'Shipment',
                desc:
                  'We process, document, and ship your order with full tracking.',
              },
            ].map((item, idx) => (

              <div key={idx} className="relative">

                <div
                  className="
                    w-12
                    h-12
                    flex
                    items-center
                    justify-center
                    font-serif
                    text-lg
                    font-bold
                    mb-4
                    rounded-full
                  "
                  style={{
                    backgroundColor: 'var(--tcf-accent)',
                    color: 'var(--tcf-button-text)',
                  }}
                >
                  {item.step}
                </div>

                <h3
                  className="font-serif text-lg font-bold mb-2"
                  style={{ color: 'var(--tcf-text)' }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: 'var(--tcf-secondary-text)',
                  }}
                >
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* =========================================================
          OPERATIONS SLIDER
          ========================================================= */}
      <Slider />


      {/* =========================================================
          FAQ
          ========================================================= */}
      <section
        className="py-20 md:py-28"
        style={{ backgroundColor: 'var(--tcf-primary)' }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-12">

            <span
              className="text-[11px] tracking-[0.25em] uppercase font-medium"
              style={{ color: 'var(--tcf-accent)' }}
            >
              Frequently Asked Questions
            </span>

            <h2
              className="font-serif text-3xl md:text-4xl font-bold mt-3"
              style={{ color: 'var(--tcf-text)' }}
            >
              Everything importers need to know.
            </h2>

          </div>

          <div className="space-y-3">

            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                question={faq.q}
                answer={faq.a}
              />
            ))}

          </div>

        </div>
      </section>


      {/* =========================================================
          BLOG PREVIEW
          ========================================================= */}
      {posts.length > 0 && (
        <section
          className="py-20 md:py-28"
          style={{ backgroundColor: 'var(--tcf-bg)' }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            <div className="text-center mb-12">

              <span
                className="text-[11px] tracking-[0.25em] uppercase font-medium"
                style={{ color: 'var(--tcf-accent)' }}
              >
                Latest Insights
              </span>

              <h2
                className="font-serif text-3xl md:text-4xl font-bold mt-3"
                style={{ color: 'var(--tcf-text)' }}
              >
                News & Resources
              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {posts.map((post) => (

                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="
                    group
                    transition-all
                    duration-300
                    hover:shadow-xl
                  "
                  style={{
                    backgroundColor: 'var(--tcf-card)',
                    border: '1px solid var(--tcf-border)',
                  }}
                >

                  <div
                    className="aspect-video overflow-hidden"
                    style={{
                      backgroundColor: 'var(--tcf-bg)',
                    }}
                  >

                    {post.hero_image_url && (
                      <img
                        src={post.hero_image_url}
                        alt={post.title}
                        className="
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    )}

                  </div>

                  <div className="p-5">

                    <span
                      className="text-[10px] tracking-[0.2em] uppercase"
                      style={{ color: 'var(--tcf-accent)' }}
                    >
                      {post.category || 'General'}
                    </span>

                    <h3
                      className="
                        font-serif
                        text-lg
                        font-bold
                        mt-2
                        mb-2
                        transition-colors
                        group-hover:opacity-80
                      "
                      style={{ color: 'var(--tcf-text)' }}
                    >
                      {post.title}
                    </h3>

                    <p
                      className="
                        text-sm
                        leading-relaxed
                        line-clamp-2
                      "
                      style={{
                        color: 'var(--tcf-secondary-text)',
                      }}
                    >
                      {post.excerpt ||
                        post.body.substring(0, 100)}
                    </p>

                  </div>

                </Link>

              ))}

            </div>

          </div>
        </section>
      )}


      {/* Inquiry Modal */}
      <InquiryForm
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />

    </div>
  );
}


/* =============================================================
   FAQ ITEM
   ============================================================= */

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: '1px solid var(--tcf-border)',
      }}
    >

      <button
        onClick={() => setOpen(!open)}
        className="
          w-full
          flex
          items-center
          justify-between
          p-5
          text-left
          transition-colors
          hover:opacity-80
        "
      >

        <span
          className="font-medium text-sm md:text-base"
          style={{ color: 'var(--tcf-text)' }}
        >
          {question}
        </span>

        {open ? (
          <Minus
            size={18}
            style={{ color: 'var(--tcf-accent)' }}
          />
        ) : (
          <Plus
            size={18}
            style={{ color: 'var(--tcf-accent)' }}
          />
        )}

      </button>

      {open && (
        <div
          className="
            px-5
            pb-5
            text-sm
            leading-relaxed
          "
          style={{
            color: 'var(--tcf-secondary-text)',
          }}
        >
          {answer}
        </div>
      )}

    </div>
  );
}