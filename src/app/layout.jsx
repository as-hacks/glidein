import '../index.css';
import { supabase } from '@/supabaseClient';
import ThemeLayout from '@/components/ThemeLayout';

export const metadata = {
  metadataBase: new URL('https://www.glidein.in'),
  title: {
    default: 'Glide.in Studios | Video Production & Performance Marketing Agency',
    template: '%s | Glide.in Studios',
  },
  description: 'Glide.in Studios is a premium creative agency combining cinematic video production, performance marketing, and branding. We craft high-converting campaigns across Indore, Bhopal, Ujjain, Madhya Pradesh, and India.',
  keywords: ['video production agency', 'growth marketing agency', 'creative production house', 'cinematic brand videos', 'commercial film production', 'performance marketing', 'UI/UX design', 'Indore agency', 'Bhopal studio', 'Ujjain video creators', 'Madhya Pradesh marketing'],
  openGraph: {
    title: 'Glide.in Studios | Video Production & Performance Marketing Agency',
    description: 'Elevate your brand with cinematic production and data-driven performance marketing.',
    url: 'https://www.glidein.in',
    siteName: 'Glide.in Studios',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Glide.in Studios Creative Showreel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glide.in Studios | Creative Agency',
    description: 'Cinematic storytelling and data-driven marketing campaigns.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Use Incremental Static Regeneration (ISR) to cache the pages but revalidate periodically
export const revalidate = 60; 

export default async function RootLayout({ children }) {
  // Fetch settings once for the entire layout
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeLayout settings={settingsData}>
          {children}
        </ThemeLayout>
      </body>
    </html>
  );
}
