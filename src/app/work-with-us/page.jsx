export const metadata = {
  title: { absolute: 'Careers in Video Production & Growth Marketing | Glide.in Studios' },
  description: 'Join the top creative agency in Madhya Pradesh, India. Apply for director, editor, marketer, or designer roles and build extraordinary brand stories.',
};

import { supabase } from '@/supabaseClient';
import WorkWithUs from '@/components/WorkWithUs';

export default async function WorkWithUsPage() {
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  return <WorkWithUs settings={settings} />;
}
