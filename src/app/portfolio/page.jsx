export const metadata = {
  title: 'Portfolio | Glidein Studios',
  description: 'Explore our latest video production and digital marketing projects.',
};

import PortfolioListClient from '@/components/PortfolioListClient';

export default function PortfolioPage() {
  return (
    <main style={{ paddingTop: '100px' }}>
      <PortfolioListClient />
    </main>
  );
}
