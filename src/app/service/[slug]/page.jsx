import { supabase } from '@/supabaseClient';
import { slugify } from '@/utils/slugify';
import ScrollLink from '@/components/ScrollLink';
import '@/components/ServicePage.css';

// Helper to look up a service by slug or UUID
async function getServiceBySlug(slug) {
  if (!slug) return null;

  // Check if slug is a valid UUID (legacy fallback)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
  if (isUuid) {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('id', slug)
      .single();
    if (data) return data;
  }

  // Fetch all service titles and IDs to locate matches
  const { data: list } = await supabase
    .from('services')
    .select('id, title');

  if (!list) return null;

  const matched = list.find(s => slugify(s.title) === slug);
  if (!matched) return null;

  // Fetch the full details for the matched service
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('id', matched.id)
    .single();

  return data;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: 'Service Not Found | Glidein Studios' };
  }

  return {
    title: `${service.title} | Glidein Services`,
    description: service.description,
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return <div className="loading" style={{ color: 'var(--text-color)', padding: '120px 20px', textAlign: 'center' }}>Service not found.</div>;
  }

  return (
    <article className="service-page-section">
      <div className="glow-orb glow-primary" style={{ top: '10%', left: '10%' }}></div>
      <div className="glow-orb glow-secondary" style={{ bottom: '10%', right: '10%' }}></div>

      <div className="service-page-container glass-panel">
        <div className="service-page-header">
          <ScrollLink targetId="services" className="back-link">&larr; Back to Services</ScrollLink>
          <div className="service-page-category">
            <span className="category-tag">{service.category}</span>
          </div>
          <h1 className="service-page-title">{service.title}</h1>
        </div>

        {service.image_url && (
          <div className="service-page-hero-image">
            <img src={service.image_url} alt={service.title} />
          </div>
        )}

        <div className="service-page-content">
          {service.content ? (
            <div dangerouslySetInnerHTML={{ __html: service.content }}></div>
          ) : (
            <div className="service-page-fallback">
              <p>{service.description}</p>
              <p><em>Check back soon for a detailed description of this service.</em></p>
            </div>
          )}
        </div>

        <div className="service-page-footer">
          <div className="cta-box">
            <h2>Ready to get started?</h2>
            <p>Let's discuss how our {service.title} services can help scale your business.</p>
            <ScrollLink targetId="contact" className="btn-solid glow-button">Let's Talk</ScrollLink>
          </div>
        </div>
      </div>
    </article>
  );
}
