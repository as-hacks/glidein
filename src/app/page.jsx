export const metadata = {
  title: 'Glide.in Studios | Video Production & Performance Marketing',
  description: 'Welcome to Glide.in Studios. We combine high-end cinematic video production with data-driven performance marketing to scale your brand. View our creative portfolio.',
};

import { supabase } from '@/supabaseClient';
import LandingPageClient from '@/components/LandingPageClient';
import Hero from '@/components/Hero';
import WhyUs from '@/components/WhyUs';
import TechStack from '@/components/TechStack';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';

export default async function Home() {
  // Fetch visibility
  const { data: visibilityData } = await supabase.from('section_visibility').select('*');
  const visibility = {};
  if (visibilityData) {
    visibilityData.forEach(item => visibility[item.section_id] = item.is_visible);
  }

  // Fetch services for contact form
  const { data: services } = await supabase.from('services').select('*').eq('is_visible', true);

  // Fetch settings
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Glide.in Studios',
    url: 'https://www.glidein.in',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPageClient>
        {visibility.hero && <Hero settings={settings} />}
        {visibility.why_us && <WhyUs settings={settings} />}
        <TechStack />
        {visibility.services && <Services />}
        {visibility.portfolio && <Portfolio />}
        {visibility.contact && <Contact settings={settings} services={services || []} />}
      </LandingPageClient>
    </>
  );
}
