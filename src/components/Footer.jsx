"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaYoutube, FaInstagram, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import './Footer.css';

const Footer = ({ settings }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    if (pathname !== '/') {
      sessionStorage.setItem('scrollTo', id);
      router.push('/');
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2 className="logo gradient-text">
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Glide.in</Link>
          </h2>
          <p>We craft stories that captivate and campaigns that convert.</p>
          <div className="social-icons">
            <a href="https://www.youtube.com/@ashacks1834" className="social-icon" target="_blank" rel="noreferrer"><FaYoutube /></a>
            <a href="https://www.instagram.com/as_hacks_1/" className="social-icon" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="#" className="social-icon" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="#" className="social-icon" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="#" className="social-icon" target="_blank" rel="noreferrer"><FaFacebook /></a>
          </div>
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#" onClick={(e) => handleScrollTo(e, 'hero')}>Home</a></li>
            <li><a href="#" onClick={(e) => handleScrollTo(e, 'services')}>Services</a></li>
            <li><a href="#" onClick={(e) => handleScrollTo(e, 'portfolio')}>Work</a></li>
            <li><a href="#" onClick={(e) => handleScrollTo(e, 'why-us')}>About</a></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/work-with-us">Careers</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h3>Locations</h3>
          <ul>
            <li><Link href="/location/video-production-company-ujjain">Ujjain</Link></li>
            <li><Link href="/location/video-production-company-indore">Indore</Link></li>
            <li><Link href="/location/video-production-company-bhopal">Bhopal</Link></li>
            <li><Link href="/location/production-house-madhya-pradesh">Madhya Pradesh</Link></li>
            <li><Link href="/location/production-house-india">India</Link></li>
            <li><Link href="/location" style={{ opacity: 0.9, fontWeight: '600', color: 'var(--secondary-color, #00f0ff)' }}>View All Areas →</Link></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h3>Contact</h3>
          <p><a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a></p>
          {settings?.contact_phone && (
            <p style={{ marginTop: '10px', marginBottom: '15px' }}><a href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a></p>
          )}
          <button className="btn-solid glow-button" style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', fontWeight: '500', marginTop: settings?.contact_phone ? '5px' : '20px' }} onClick={(e) => handleScrollTo(e, 'contact')}>Let's Talk</button>
        </div>
      </div>
      <div className="footer-massive-text" aria-hidden="true">
        GLIDE.IN
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Glide.in Studios. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
