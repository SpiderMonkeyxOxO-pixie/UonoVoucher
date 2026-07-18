import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/ToastContext';
import { ScrollToTop } from './components/ScrollToTop';

import { Home } from './pages/Home';
import { GamesList } from './pages/GamesList';
import { GameDetail } from './pages/GameDetail';
import { PromoCodesList } from './pages/PromoCodesList';
import { PromoCodeDetail } from './pages/PromoCodeDetail';
import { VouchersList } from './pages/VouchersList';
import { GuidesList } from './pages/GuidesList';
import { GuideDetail } from './pages/GuideDetail';
import { BlogList } from './pages/BlogList';
import { BlogDetail } from './pages/BlogDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { EditorialPolicy } from './pages/EditorialPolicy';
import { CodeReviewPolicy } from './pages/CodeReviewPolicy';
import { CorrectionsPolicy } from './pages/CorrectionsPolicy';
import { Disclaimer } from './pages/Disclaimer';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { Sitemap } from './pages/Sitemap';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/uono-games/" element={<GamesList />} />
          <Route path="/uono-games/:slug" element={<GameDetail />} />
          <Route path="/promo-codes/" element={<PromoCodesList />} />
          <Route path="/promo-codes/:slug" element={<PromoCodeDetail />} />
          <Route path="/vouchers/" element={<VouchersList />} />
          <Route path="/guides/" element={<GuidesList />} />
          <Route path="/guides/:slug" element={<GuideDetail />} />
          <Route path="/blog/" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/about/" element={<About />} />
          <Route path="/contact/" element={<Contact />} />
          <Route path="/editorial-policy/" element={<EditorialPolicy />} />
          <Route path="/code-review-policy/" element={<CodeReviewPolicy />} />
          <Route path="/corrections-policy/" element={<CorrectionsPolicy />} />
          <Route path="/disclaimer/" element={<Disclaimer />} />
          <Route path="/privacy-policy/" element={<PrivacyPolicy />} />
          <Route path="/terms/" element={<Terms />} />
          <Route path="/sitemap/" element={<Sitemap />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}

export default App;
