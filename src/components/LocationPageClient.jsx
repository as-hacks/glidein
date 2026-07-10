"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaUtensils, 
  FaGraduationCap, 
  FaHeartbeat, 
  FaIndustry, 
  FaHome, 
  FaHotel, 
  FaPlay, 
  FaArrowLeft, 
  FaArrowRight, 
  FaChevronDown 
} from 'react-icons/fa';
import './LocationPage.css';

// Helper to extract YouTube video ID and return embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1`;
  }
  return null;
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export default function LocationPageClient({ data, projects = [], services = [] }) {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState(null);
  const [showreelPlay, setShowreelPlay] = useState(false);
  const carouselRef = useRef(null);

  const getServiceIcon = (iconName, index) => {
    const iconMap = {
      'cpu': '🧠',
      'video': '🎬',
      'trending-up': '📈',
      'palette': '🎨',
      'code': '💻',
      'smartphone': '📱',
      'search': '🔍',
      'lightbulb': '💡',
      'settings': '⚙️',
      'camera': '📸',
      'mail': '✉️',
      'globe': '🌐',
      'layers': '💎'
    };

    if (iconName && iconMap[iconName.toLowerCase()]) {
      return iconMap[iconName.toLowerCase()];
    }

    if (iconName && iconName.length <= 2) {
      return iconName;
    }

    const defaultIcons = ['✨', '🚀', '🎬', '🎨', '📱', '🔍', '💡', '🛠️'];
    return defaultIcons[index % defaultIcons.length];
  };

  if (!data) return null;

  const toggleFaq = (index) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  const handleContactRedirect = (e) => {
    e.preventDefault();
    sessionStorage.setItem('scrollTo', 'contact');
    router.push('/');
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const cardWidth = 360; // card width + gap
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const showreelEmbed = getYouTubeEmbedUrl(data.showreel_url);

  // Industry configs mapped with corresponding premium icons
  const industries = [
    { name: 'Restaurant', icon: <FaUtensils />, desc: 'Cinematic menu teasers, walk-throughs, and social-first dining hooks.' },
    { name: 'Education', icon: <FaGraduationCap />, desc: 'Campus tours, institutional features, and virtual open-house videos.' },
    { name: 'Healthcare', icon: <FaHeartbeat />, desc: 'Patient journey testimonials, facility showcases, and specialist interviews.' },
    { name: 'Manufacturing', icon: <FaIndustry />, desc: 'Industrial process shoots, plant tours, and high-retention corporate explainers.' },
    { name: 'Real Estate', icon: <FaHome />, desc: 'Cinema-grade architectural walkthroughs, luxury drone listings, and property tours.' },
    { name: 'Hotels', icon: <FaHotel />, desc: 'Premium experiential resort reels, guest room walkthroughs, and tourism ads.' }
  ];

  return (
    <main className="location-detail-container">

      {/* Hero Section */}
      <section className="location-hero">
        <div className="hero-pattern-bg"></div>
        <div className="glow-orb glow-primary" style={{ top: '20%', left: '10%' }}></div>
        <div className="glow-orb glow-secondary" style={{ bottom: '10%', right: '20%' }}></div>
        
        <div className="location-hero-content">
          {/* Back to Hub navigation - inside hero */}
          <Link href="/location" className="back-link">
            <FaArrowLeft className="back-arrow" /> Back to Locations
          </Link>
          <span className="location-badge-glow">
            {(data.service || '').split('|')[0].split(':')[0].trim()} in {data.location}
          </span>
          <h1>
            {data.hero_headline 
              ? data.hero_headline.split('|')[0].split(':')[0].trim() 
              : `${data.service} in ${data.location}`}
          </h1>
          <p className="location-hero-subhead">{data.hero_subhead || data.meta_desc}</p>
          <div className="hero-cta-wrapper">
            <a href="#" onClick={handleContactRedirect} className="btn-solid glow-button">
              Book a Strategy Call
            </a>
            {data.showreel_url && (
              <a href="#showreel" className="btn-outline">
                Watch Showreel
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Showreel Section */}
      {data.showreel_url && (
        <section id="showreel" className="location-showreel-section">
          <div className="section-title-wrap">
            <span className="section-tag">Cinematic Reel</span>
            <h2>Our Production Showreel</h2>
          </div>
          <div className="showreel-video-container glass-panel">
            {!showreelPlay ? (
              <div className="showreel-preview" style={{ backgroundImage: `url(${data.hero_image_url || '/location-hero-default.jpg'})` }}>
                <div className="preview-overlay">
                  <button className="play-btn-circle" onClick={() => setShowreelPlay(true)}>
                    <FaPlay className="play-icon-arrow" />
                  </button>
                  <p>Click to Watch Showreel</p>
                </div>
              </div>
            ) : (
              <div className="showreel-iframe-wrapper">
                {showreelEmbed ? (
                  <iframe
                    src={showreelEmbed}
                    title="Glide.in Showreel"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video src={data.showreel_url} controls autoPlay className="native-video"></video>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Brands We've Worked With Section */}
      <section className="location-brands-section">
        <h3>Brands We've Worked With</h3>
        <div className="brands-logo-row">
          {projects.filter(p => p.client_logo_url).slice(0, 6).map((project, idx) => (
            <div key={idx} className="brand-logo-card glass-panel" title={project.client_name}>
              <img src={project.client_logo_url} alt={project.client_name} className="brand-logo-img" />
            </div>
          ))}
          {/* Default/Fallback brands if not enough logos are set */}
          {projects.filter(p => p.client_logo_url).length < 4 && (
            <>
              <div className="brand-logo-card glass-panel"><span className="fallback-logo-text">CHAILEELA</span></div>
              <div className="brand-logo-card glass-panel"><span className="fallback-logo-text">MP TOURISM</span></div>
              <div className="brand-logo-card glass-panel"><span className="fallback-logo-text">INDORE TECH</span></div>
              <div className="brand-logo-card glass-panel"><span className="fallback-logo-text">CRAFTCO</span></div>
            </>
          )}
        </div>
      </section>

      {/* Featured Projects Carousel Section */}
      <section className="location-projects-carousel">
        <div className="carousel-header-wrap">
          <div className="title-left">
            <span className="section-tag">Case Studies</span>
            <h2>Our Creative Works</h2>
          </div>
          <div className="carousel-nav-buttons">
            <button onClick={() => scrollCarousel('left')} className="nav-btn" aria-label="Previous Project">
              <FaArrowLeft />
            </button>
            <button onClick={() => scrollCarousel('right')} className="nav-btn" aria-label="Next Project">
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className="projects-carousel-container" ref={carouselRef}>
          {projects.map((project) => (
            <div key={project.id} className="project-card-slide glass-panel">
              <Link href={`/portfolio/${slugify(project.title)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="slide-image-container" style={{ backgroundImage: `url(${project.image_url})` }}>
                  <div className="slide-hover-overlay">
                    <span>Explore Project</span>
                  </div>
                </div>
                <div className="slide-details">
                  <span className="slide-category">{project.video_url || 'Video Production'}</span>
                  <h4>{project.title}</h4>
                  <p>{project.client_name}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="carousel-view-all">
          <Link href="/portfolio" className="btn-outline">
            View All Projects
          </Link>
        </div>
      </section>

      {/* Services Cards Section */}
      <section className="location-services-section">
        <div className="section-title-wrap text-center">
          <span className="section-tag">Core Capabilities</span>
          <h2>Our Strategic Services</h2>
        </div>
        <div className="services-grid">
          {services.slice(0, 5).map((service, index) => {
            const displayIcon = getServiceIcon(service.icon, index);
            return (
              <Link 
                href={`/service/${slugify(service.title)}`} 
                key={service.id} 
                className="service-card glass-panel"
              >
                <div className="service-icon">{displayIcon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-number">0{index + 1}</div>
              </Link>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              sessionStorage.setItem('scrollTo', 'services');
              router.push('/');
            }}
            className="btn-outline"
          >
            Explore All Services
          </a>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="location-industries-section">
        <div className="section-title-wrap text-center">
          <span className="section-tag">Target Sectors</span>
          <h2>Industries We Serve</h2>
        </div>
        <div className="industries-flat-list">
          {industries.map((ind, idx) => (
            <div key={idx} className="industry-flat-item">
              <span className="industry-flat-icon">{ind.icon}</span>
              <div className="industry-flat-text">
                <strong className="industry-flat-name">{ind.name}</strong>
                <span className="industry-flat-desc">{ind.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Glide Section */}
      <section className="location-why-section">
        <div className="section-title-wrap">
          <span className="section-tag">Why Us</span>
          <h2>Why Businesses Choose Glide</h2>
        </div>
        <div className="why-bullets-container">
          {(data.why_choose_us && data.why_choose_us.length > 0 ? data.why_choose_us : [
            { title: 'Cinema-Grade Aesthetics', desc: 'We create beautiful campaigns and commercial films shot with top-tier cine lenses and raw color grading.' },
            { title: 'ROAS & Revenue Minded', desc: 'We do not report on vanity views. We build campaigns configured specifically to maximize conversion rates.' },
            { title: 'Full Funnel Ownership', desc: 'Our in-house crew handles everything: scripts, shoots, copywriting, landing pages, and search optimization.' }
          ]).map((item, idx) => (
            <div key={idx} className="why-bullet-item">
              <span className="why-bullet-dot"></span>
              <div className="why-bullet-content">
                <h3 className="why-bullet-title">{item.title}</h3>
                <p className="why-bullet-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Workflow Timeline Section */}
      <section className="location-timeline-section">
        <div className="section-title-wrap text-center">
          <span className="section-tag">Our Process</span>
          <h2>How Glide.in Works</h2>
          <p className="section-desc">How Glide.in approaches content creation or marketing campaigns to scale your brand</p>
        </div>
        <div className="timeline-clean-container">
          <div className="timeline-line"></div>
          <div className="timeline-points-wrap">
            {(data.timeline && data.timeline.length > 0 ? data.timeline : [
              { title: 'Strategy Audit', desc: 'We audit search keywords, competitor campaigns, and setup conversion pipelines.' },
              { title: 'Scripting & Visuals', desc: 'Our creatives pitch angles, write scripts, and plan the shoot assets.' },
              { title: 'Cinematic Production', desc: 'We film corporate stories and social reels with cinema-grade tools.' },
              { title: 'Edit & Pacing', desc: 'We edit with high retention pacing, sound design, and grading overlays.' },
              { title: 'Optimization', desc: 'We deploy campaigns, run creatives tests, and optimize CPC metrics.' }
            ]).map((step, idx) => (
              <div key={idx} className="timeline-point-item">
                <div className="point-dot-wrapper">
                  <span className="point-dot"></span>
                  <span className="point-number">{idx + 1}</span>
                </div>
                <div className="point-content">
                  <h4 className="point-title">{step.title}</h4>
                  <p className="point-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="location-testimonials-section">
        <div className="section-title-wrap text-center">
          <span className="section-tag">Reviews</span>
          <h2>What Clients Say</h2>
        </div>
        <div className="testimonials-cards-grid">
          {data.testimonials && data.testimonials.length > 0 ? (
            data.testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card glass-panel">
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-meta">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="testimonial-card glass-panel">
                <p className="testimonial-text">"Glide.in shot our commercial and promotional reels. The visual storytelling was exceptional and immediately boosted our walk-ins."</p>
                <div className="testimonial-meta">
                  <strong>Siddharth Mehta</strong>
                  <span>Founder, Chaileela</span>
                </div>
              </div>
              <div className="testimonial-card glass-panel">
                <p className="testimonial-text">"They rebuilt our landing pages and ran creative performance ads that doubled our monthly revenue with 3.5x ROAS."</p>
                <div className="testimonial-meta">
                  <strong>Amit Verma</strong>
                  <span>CEO, TechIndore</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="location-faq-section">
        <div className="section-title-wrap">
          <span className="section-tag">FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-accordion-container">
          {data.faqs && data.faqs.length > 0 ? (
            data.faqs.map((faq, idx) => (
              <div key={idx} className={`faq-accordion-item glass-panel ${openIndex === idx ? 'open' : ''}`}>
                <div className="faq-accordion-header" onClick={() => toggleFaq(idx)}>
                  <h3>{faq.q}</h3>
                  <span className="faq-accordion-icon">
                    <FaChevronDown />
                  </span>
                </div>
                <div className="faq-accordion-body">
                  <div className="faq-body-inner">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No questions configured yet.</p>
          )}
        </div>
      </section>

      {/* SEO Article Section */}
      <section className="location-seo-article-section">
        <div className="seo-article-content glass-panel">
          <h2>{data.seo_title || `About ${data.service} in ${data.location}`}</h2>
          <div 
            className="seo-article-body"
            dangerouslySetInnerHTML={{ __html: data.seo_content }}
          />
        </div>
      </section>

      {/* Final CTA Banner Section */}
      <section className="location-final-cta glass-panel">
        <div className="final-cta-content">
          <h2>Ready to Elevate Your Brand in {data.location}?</h2>
          <p>Let's collaborate to build stunning visual content and run ads that scale your revenue. Contact our strategy team today for a free consultation.</p>
          <a 
            href="#" 
            onClick={handleContactRedirect}
            className="btn-solid glow-button"
          >
            Schedule a Strategy Call
          </a>
        </div>
      </section>
    </main>
  );
}
