"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import './Portfolio.css';

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching portfolio:', error);
    } else {
      setProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!loading && wrapperRef.current) {
      // Hard-reset wrapper before GSAP reads scroll position
      gsap.set(wrapperRef.current, { x: 0 });

      // Hoist ctx so the useEffect cleanup can always reach ctx.revert()
      // (declaring it inside setTimeout means it's unreachable from the outer cleanup)
      let ctx;

      const timer = setTimeout(() => {
        ctx = gsap.context(() => {
          const slides = gsap.utils.toArray('.portfolio-slide');

          if (slides.length <= 1) return;

          // Horizontal Scroll Animation
          const scrollTween = gsap.fromTo(
            wrapperRef.current,
            { x: 0 },
            {
              // Guard against null ref during ScrollTrigger.refresh() after unmount
              x: () => wrapperRef.current
                ? -(wrapperRef.current.scrollWidth - window.innerWidth)
                : 0,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: true,
                start: 'top top',
                end: () => wrapperRef.current
                  ? `+=${wrapperRef.current.scrollWidth - window.innerWidth}`
                  : '+=0',
                invalidateOnRefresh: true,
                anticipatePin: 1,
                onEnter: () => {
                  if (wrapperRef.current) gsap.set(wrapperRef.current, { x: 0 });
                },
                onLeaveBack: () => {
                  if (wrapperRef.current) gsap.set(wrapperRef.current, { x: 0 });
                },
                onRefresh: (self) => {
                  if (wrapperRef.current && self.progress <= 0.01) {
                    gsap.set(wrapperRef.current, { x: 0 });
                  }
                },
              },
            }
          );

          slides.forEach((slide) => {
            const img = slide.querySelector('.project-image');
            const headerTitle = slide.querySelector('.section-title');
            const isExplore = slide.classList.contains('explore-slide');

            if (img) {
              gsap.fromTo(img,
                { scale: 1.15, filter: 'brightness(0.6)' },
                {
                  scale: 1,
                  filter: 'brightness(1)',
                  ease: 'none',
                  scrollTrigger: {
                    trigger: slide,
                    containerAnimation: scrollTween,
                    start: 'left right',
                    end: 'center center',
                    scrub: true,
                  },
                }
              );
            }

            if (headerTitle) {
              gsap.fromTo(headerTitle,
                { x: 100, opacity: 0 },
                {
                  x: 0,
                  opacity: 1,
                  scrollTrigger: {
                    trigger: slide,
                    containerAnimation: scrollTween,
                    start: 'left right',
                    end: 'center center',
                    scrub: true,
                  },
                }
              );
            }

            if (isExplore) {
              gsap.fromTo(slide,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: slide,
                    containerAnimation: scrollTween,
                    start: 'left right',
                    end: 'left center',
                    scrub: true,
                  },
                }
              );
            }
          });
        }, containerRef);
      }, 150);

      // Single unified cleanup — cancels the timer AND kills the GSAP context
      return () => {
        clearTimeout(timer);
        ctx?.revert();
      };
    }
  }, [loading, projects]);


  return (
    <section id="portfolio" className="portfolio-section" ref={containerRef}>
      {loading ? (
        <div className="loading-container">
          <div className="loader-text">Crafting the gallery...</div>
        </div>
      ) : (
        <div className="portfolio-wrapper" ref={wrapperRef}>
          {/* Header Slide */}
          <div className="portfolio-slide header-slide">
            <div className="portfolio-item-inner">
              <h2 className="section-title">Portfolio</h2>
              <p className="section-desc">We've partnered with market leaders and major brands to help them bring their creative vision to life.</p>
              <div className="scroll-indicator">
                <span>Scroll to explore</span>
                <div className="arrow-right">→</div>
              </div>
            </div>
          </div>

          {/* Project Slides */}
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="portfolio-slide">
                <Link href={`/portfolio/${project.id}`} className="portfolio-item-inner project-card">
                  <div className="image-container">
                    <div
                      className="project-image"
                      style={{ backgroundImage: `url(${project.image_url})` }}
                    />
                    <div className="hover-overlay">
                      <span className="view-project">View Case Study</span>
                    </div>
                  </div>
                  <div className="project-details">
                    <div className="details-top">
                      <span className="project-year">{new Date(project.created_at).getFullYear()}</span>
                      <span className="project-category">{project.category || 'Creative Direction'}</span>
                    </div>
                    <div className="details-bottom">
                      <h3 className="project-name">{project.client_name}</h3>
                      <div className="project-arrow">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="portfolio-slide">
              <div className="portfolio-item-inner explore-content">
                <h3>Our work is arriving soon.</h3>
                <p>Stay tuned for something amazing.</p>
              </div>
            </div>
          )}

          {/* Explore More Slide */}
          <div className="portfolio-slide explore-slide">
            <div className="portfolio-item-inner explore-content">
              <h3 className="gradient-text">Hungry for more?</h3>
              <p>We've got plenty of stories waiting to be told.</p>
              <Link href="/portfolio" className="btn-primary glow-button">
                Explore All Projects
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
