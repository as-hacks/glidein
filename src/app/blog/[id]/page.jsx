import { supabase } from '@/supabaseClient';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: blog } = await supabase
    .from('blogs')
    .select('title, content')
    .eq('id', id)
    .single();

  if (!blog) {
    return { title: 'Blog Not Found | Glidein Studios' };
  }

  // Extract a snippet of the content for the description
  const description = blog.content.substring(0, 160).replace(/<[^>]+>/g, '') + '...';

  return {
    title: `${blog.title} | Glidein Studios`,
    description,
  };
}
import BlogPostClient from '@/components/BlogPostClient';

// Next.js dynamic routing parameters are available via the `params` prop
export default async function BlogPostPage({ params }) {
  const { id } = await params;

  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !blog) {
    return <div className="loading">Blog not found.</div>;
  }

  return <BlogPostClient blog={blog} />;
}
