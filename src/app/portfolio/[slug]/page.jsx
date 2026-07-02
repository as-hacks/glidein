import { supabase } from '@/supabaseClient';
import { slugify } from '@/utils/slugify';
import ProjectDetailClient from '@/components/ProjectDetailClient';

async function getProjectBySlug(slug) {
  if (!slug) return null;

  // Check if slug is a valid UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
  if (isUuid) {
    const { data } = await supabase
      .from('portfolio')
      .select('id, title, client_name')
      .eq('id', slug)
      .single();
    if (data) return data;
  }

  // Fetch titles and ids to match the slug
  const { data: list } = await supabase
    .from('portfolio')
    .select('id, title, client_name');

  if (!list) return null;

  const matched = list.find((p) => slugify(p.title) === slug);
  return matched || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: { absolute: 'Project Details | Glide.in Studios' } };
  }

  const clientStr = project.client_name ? ` for ${project.client_name}` : '';
  return {
    title: { absolute: `${project.title}${clientStr} | Case Study | Glide.in Studios` },
    description: `Explore the creative process and results for ${project.title}${clientStr}, executed by Glide.in Studios, the premier production house in Madhya Pradesh, India.`,
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return <div className="loading" style={{ color: 'var(--text-color)', padding: '120px 20px', textAlign: 'center' }}>Project not found.</div>;
  }

  return (
    <main style={{ paddingTop: '100px' }}>
      <ProjectDetailClient projectId={project.id} />
    </main>
  );
}
