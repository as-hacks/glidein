import React from 'react';
import { notFound } from 'next/navigation';
import { generateLocationContent, locationsRegistry } from '@/data/locations';
import LocationPageClient from '@/components/LocationPageClient';

// Enable Static Site Generation (SSG) for high-performance indexing
export async function generateStaticParams() {
  return Object.keys(locationsRegistry).map((slug) => ({
    slug,
  }));
}

// Generate page-specific metadata dynamically for search engine bots
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const content = generateLocationContent(slug);
  
  if (!content) {
    return {
      title: 'Page Not Found | Glide.in Studios',
      description: 'The requested location-specific page could not be found.',
    };
  }

  return {
    title: content.title,
    description: content.metaDesc,
    keywords: content.keywords,
    alternates: {
      canonical: `https://glidein.in/location/${slug}`,
    },
    openGraph: {
      title: content.title,
      description: content.metaDesc,
      url: `https://glidein.in/location/${slug}`,
      type: 'article',
    },
  };
}

export default async function LocationPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const content = generateLocationContent(slug);

  if (!content) {
    notFound();
  }

  return <LocationPageClient data={content} />;
}
