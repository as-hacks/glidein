"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import './Navbar.css';

const Navbar = ({ settings, theme, toggleTheme }) => {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', clearProps: "opacity, y" }
    );

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY.current;
      
      // Update scrolled state for glassmorphism
      setScrolled(currentScrollY > 50);

      // Navbar visibility logic
      // console.log('Scroll:', currentScrollY, 'Diff:', scrollDifference);
      if (currentScrollY <= 0) {
        // At the top
        setVisible(true);
      } else if (scrollDifference > 10 && currentScrollY > 100) {
        // Scrolling down + past hero section
        setVisible(false);
      } else if (scrollDifference < -5) {
        // Scrolling up even a little bit
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    closeMenu();
    if (pathname !== '/') {
      sessionStorage.setItem('scrollTo', id);
      router.push('/');
    } else {
      const element = document.getElementById(id);
      if (element) {
        // GSAP wraps pinned sections in a .gsap-pin-spacer div.
        // Using scrollIntoView on the inner element can land mid-carousel
        // because it may be position:fixed at that moment.
        // Instead, read the spacer's offsetTop for the true scroll target.
        const pinSpacer = element.parentElement?.classList?.contains('gsap-pin-spacer')
          ? element.parentElement
          : null;
        const top = pinSpacer
          ? pinSpacer.offsetTop
          : element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''} ${!visible && !menuOpen ? 'hidden' : ''}`}>
      <div className="logo gradient-text">
        <Link
          href="/"
          style={{ color: 'inherit', textDecoration: 'none' }}
          onClick={(e) => {
            if (pathname === '/') {
              // Already on home — scroll to top instead of re-navigating
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          Glide.in
        </Link>
      </div>

      <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><a href="#" onClick={(e) => handleScrollTo(e, 'services')}>Services</a></li>
        <li><a href="#" onClick={(e) => handleScrollTo(e, 'portfolio')}>Work</a></li>
        <li><a href="#" onClick={(e) => handleScrollTo(e, 'why-us')}>About</a></li>
        <li><Link href="/blog" onClick={closeMenu}>Blog</Link></li>
        <li><Link href="/work-with-us" onClick={closeMenu}>Careers</Link></li>
        <li>
          <button className="theme-toggle" onClick={() => { toggleTheme(); closeMenu(); }} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? (
              <svg className="theme-icon sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg className="theme-icon moon-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </li>
        <li><button className="btn-primary glow-button" style={{ marginTop: 0, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', fontWeight: '500' }} onClick={(e) => handleScrollTo(e, 'contact')}>Let's Talk</button></li>
      </ul>
    </nav>
  );
};
export default Navbar;
