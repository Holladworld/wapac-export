import { useEffect } from 'react';

type SEOProps = {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
};

const SITE_NAME = 'Wapac Export';

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSEO({ title, description, ogImage, ogType = 'website', jsonLd }: SEOProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const desc = description || 'Premium Nigerian charcoal and allied agricultural commodities for global importers. SGS certified, export-ready, shipped from Lagos.';

    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', SITE_NAME);
    if (ogImage) setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    if (ogImage) setMeta('name', 'twitter:image', ogImage);

    if (jsonLd) {
      setJsonLd('page-jsonld', jsonLd);
    } else {
      const existing = document.getElementById('page-jsonld');
      if (existing) existing.remove();
    }

    return () => {
      const el = document.getElementById('page-jsonld');
      if (el) el.remove();
    };
  }, [title, description, ogImage, ogType, jsonLd]);
}
