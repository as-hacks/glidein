"use client";

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Cursor from './Cursor';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger globally and ignore vertical resize events on mobile
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    ignoreMobileResize: true
  });
}

export default function ThemeLayout({ children, settings }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
    } else {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Apply dynamic colors
  useEffect(() => {
    if (settings && mounted) {
      if (theme === 'dark') {
        if (settings.primary_color) document.documentElement.style.setProperty('--primary-color', settings.primary_color);
        if (settings.secondary_color) document.documentElement.style.setProperty('--secondary-color', settings.secondary_color);
      } else {
        if (settings.primary_color_light) document.documentElement.style.setProperty('--primary-color', settings.primary_color_light);
        else document.documentElement.style.removeProperty('--primary-color');

        if (settings.secondary_color_light) document.documentElement.style.setProperty('--secondary-color', settings.secondary_color_light);
        else document.documentElement.style.removeProperty('--secondary-color');
      }
    }
  }, [settings, mounted, theme]);

  // To prevent hydration mismatch, we can just render without theme classes, 
  // but it's simpler to just mount it. We still need children to render for SEO.
  return (
    <div className="app-container" style={{ visibility: mounted ? 'visible' : 'hidden' }}>
      {mounted && <Cursor />}
      <Navbar settings={settings} theme={theme} toggleTheme={toggleTheme} />
      {children}
      <Footer settings={settings} />
    </div>
  );
}
