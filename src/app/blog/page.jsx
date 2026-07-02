export const metadata = {
  title: { absolute: 'Video Production & Growth Marketing Insights | Glide.in Studios' },
  description: 'Read the latest trends, guides, and thoughts on filmmaking, video editing, social media branding, and performance marketing in Madhya Pradesh, India.',
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
