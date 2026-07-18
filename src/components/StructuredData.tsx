import { useEffect } from 'react';

const SITE_URL = 'https://uonovoucher.com';

interface StructuredDataProps {
  id: string;
  breadcrumb?: { name: string; path: string }[];
  faq?: { question: string; answer: string }[];
}

export function StructuredData({ id, breadcrumb, faq }: StructuredDataProps) {
  useEffect(() => {
    const scripts: HTMLScriptElement[] = [];

    if (breadcrumb && breadcrumb.length > 0) {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = `${id}-breadcrumb`;
      el.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${SITE_URL}${item.path}`,
        })),
      });
      document.head.appendChild(el);
      scripts.push(el);
    }

    if (faq && faq.length > 0) {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = `${id}-faq`;
      el.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      });
      document.head.appendChild(el);
      scripts.push(el);
    }

    return () => {
      scripts.forEach((el) => el.remove());
    };
  }, [id, breadcrumb, faq]);

  return null;
}
