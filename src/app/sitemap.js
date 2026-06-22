import { supabase } from '@/supabaseClient';

export default async function sitemap() {
  const baseUrl = 'https://glidein.in';

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
  ];

  try {
    // Dynamic Portfolio Project URLs
    const { data: projects } = await supabase
      .from('portfolio')
      .select('id, created_at');

    const projectUrls = (projects || []).map((project) => ({
      url: `${baseUrl}/portfolio/${project.id}`,
      lastModified: new Date(project.created_at || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    // Dynamic Blog URLs
    const { data: blogs } = await supabase
      .from('blogs')
      .select('id, created_at');

    const blogUrls = (blogs || []).map((blog) => ({
      url: `${baseUrl}/blog/${blog.id}`,
      lastModified: new Date(blog.created_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...routes, ...projectUrls, ...blogUrls];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return routes;
  }
}
