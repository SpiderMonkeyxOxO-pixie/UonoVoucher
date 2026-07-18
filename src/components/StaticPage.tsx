import type { ReactNode } from 'react';
import { Seo } from './Seo';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

interface StaticPageProps {
  title: string;
  description: string;
  path: string;
  crumbLabel: string;
  intro?: string;
  children: ReactNode;
}

export function StaticPage({ title, description, path, crumbLabel, intro, children }: StaticPageProps) {
  const crumbs: Crumb[] = [{ label: 'Home', to: '/' }, { label: crumbLabel }];

  return (
    <>
      <Seo title={title} description={description} path={path} />
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="prose" style={{ maxWidth: 760 }}>
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
