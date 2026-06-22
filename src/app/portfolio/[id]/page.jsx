import { supabase } from '@/supabaseClient';
import ProjectDetailClient from '@/components/ProjectDetailClient';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: project } = await supabase
    .from('portfolio')
    .select('title, client_name')
    .eq('id', id)
    .single();

  if (!project) {
    return { title: 'Project Details | Glidein Studios' };
  }

  const clientStr = project.client_name ? ` for ${project.client_name}` : '';
  return {
    title: `${project.title}${clientStr}`,
    description: `Explore the creative process and results for ${project.title}${clientStr}, executed by Glidein Studios.`,
  };
}

export default async function ProjectPage({ params }) {
  const { id } = await params;
  return (
    <main style={{ paddingTop: '100px' }}>
      <ProjectDetailClient projectId={id} />
    </main>
  );
}
