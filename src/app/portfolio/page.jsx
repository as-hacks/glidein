export const metadata = {
  title: { absolute: 'Creative Portfolio & Case Studies | Glide.in Studios' },
  description: 'Explore our latest cinematic corporate videos, brand ads, social campaigns, and performance marketing projects executed in Indore, Bhopal, Ujjain, and India.',
};

import PortfolioListClient from '@/components/PortfolioListClient';

export default function PortfolioPage() {
  return (
    <main style={{ paddingTop: '100px' }}>
      <PortfolioListClient />
    </main>
  );
}
