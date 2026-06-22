import '../index.css';
import { supabase } from '@/supabaseClient';
import ThemeLayout from '@/components/ThemeLayout';

export const metadata = {
  metadataBase: new URL('https://glidein.in'),
  title: {
    default: 'Glidein Studios | Creative Video Production & Digital Marketing Agency',
    template: '%s | Glidein Studios',
  },
  description: 'Glidein Studios is a premium creative agency combining cinematic video production, performance marketing, and branding. We craft high-converting campaigns.',
  keywords: ['video production agency', 'digital marketing agency', 'creative production house', 'cinematic brand videos', 'commercial film production', 'performance marketing', 'UI/UX design'],
  openGraph: {
    title: 'Glidein Studios | Creative Video Production & Digital Marketing Agency',
    description: 'Elevate your brand with cinematic production and data-driven performance marketing.',
    url: 'https://glidein.in',
    siteName: 'Glidein Studios',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Glidein Studios Creative Showreel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glidein Studios | Creative Agency',
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
