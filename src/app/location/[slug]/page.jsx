import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/supabaseClient';
import LocationPageClient from '@/components/LocationPageClient';

// Enable Static Site Generation (SSG) for high-performance indexing
export async function generateStaticParams() {
  try {
    const { data: locations } = await supabase
      .from('locations')
      .select('slug');
    
    return (locations || []).map((loc) => ({
      slug: loc.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for locations:', error);
    return [];
  }
}

// Generate page-specific metadata dynamically for search engine bots
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  try {
    const { data: content } = await supabase
      .from('locations')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!content) {
      return {
        title: { absolute: 'Page Not Found | Glide.in Studios' },
        description: 'The requested location-specific page could not be found.',
      };
    }

    return {
      title: { absolute: content.title },
      description: content.meta_desc,
      keywords: content.keywords || [],
      alternates: {
        canonical: `https://www.glidein.in/location/${slug}`,
      },
      openGraph: {
        title: { absolute: content.title },
        description: content.meta_desc,
        url: `https://www.glidein.in/location/${slug}`,
        type: 'article',
        images: content.hero_image_url ? [{ url: content.hero_image_url }] : [],
      },
    };
  } catch (err) {
    console.error('Error generating metadata for location:', err);
    return {
      title: { absolute: 'Glide.in Studios' },
    };
  }
}

export default async function LocationPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch location details, projects, and services in parallel
  const [locationRes, projectsRes, servicesRes] = await Promise.all([
    supabase.from('locations').select('*').eq('slug', slug).single(),
    supabase.from('portfolio').select('*').order('created_at', { ascending: false }),
    supabase.from('services').select('*').eq('is_visible', true).order('created_at', { ascending: false }),
  ]);

  if (locationRes.error || !locationRes.data) {
    console.warn(`Location slug not found in DB: ${slug}`);
    notFound();
  }

  return (
    <LocationPageClient 
      data={locationRes.data} 
      projects={projectsRes.data || []} 
      services={servicesRes.data || []} 
    />
  );
}
