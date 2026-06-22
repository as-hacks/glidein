"use client";

import React, { useState } from 'react';
import './WorkWithUs.css';

const WorkWithUs = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    skill: '',
    experience: '',
    portfolio: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const adminEmail = settings?.contact_email || 'hello@glidein.com';
    const subject = encodeURIComponent(`New Application from ${formData.name} - ${formData.skill}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nSkill: ${formData.skill}\nExperience: ${formData.experience}\nPortfolio: ${formData.portfolio}\n\nDescription:\n${formData.description}`);

    const mailtoLink = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    setFormData({ name: '', skill: '', experience: '', portfolio: '', description: '' });
  };

  return (
    <section className="work-with-us-section">
      <div className="glow-orb glow-secondary" style={{ top: '20%', left: '10%' }}></div>
      <div className="glow-orb glow-primary" style={{ bottom: '10%', right: '10%' }}></div>
      
      <div className="work-container glass-panel">
        <div className="work-header">
          <h1>Join Our <span className="gradient-text">Creative Team</span></h1>
          <p>We are always looking for creative minds and skilled individuals. Share your work and let's build something extraordinary together.</p>
        </div>
        
        <form className="work-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Full Name" required />
            <input type="text" name="skill" value={formData.skill} onChange={handleChange} placeholder="Primary Skill (e.g. Video Editor, 3D Artist)" required />
          </div>
          
          <div className="form-group">
            <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="Years of Experience" required />
            <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="Portfolio Link (Website/Behance/etc)" required />
          </div>
          
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Tell us about yourself and why you'd like to join us..." rows="6" required></textarea>
          
          <button type="submit" className="btn-solid" style={{ width: '100%', marginTop: '20px' }}>Submit Application</button>
        </form>
      </div>
    </section>
  );
};

export default WorkWithUs;
