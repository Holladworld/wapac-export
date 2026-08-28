import { Link } from 'react-router-dom';
import { ArrowRight, Globe, ShieldCheck, Package, Leaf, Award, Users } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useSEO } from '../hooks/useSEO';

export default function About() {
  const { settings } = useSettings();

  useSEO({ title: 'About Us', description: 'Wapac Export is a leading Nigerian export company based in Lagos, supplying bulk charcoal and allied commodities to 40+ countries.' });

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/10617802/pexels-photo-10617802.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <span className="text-[11px] tracking-[0.25em] uppercase font-medium text-orange-400 inline-block mb-4">
              About Wapac Export
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white mb-6">
              Your Reliable Export<br />Partner from Nigeria
            </h1>
            <p className="text-lg leading-relaxed text-zinc-300 max-w-xl">
              Wapac Export is a leading Nigerian export company based in Lagos. We supply bulk hardwood charcoal,
              bamboo charcoal, coconut shell charcoal, cocoa, cashew nuts, ginger, and soya beans to importers,
              distributors, and retail brands in 40+ countries worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ backgroundColor: 'var(--tcf-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '40+', label: 'Countries Served' },
            { value: '5-7', label: 'Year Bamboo Cycle' },
            { value: '0%', label: 'Chemical Additives' },
            { value: '100%', label: 'Export Ready' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--tcf-accent)' }}>{stat.value}</div>
              <div className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--tcf-secondary-text)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
            Our Story
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3 mb-8" style={{ color: 'var(--tcf-text)' }}>
            From Nigerian farms to global ports.
          </h2>
          <div className="space-y-6 text-sm md:text-base leading-relaxed" style={{ color: 'var(--tcf-secondary-text)' }}>
            <p>
              Wapac Export was founded with a mission: to connect Nigerian agricultural excellence with global demand.
              From our base in Lagos, we work directly with farming cooperatives and processing facilities across Nigeria
              to source the finest charcoal and allied commodities.
            </p>
            <p>
              Every batch is processed under strict quality control to deliver consistent performance
              — whether it's hardwood charcoal for BBQ markets, bamboo charcoal for shisha, or coconut shell
              charcoal for premium applications. Our allied commodities — cocoa, cashew nuts, ginger, and soya beans —
              are sourced at peak harvest and processed to export-grade standards.
            </p>
            <p>
              We handle the complete export pipeline: sourcing, processing, quality verification, documentation,
              and shipping. Our clients receive full export documentation including certificate of origin,
              phytosanitary certificates, and SGS quality reports with every shipment.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--tcf-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
              Our Values
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3" style={{ color: 'var(--tcf-text)' }}>
              What drives us forward.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Sustainable Sourcing', desc: 'We work with Nigerian farming cooperatives that practice sustainable harvesting and replanting.' },
              { icon: Award, title: 'Quality First', desc: 'Every batch is independently verified for fixed carbon, ash, and moisture content.' },
              { icon: Users, title: 'Client Partnership', desc: 'We build long-term relationships with importers, not one-off transactions.' },
            ].map((item, idx) => (
              <div key={idx} className="p-8" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}>
                  <item.icon size={22} className="text-white" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-3" style={{ color: 'var(--tcf-text)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--tcf-secondary-text)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: 'var(--tcf-bg)' }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--tcf-text)' }}>
            Ready to start trading?
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--tcf-secondary-text)' }}>
            Contact our export team today for a personalized quote.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}
          >
            Contact Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
