export const metadata = {
  title: 'Insights & Articles | Glidein Studios',
  description: 'Read our latest thoughts, stories and ideas on video production, digital marketing, and design.',
};

import { supabase } from '@/supabaseClient';
import BlogListClient from '@/components/BlogListClient';

export default async function BlogPage() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  return <BlogListClient initialBlogs={blogs || []} />;
}
