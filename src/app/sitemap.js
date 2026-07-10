import { supabase } from '@/supabaseClient';
import { locationsRegistry } from '@/data/locations';
import { slugify } from '@/utils/slugify';

export default async function sitemap() {
  const baseUrl = 'https://www.glidein.in';

  // Base static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/work-with-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/location`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const locationUrls = Object.keys(locationsRegistry).map((slug) => ({
    url: `${baseUrl}/location/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  try {
    // Dynamic Portfolio Project URLs
    const { data: projects } = await supabase
      .from('portfolio')
      .select('id, title, created_at');

    const projectUrls = (projects || []).map((project) => ({
      url: `${baseUrl}/portfolio/${slugify(project.title)}`,
      lastModified: new Date(project.created_at || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    // Dynamic Blog URLs
    const { data: blogs } = await supabase
      .from('blogs')
      .select('id, title, created_at');

    const blogUrls = (blogs || []).map((blog) => ({
      url: `${baseUrl}/blog/${slugify(blog.title)}`,
      lastModified: new Date(blog.created_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    // Dynamic Services URLs
    const { data: services } = await supabase
      .from('services')
      .select('id, title, created_at');

    const serviceUrls = (services || []).map((service) => ({
      url: `${baseUrl}/service/${slugify(service.title)}`,
      lastModified: new Date(service.created_at || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...routes, ...locationUrls, ...projectUrls, ...blogUrls, ...serviceUrls];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return [...routes, ...locationUrls];
  }
}
