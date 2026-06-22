import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ServicePage.css';

const ServicePage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
      
    if (data) {
      setService(data);
    } else {
      console.error("Error fetching service", error);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading Service...</div>;
  if (!service) return <div className="loading">Service not found.</div>;

  return (
    <article className="service-page-section">
      <div className="glow-orb glow-primary" style={{ top: '10%', left: '10%' }}></div>
      <div className="glow-orb glow-secondary" style={{ bottom: '10%', right: '10%' }}></div>

      <div className="service-page-container glass-panel">
        <div className="service-page-header">
          <Link to="/" state={{ scrollTo: 'services' }} className="back-link">&larr; Back to Services</Link>
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
            <Link to="/" state={{ scrollTo: 'contact' }} className="btn-solid glow-button">Let's Talk</Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServicePage;
