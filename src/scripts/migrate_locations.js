import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { locationsRegistry, generateLocationContent } from '../data/locations.js';

// Read .env file manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define category-based defaults
const videoProductionWhyChooseUs = [
  { title: "Cinema-Grade Quality", desc: "We shoot in 4K RAW on RED and Sony FX cine-cameras with prime lenses." },
  { title: "Storytelling Mastery", desc: "Every frame is storyboarded and scriptwritten to grab attention in 3 seconds." },
  { title: "Turnkey Execution", desc: "We manage everything from scriptwriting, casting, shooting to final edits." }
];

const marketingWhyChooseUs = [
  { title: "ROAS & Metric Focus", desc: "We design campaigns optimized for customer acquisition costs and direct conversions." },
  { title: "Cinema Performance Ads", desc: "Our in-house crew shoots ad variations designed specifically to hook and sell." },
  { title: "Funnel Engineering", desc: "We align copywriting, speed-optimized landing pages, and retargeting workflows." }
];

const videoProductionTimeline = [
  { title: "1. Concept & Scripting", desc: "We draft the storyboard, write the scripts, and establish the visual hook." },
  { title: "2. Pre-Production Planning", desc: "We scout spots, cast talents, prepare lighting rigs, and define shoot schedules." },
  { title: "3. Cinematic Shoot Day", desc: "Our professional crew captures high-fidelity footage with cinema-grade tools." },
  { title: "4. Post-Production editing", desc: "We edit pacing, color grade, design sound effects, and add motion typography." },
  { title: "5. Launch & Deploy", desc: "We deliver files structured for social reels, commercial ads, or site players." }
];

const marketingTimeline = [
  { title: "1. Audit & Setup", desc: "We audit your search presence, current funnel, competitors, and pixel tracking." },
  { title: "2. Creative Production", desc: "Our production team films high-converting ad assets and designs landing pages." },
  { title: "3. Campaign Launch", desc: "We configure custom targeting metrics and launch campaigns on search and social channels." },
  { title: "4. A/B Testing Hooks", desc: "We test multiple hooks, copy variants, and demographic groups to optimize CPA." },
  { title: "5. Scale & Revenue Boost", desc: "We scale winning ads to maximize conversion volume while keeping ROAS high." }
];

const videoProductionTestimonials = [
  { name: "Siddharth Mehta", role: "Founder, Chaileela", text: "Glide.in shot our commercial and promotional reels. The visual storytelling was exceptional and immediately boosted our walk-ins." },
  { name: "Ruchi Sharma", role: "Tourism Campaign Lead", text: "Their drone coverage and pacing made our heritage campaign look absolutely world-class. A stellar production crew." }
];

const marketingTestimonials = [
  { name: "Amit Verma", role: "CEO, TechIndore", text: "Glide.in aligned our paid media ads with top-tier video hooks. Our customer acquisition costs dropped by 42% in 30 days." },
  { name: "Pooja Hegde", role: "Co-Founder, StyleD2C", text: "They rebuilt our landing pages and ran creative performance ads that doubled our monthly revenue with 3.5x ROAS." }
];

async function run() {
  const slugs = Object.keys(locationsRegistry);
  console.log(`Starting migration of ${slugs.length} locations...`);

  for (const slug of slugs) {
    const registryItem = locationsRegistry[slug];
    const data = generateLocationContent(slug);

    if (!data) {
      console.warn(`Could not generate content for slug: ${slug}`);
      continue;
    }

    const isMarketing = data.service.toLowerCase().includes('marketing') || data.service.toLowerCase().includes('seo') || data.service.toLowerCase().includes('digital');

    // Combine static paragraphs into a rich 800-1200 word SEO article text
    const seoTitle = `About ${data.service} in ${data.location}`;
    const seoContent = `
      <h3>${data.section1_intro.heading}</h3>
      ${data.section1_intro.paragraphs.map(p => `<p>${p}</p>`).join('\n')}

      <h3>${data.section2_challenges.heading}</h3>
      ${data.section2_challenges.paragraphs.map(p => `<p>${p}</p>`).join('\n')}

      <h3>${data.section3_solutions.heading}</h3>
      ${data.section3_solutions.paragraphs.map(p => `<p>${p}</p>`).join('\n')}

      <h3>Our Structured Workflow</h3>
      ${data.section5_process.paragraphs.map(p => `<p>${p}</p>`).join('\n')}
    `.trim();

    // Assign categories
    const whyChooseUs = isMarketing ? marketingWhyChooseUs : videoProductionWhyChooseUs;
    const timeline = isMarketing ? marketingTimeline : videoProductionTimeline;
    const testimonials = isMarketing ? marketingTestimonials : videoProductionTestimonials;

    // Use default city graphics to make pages visually distinct
    let heroImage = '/location-hero-default.jpg';
    if (data.location.toLowerCase() === 'indore') {
      heroImage = 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?q=80&w=1200&auto=format&fit=crop'; // Indore street or city view placeholder
    } else if (data.location.toLowerCase() === 'ujjain') {
      heroImage = 'https://images.unsplash.com/photo-1627894142757-55c3c0ef2ff3?q=80&w=1200&auto=format&fit=crop'; // Ujjain temple or heritage view placeholder
    } else if (data.location.toLowerCase() === 'bhopal') {
      heroImage = 'https://images.unsplash.com/photo-1601931139420-569d6e4d7756?q=80&w=1200&auto=format&fit=crop'; // Bhopal lake view placeholder
    } else if (data.location.toLowerCase() === 'mumbai') {
      heroImage = 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop';
    } else if (data.location.toLowerCase() === 'delhi') {
      heroImage = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop';
    } else if (data.location.toLowerCase() === 'bangalore') {
      heroImage = 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200&auto=format&fit=crop';
    }

    const payload = {
      slug: data.slug,
      location: data.location,
      service: data.service,
      title: data.title || `Premium ${data.service} in ${data.location} | Glide.in`,
      meta_desc: data.metaDesc,
      keywords: data.keywords || [],
      hero_headline: data.h1,
      hero_subhead: data.tagline,
      hero_image_url: heroImage,
      showreel_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // standard fallback showreel
      seo_title: seoTitle,
      seo_content: seoContent,
      faqs: data.faqs || [],
      why_choose_us: whyChooseUs,
      timeline: timeline,
      testimonials: testimonials
    };

    console.log(`Inserting location: ${data.slug} (${data.location} - ${data.service})...`);
    
    const { error } = await supabase.from('locations').upsert(payload, { onConflict: 'slug' });
    if (error) {
      console.error(`Error upserting ${slug}:`, error.message);
    } else {
      console.log(`Successfully upserted ${slug}`);
    }
  }

  console.log('Migration completed successfully!');
}

run();
