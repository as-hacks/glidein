"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './TechStack.css';

const TechStack = () => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    // Try to fetch from Supabase
    const { data, error } = await supabase.from('tech_stack').select('*').order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      setTools(data);
    } else {
      // Fallback data in case the table doesn't exist yet or is empty
      setTools([
        { id: 1, name: 'After Effects' },
        { id: 2, name: 'Premiere Pro' },
        { id: 3, name: 'Meta Ads' },
        { id: 4, name: 'Figma' },
        { id: 5, name: 'Photoshop' },
        { id: 6, name: 'Illustrator' },
        { id: 7, name: 'Google Ads' }
      ]);
    }
  };

  if (tools.length === 0) return null;

  // Duplicate items for seamless continuous scrolling loop
  // We double it so that it can scroll to 50% and perfectly match the start
  const marqueeItems = [...tools, ...tools, ...tools, ...tools];

  const stats = [
    { value: '99.5%', label: 'Client Satisfaction' },
    { value: '300+', label: 'Happy Customers' },
    { value: '20M+', label: 'Views Generated' },
    // { value: '50+', label: 'Countries Served' },
    { value: '500+', label: 'Projects Delivered' }
  ];
  const statsMarqueeItems = [...stats, ...stats, ...stats, ...stats];

  return (
    <section className="tech-stack-section">
      <div className="tech-stack-header">
        <h2>Our <span className="gradient-text">Technology Stack</span></h2>
        <p>We work with cutting-edge tools to deliver exceptional solutions</p>
      </div>

      <div className="marquee-container">
        {/* Adjusting animation duration based on item count to maintain consistent speed */}
        <div className="marquee-content" style={{ animationDuration: `${tools.length * 6}s` }}>
          {marqueeItems.map((tool, index) => (
            <div key={`${tool.id}-${index}`} className="tech-pill glass-panel">
              <span className="tech-dot"></span>
              {tool.name}
            </div>
          ))}
        </div>
      </div>

      <div className="marquee-container" style={{ marginTop: '20px' }}>
        <div className="marquee-content reverse" style={{ animationDuration: '35s' }}>
          {statsMarqueeItems.map((stat, index) => (
            <div key={`stat-${index}`} className="stat-pill glass-panel">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
