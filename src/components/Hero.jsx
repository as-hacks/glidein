"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Hero.css';

const Hero = ({ settings }) => {
  const headlineRef = useRef();
  const subheadRef = useRef();
  const ctaRef = useRef();
  const interactiveOrbRef = useRef(null);

  useEffect(() => {
    // Reduced delay since there is no paper plane animation anymore
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(headlineRef.current, { y: 80, opacity: 0, rotationX: 15 }, { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: 'power4.out' })
      .fromTo(subheadRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8')
      .fromTo(ctaRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.7)' }, '-=0.6');

    // Liquid cursor effect
    const orb = interactiveOrbRef.current;
    const heroSection = document.getElementById('hero');
    
    if (orb && heroSection) {
      // gsap quickTo for high performance and smooth interpolation
      const xTo = gsap.quickTo(orb, "x", { duration: 0.8, ease: "power3" });
      const yTo = gsap.quickTo(orb, "y", { duration: 0.8, ease: "power3" });

      const handleMouseMove = (e) => {
        const rect = heroSection.getBoundingClientRect();
        // Calculate position relative to the hero section
        // Offset by 250px (half of 500px width/height) to center the orb on the cursor
        const x = e.clientX - rect.left - 250; 
        const y = e.clientY - rect.top - 250;
        
        xTo(x);
        yTo(y);
      };

      heroSection.addEventListener("mousemove", handleMouseMove);
      
      return () => {
        heroSection.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  const renderHeadline = () => {
    if (!settings?.hero_headline) return <><span className="gradient-text">Your Vision,</span><br/>Elevated.</>;
    return <span dangerouslySetInnerHTML={{ __html: settings.hero_headline }} />;
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-pattern-bg"></div>
      
      {/* Interactive Liquid Cursor Orb */}
      <div 
        ref={interactiveOrbRef}
        className="glow-orb" 
        style={{ 
          top: 0, 
          left: 0, 
          width: '500px', 
          height: '500px', 
          position: 'absolute', 
          pointerEvents: 'none', 
          zIndex: 0, 
          opacity: 0.4,
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          animation: 'none' // Disable float animation so it strictly follows cursor
        }}
      ></div>

      <div className="glow-orb glow-primary" style={{ top: '20%', left: '10%' }}></div>
      <div className="glow-orb glow-secondary" style={{ bottom: '10%', right: '20%' }}></div>
      
      <div className="hero-content">
        <h1 ref={headlineRef} style={{ transformPerspective: '800px' }}>
          {renderHeadline()}
        </h1>
        <p ref={subheadRef}>{settings?.hero_subhead}</p>
        <div className="hero-cta" ref={ctaRef}>
          <a href="#" onClick={(e) => { e.preventDefault(); document.getElementById('portfolio')?.scrollIntoView({behavior: 'smooth'})}} className="btn-solid">See Our Work</a>
          <a href="#" onClick={(e) => { e.preventDefault(); document.getElementById('why-us')?.scrollIntoView({behavior: 'smooth'})}} className="btn-outline">Why Us</a>
        </div>
      </div>
    </section>
  );
};
export default Hero;
