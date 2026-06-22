"use client";

import React, { useState, useEffect } from 'react';
import IntroVideo from './IntroVideo';

export default function LandingPageClient({ children }) {
  const [showIntro, setShowIntro] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!showIntro) {
      const scrollToId = sessionStorage.getItem('scrollTo');
      if (scrollToId) {
        setTimeout(() => {
          const element = document.getElementById(scrollToId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else if (scrollToId === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          sessionStorage.removeItem('scrollTo');
        }, 100);
      }
    }
  }, [showIntro]);

  // We render children regardless, but hide them with CSS if intro is playing
  // This ensures the server sends the HTML for SEO!
  return (
    <>
      {showIntro && (
        <IntroVideo 
          onStartDismiss={() => setIsLeaving(true)} 
          onFinish={() => setShowIntro(false)} 
        />
      )}
      
      <div 
        style={{ 
          opacity: (showIntro && !isLeaving) ? 0 : 1, 
          transition: 'opacity 0.8s ease', 
          pointerEvents: showIntro ? 'none' : 'auto', 
          visibility: (showIntro && !isLeaving) ? 'hidden' : 'visible' 
        }}
      >
        {children}
      </div>
    </>
  );
}
