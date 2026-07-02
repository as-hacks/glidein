"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Cursor.css';

const Cursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if the device has a fine pointer (mouse/trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setHasFinePointer(mediaQuery.matches);

    const handleChange = (e) => {
      setHasFinePointer(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasFinePointer) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;
    
    // QuickTo for smooth performance
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3.out" });
    
    const xToDot = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3.out" });

    const onMouseMove = (e) => {
      // Offset by half width/height so it's centered on the mouse
      xTo(e.clientX - 15);
      yTo(e.clientY - 15);
      
      xToDot(e.clientX - 4);
      yToDot(e.clientY - 4);
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [hasFinePointer]);

  if (!hasFinePointer) return null;

  return (
    <>
      <div className="custom-cursor-dot" ref={dotRef}></div>
      <div className="custom-cursor-ring" ref={cursorRef}></div>
    </>
  );
};

export default Cursor;
