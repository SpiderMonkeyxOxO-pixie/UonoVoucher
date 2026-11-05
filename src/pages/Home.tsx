import { Seo } from '../components/Seo';
import { Hero } from '../components/Hero';
import { CategoryRibbon } from '../components/CategoryRibbon';
import { GamesPreviewSection } from '../components/GamesPreviewSection';
import { PromoCodeSection } from '../components/PromoCodeSection';
import { GuidesSection } from '../components/GuidesSection';
import { TransparencySection } from '../components/TransparencySection';

export function Home() {
  return (
    <>
      <Seo
        title="Uono & Uono Play Promo Codes, Vouchers and Games | UonoVoucher"
        description="UonoVoucher is an independent hub for Uono and Uono Play: manually reviewed promo codes, vouchers and status updates across every documented Uono game."
        path="/"
      />
      <Hero />
      <PromoCodeSection />
      <CategoryRibbon />
      <GamesPreviewSection />
      <GuidesSection />
      <TransparencySection />
    </>
  );
}
