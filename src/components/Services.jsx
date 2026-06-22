"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        const ctx = gsap.context(() => {
          const cards = gsap.utils.toArray('.service-card');

          // Group cards into rows by their vertical position (bucket within 10px)
          const rows = new Map();
          cards.forEach((card) => {
            const top = Math.round((card.getBoundingClientRect().top + window.scrollY) / 10) * 10;
            if (!rows.has(top)) rows.set(top, []);
            rows.get(top).push(card);
          });

          rows.forEach((rowCards) => {
            rowCards.forEach((card, colIndex) => {
              // Each column starts/ends at a different viewport threshold.
              // Card 0: 88% → 62%  |  Card 1: 73% → 47%  |  Card 2: 58% → 32%
              // Because all row-cards share the same offsetTop, this makes
              // each card begin its scrub animation at a genuinely different
              // scroll position → left-to-right stagger.
              const step = 15; // viewport-% gap between consecutive cards
              const startVh = 88 - colIndex * step;
              const endVh   = 62 - colIndex * step;

              gsap.fromTo(
                card,
                { y: 60, opacity: 0, scale: 0.93 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: card,
                    start: `top ${startVh}%`,
                    end:   `top ${endVh}%`,
                    scrub: true, // snappy linear scrub
                  },
                }
              );
            });
          });
          
          // Hide services section cleanly once it leaves viewport, preventing overlap with pinned transparent Portfolio
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            onLeave: () => {
              gsap.set(containerRef.current, { opacity: 0, visibility: 'hidden' });
            },
            onEnterBack: () => {
              gsap.set(containerRef.current, { opacity: 1, visibility: 'visible' });
            },
            onEnter: () => {
              gsap.set(containerRef.current, { opacity: 1, visibility: 'visible' });
            },
            onLeaveBack: () => {
              gsap.set(containerRef.current, { opacity: 1, visibility: 'visible' });
            }
          });
        }, containerRef);

        return () => ctx.revert();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loading, services]);

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

    // Fallback to the original icon string if it's a single character (likely already an emoji)
    if (iconName && iconName.length <= 2) {
      return iconName;
    }

    // Default set of emojis if no match found
    const defaultIcons = ['✨', '🚀', '🎬', '🎨', '📱', '🔍', '💡', '🛠️'];
    return defaultIcons[index % defaultIcons.length];
  };

  return (
    <section id="services" className="services-section" ref={containerRef}>
      <div className="section-header">
        <h2 className="section-title gradient-text">Our Services</h2>
        <p className="section-desc">We offer a wide range of creative and technical services to help your business grow and succeed.</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading our creative solutions...</p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service, index) => {
            const displayIcon = getServiceIcon(service.icon, index);
            
            return (
              <Link href={`/service/${service.id}`} key={service.id} className="service-card glass-panel">
                <div className="service-icon">{displayIcon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-number">0{index + 1}</div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Services;
