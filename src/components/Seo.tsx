import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
}

const SITE_NAME = 'UonoVoucher';
const SITE_URL = 'https://uonovoucher.com';
const SITE_IMAGE = `${SITE_URL}/uonovoucher-logo.png`;

function setMetaByName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function Seo({ title, description, path = '/' }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    setMetaByName('description', description);
    const url = `${SITE_URL}${path}`;
    setCanonical(url);
    setMetaByProperty('og:title', fullTitle);
    setMetaByProperty('og:description', description);
    setMetaByProperty('og:url', url);
    setMetaByProperty('og:type', 'website');
    setMetaByProperty('og:site_name', SITE_NAME);
    setMetaByProperty('og:image', SITE_IMAGE);
    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', fullTitle);
    setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', SITE_IMAGE);
  }, [title, description, path]);

  return null;
}
