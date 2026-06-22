import { supabase } from '@/supabaseClient';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: service } = await supabase
    .from('services')
    .select('title, description')
    .eq('id', id)
    .single();

  if (!service) {
    return { title: 'Service Not Found | Glidein Studios' };
  }

  return {
    title: `${service.title} | Glidein Services`,
    description: service.description,
  };
}
import ScrollLink from '@/components/ScrollLink';
import '@/components/ServicePage.css';

export default async function ServicePage({ params }) {
  const { id } = await params;

  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !service) {
    return <div className="loading">Service not found.</div>;
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
