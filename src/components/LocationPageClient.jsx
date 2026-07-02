"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './LocationPage.css';

export default function LocationPageClient({ data }) {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState(null);

  if (!data) return null;

  const toggleFaq = (index) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  const handleContactRedirect = (e) => {
    e.preventDefault();
    sessionStorage.setItem('scrollTo', 'contact');
    router.push('/');
  };

  return (
    <main className="location-detail-section">
      {/* Back button left-aligned matching services and portfolio project pages */}
      <div className="back-button-container">
        <Link href="/location" className="back-link">
          <span className="back-arrow">←</span> Back to Locations
        </Link>
      </div>

      {/* Header Section */}
      <header className="location-header">
        <span className="location-badge">
          {data.service}
        </span>
        <h1>{data.h1}</h1>
        <p className="location-tagline">{data.tagline}</p>
        <hr className="dashed-separator" />
      </header>

      {/* Content Body */}
      <div className="location-main-content">
        
        {/* Section 1: Intro */}
        <section className="location-text-section" style={{ padding: 0 }}>
          <h2>{data.section1_intro.heading}</h2>
          {data.section1_intro.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </section>

        {/* Section 2: Challenges */}
        <section className="location-text-section" style={{ padding: 0 }}>
          <h2>{data.section2_challenges.heading}</h2>
          {data.section2_challenges.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </section>

        {/* Section 3: Solutions */}
        <section className="location-text-section" style={{ padding: 0 }}>
          <h2>{data.section3_solutions.heading}</h2>
          {data.section3_solutions.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </section>

        {/* Section 4: Capabilities Grid */}
        <section className="location-text-section" style={{ padding: 0 }}>
          <h2>{data.section4_services.heading}</h2>
          <div className="capabilities-grid">
            {data.section4_services.list.map((item, idx) => (
              <div key={idx} className="capability-card glass-panel">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Process */}
        <section className="location-text-section" style={{ padding: 0 }}>
          <h2>{data.section5_process.heading}</h2>
          {data.section5_process.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </section>

        {/* Section 6: FAQs */}
        <section className="location-text-section" style={{ padding: 0 }}>
          <h2>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="faq-item glass-panel">
                <div className="faq-header" onClick={() => toggleFaq(idx)}>
                  <h3>{faq.q}</h3>
                  <span className={`faq-icon ${openIndex === idx ? 'active' : ''}`}>+</span>
                </div>
                <div className={`faq-answer ${openIndex === idx ? 'active' : ''}`}>
                  <p style={{ margin: 0, paddingBottom: openIndex === idx ? '10px' : 0 }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Panel */}
        <section className="location-cta-panel glass-panel" style={{ padding: '60px 40px' }}>
          <h3>{data.ctaText.includes('Ready to') ? 'Accelerate Your Digital Presence' : 'Ready to Get Started?'}</h3>
          <p>{data.ctaText}</p>
          <a 
            href="#" 
            onClick={handleContactRedirect}
            className="btn-solid glow-button"
            style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {data.ctaButton}
          </a>
        </section>
      </div>
    </main>
  );
}
