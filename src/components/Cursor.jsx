"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Cursor.css';

const Cursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  
  useEffect(() => {
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
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <>
      <div className="custom-cursor-dot" ref={dotRef}></div>
      <div className="custom-cursor-ring" ref={cursorRef}></div>
    </>
  );
};

export default Cursor;
