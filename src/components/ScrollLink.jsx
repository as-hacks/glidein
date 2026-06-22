"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ScrollLink({ targetId, className, children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e) => {
    e.preventDefault();
    if (pathname !== '/') {
      sessionStorage.setItem('scrollTo', targetId);
      router.push('/');
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (targetId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <a href={`/#${targetId}`} onClick={handleClick} className={className} style={{ textDecoration: 'none', cursor: 'pointer' }}>
      {children}
    </a>
  );
}
