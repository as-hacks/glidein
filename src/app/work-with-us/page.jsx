export const metadata = {
  title: 'Join Our Creative Team | Glidein Studios',
  description: 'We are always looking for creative minds and skilled individuals. Share your work and let\'s build something extraordinary together.',
};

import { supabase } from '@/supabaseClient';
import WorkWithUs from '@/components/WorkWithUs';

export default async function WorkWithUsPage() {
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  return <WorkWithUs settings={settings} />;
}
