"use client";

import React, { useState } from 'react';
import './Contact.css';

const Contact = ({ settings, services }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const adminEmail = settings?.contact_email || 'hello@glidein.com';
    const subject = encodeURIComponent(`New Inquiry from ${formData.name} - ${formData.business}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nBusiness Name: ${formData.business}\nInterested Service: ${formData.service}\n\nMessage:\n${formData.message}`);

    const mailtoLink = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    setFormData({ name: '', email: '', business: '', service: '', message: '' });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="glow-orb glow-primary" style={{ top: '10%', right: '10%' }}></div>
      <div className="contact-container glass-panel">
        <div className="contact-info">
          <h2>Ready to <br /><span className="gradient-text">Take Flight?</span></h2>
          <p>Let's build something extraordinary together. Book a free discovery call today.</p>
          
          {settings?.contact_phone && (
            <div style={{ marginTop: '30px' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#a0a0a5' }}>Or give us a call:</p>
              <a href={`tel:${settings.contact_phone}`} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', display: 'inline-block', transition: 'transform 0.3s ease' }} onMouseOver={e => e.target.style.transform = 'translateY(-3px)'} onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
                {settings.contact_phone}
              </a>
            </div>
          )}
        </div>
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
            <input type="text" name="business" value={formData.business} onChange={handleChange} placeholder="Business Name" required />

            <select name="service" value={formData.service} onChange={handleChange} required>
              <option value="" disabled>Select a Service</option>
              {services && services.length > 0 ? (
                services.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))
              ) : (
                <>
                  <option value="Video Production">Video Production</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Other">Other</option>
                </>
              )}
            </select>

            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your vision..." rows="5" required></textarea>

            <button type="submit" className="btn-solid glow-button" style={{ border: 'none', width: '100%', marginTop: '10px' }}>Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};
export default Contact;
