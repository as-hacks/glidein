import { supabase } from '@/supabaseClient';
import { slugify } from '@/utils/slugify';
import BlogPostClient from '@/components/BlogPostClient';

// Helper to look up a blog post by slug or UUID
async function getBlogBySlug(slug) {
  if (!slug) return null;

  // Check if slug is a valid UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
  if (isUuid) {
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', slug)
      .single();
    if (data) return data;
  }

  // Fetch all blog titles and IDs to locate matches
  const { data: list } = await supabase
    .from('blogs')
    .select('id, title');

  if (!list) return null;

  const matched = list.find((b) => slugify(b.title) === slug);
  if (!matched) return null;

  // Fetch full details of the matched blog post
  const { data } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', matched.id)
    .single();

  return data;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: { absolute: 'Blog Not Found | Glide.in Studios' } };
  }

  // Extract a snippet of the content for the description
  const description = blog.content
    ? blog.content.substring(0, 160).replace(/<[^>]+>/g, '') + '...'
    : 'Read this article on the Glide.in Studios blog.';

  return {
    title: { absolute: `${blog.title} | Insights Blog | Glide.in Studios` },
    description,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return <div className="loading" style={{ color: 'var(--text-color)', padding: '120px 20px', textAlign: 'center' }}>Blog not found.</div>;
  }

  return <BlogPostClient blog={blog} />;
}
