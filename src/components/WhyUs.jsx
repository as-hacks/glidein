"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WhyUs.css';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    platform: 'instagram',
    icon: '📸',
    title: 'Viral Reach & Scale',
    desc: 'We command attention. Our Reels-optimized pacing and visually striking cinematography scale your brand\'s organic presence.',
    metric: '+420% Reach Growth',
    metricValue: '2.4M',
    metricLabel: 'Monthly Impressions',
    color: '#E1306C'
  },
  {
    platform: 'tiktok',
    icon: '⚡',
    title: 'Short-Form Domination',
    desc: 'High-retention editing built for modern algorithms. We design custom visual hooks that keep viewers locked until the final frame.',
    metric: '+85% Watch Time',
    metricValue: '4.8M',
    metricLabel: 'Total Views',
    color: '#00F2FE'
  },
  {
    platform: 'production',
    icon: '🎥',
    title: 'Cinematic Production',
    desc: 'We combine high-end cinema cameras, precise lighting, and premium color grading to craft videos that make your brand look legendary.',
    metric: 'Cinema-Grade',
    metricValue: '4K HDR',
    metricLabel: 'Resolution Standard',
    color: '#A855F7'
  },
  {
    platform: 'delivery',
    icon: '⏳',
    title: 'Lightning-Fast Delivery',
    desc: 'Trend cycles move at lightning speed. Our streamlined workflow delivers your fully-edited, optimized video assets in 48-72 hours.',
    metric: 'Trend-Ready',
    metricValue: '48hr',
    metricLabel: 'Average Turnaround',
    color: '#FF8C00'
  },
  {
    platform: 'roi',
    icon: '📈',
    title: 'Performance & ROI',
    desc: 'Stunning visuals are useless if they don\'t sell. We engineer our hooks, call-to-actions, and messaging to drive conversions and high ROAS.',
    metric: '+182% Conversion',
    metricValue: '4.8x',
    metricLabel: 'Average Campaign ROAS',
    color: '#00E676'
  }
];

const WhyUs = ({ settings }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Auto rotate tabs every 4 seconds unless hovered
  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setActiveTab((prev) => (prev + 1) % features.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered]);

  useEffect(() => {
    const el = containerRef.current;
    
    // Header animation
    gsap.fromTo(el.querySelector('.why-us-header'), 
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Columns animation
    gsap.fromTo(el.querySelectorAll('.phone-showcase-column, .features-list-column'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <section id="why-us" className="why-us-section">
      <div className="glow-orb glow-primary" style={{ top: '40%', left: '-10%', opacity: 0.15 }}></div>
      <div className="glow-orb glow-secondary" style={{ bottom: '20%', right: '-10%', opacity: 0.15 }}></div>
      
      <div ref={containerRef} className="why-us-container">
        <div className="why-us-header text-center">
          <h2>Why Choose <span className="gradient-text">Glide.in</span></h2>
          <p className="why-us-subtitle">
            {settings?.about_text || "We combine high-end cinematic video production with performance-focused distribution to deliver growth you can actually measure."}
          </p>
        </div>

        <div className="why-us-content">
          
          {/* LEFT COLUMN: Phone Showcase Stack */}
          <div className="phone-showcase-column">
            <div className={`phones-stack-container active-tab-${activeTab}`}>
              
              {/* PHONE 1: INSTAGRAM MOCKUP */}
              <div 
                className={`phone-shell instagram-phone ${activeTab === 0 ? 'active' : 'inactive'}`}
                onClick={() => { setActiveTab(0); setIsHovered(true); }}
              >
                <div className="phone-bezel">
                  <div className="phone-dynamic-island"></div>
                  <div className="phone-screen-content">
                    {/* Status Bar */}
                    <div className="phone-status-bar">
                      <span className="phone-time">9:41</span>
                      <div className="phone-icons">
                        <span className="phone-signal">📶</span>
                        <span className="phone-wifi">📶</span>
                        <span className="phone-battery">🔋</span>
                      </div>
                    </div>

                    {/* Instagram App Header */}
                    <div className="app-header instagram-app-header">
                      <span className="app-logo-font">Instagram</span>
                      <div className="app-header-icons">
                        <span>➕</span>
                        <span>❤️</span>
                        <span>⚡</span>
                      </div>
                    </div>

                    {/* Profile row */}
                    <div className="instagram-profile-row">
                      <div className="profile-pic-container">
                        <div className="profile-pic-avatar">G</div>
                      </div>
                      <div className="profile-info">
                        <span className="profile-username">glide.in <span className="verified-badge">✓</span></span>
                        <span className="profile-location">Mumbai, India</span>
                      </div>
                      <span className="profile-options">•••</span>
                    </div>

                    {/* Post Image/Video simulated block */}
                    <div className="instagram-post-media">
                      <div className="post-media-gradient"></div>
                      <div className="play-button-overlay">▶</div>
                      <div className="audio-wave-overlay">
                        <span></span>
                        <span className="tall"></span>
                        <span className="medium"></span>
                        <span></span>
                        <span className="tall"></span>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="instagram-post-actions">
                      <div className="left-actions">
                        <span className="action-liked">❤️</span>
                        <span>💬</span>
                        <span>✈️</span>
                      </div>
                      <span>🔖</span>
                    </div>

                    {/* Likes & Caption */}
                    <div className="instagram-post-text">
                      <p className="likes-count">Liked by <b>creatives</b> and <b>124,802 others</b></p>
                      <p className="caption"><b>glide.in</b> Cinematic storytelling meets algorithmic viral reach. Let\'s scale your brand...</p>
                    </div>

                    {/* FLOATING GROWTH INSIGHTS BADGE */}
                    <div className="floating-analytics-badge instagram-badge glass-panel">
                      <div className="badge-header">
                        <span className="badge-tag">INSTAGRAM GROWTH</span>
                        <span className="badge-trend-icon">📈</span>
                      </div>
                      <div className="badge-main">
                        <span className="badge-percentage">+420.4%</span>
                        <span className="badge-label">Reach In 30 Days</span>
                      </div>
                      <div className="badge-sparkline">
                        <svg viewBox="0 0 100 30" width="100%" height="30">
                          <defs>
                            <linearGradient id="insta-spark-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#E1306C" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#E1306C" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d="M 0,25 Q 15,22 30,10 T 60,18 T 80,5 T 100,2 L 100,30 L 0,30 Z" fill="url(#insta-spark-grad)" />
                          <path d="M 0,25 Q 15,22 30,10 T 60,18 T 80,5 T 100,2" fill="none" stroke="#E1306C" strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx="100" cy="2" r="3" fill="#E1306C" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Bar indicator */}
                    <div className="phone-bottom-bar"></div>
                  </div>
                </div>
              </div>

              {/* PHONE 2: TIKTOK / SHORTS MOCKUP */}
              <div 
                className={`phone-shell tiktok-phone ${activeTab === 1 ? 'active' : 'inactive'}`}
                onClick={() => { setActiveTab(1); setIsHovered(true); }}
              >
                <div className="phone-bezel">
                  <div className="phone-dynamic-island"></div>
                  <div className="phone-screen-content tiktok-screen">
                    {/* Status Bar */}
                    <div className="phone-status-bar text-white">
                      <span className="phone-time">9:41</span>
                      <div className="phone-icons">
                        <span className="phone-signal">📶</span>
                        <span className="phone-wifi">📶</span>
                        <span className="phone-battery">🔋</span>
                      </div>
                    </div>

                    {/* Full screen video feel */}
                    <div className="tiktok-video-bg">
                      <div className="tiktok-grad-top"></div>
                      <div className="tiktok-grad-bottom"></div>
                    </div>

                    {/* Top Feeds tabs */}
                    <div className="tiktok-top-tabs">
                      <span>Following</span>
                      <span className="active-tab-line">For You</span>
                    </div>

                    {/* Right side interaction sidebar */}
                    <div className="tiktok-sidebar">
                      <div className="sidebar-avatar-container">
                        <div className="sidebar-avatar">G</div>
                        <div className="sidebar-avatar-plus">+</div>
                      </div>
                      <div className="sidebar-item">
                        <span className="sidebar-icon">❤️</span>
                        <span className="sidebar-label">4.8M</span>
                      </div>
                      <div className="sidebar-item">
                        <span className="sidebar-icon">💬</span>
                        <span className="sidebar-label">125K</span>
                      </div>
                      <div className="sidebar-item">
                        <span className="sidebar-icon">⭐️</span>
                        <span className="sidebar-label">98K</span>
                      </div>
                      <div className="sidebar-item">
                        <span className="sidebar-icon">➡️</span>
                        <span className="sidebar-label">254K</span>
                      </div>
                      <div className="sidebar-music-disc">💿</div>
                    </div>

                    {/* Bottom metadata */}
                    <div className="tiktok-meta">
                      <p className="tiktok-username">@glide.in.studios <span>✓</span></p>
                      <p className="tiktok-desc">The perfect visual hook is what triggers the algorithm. Retention-driven short-form editing is our cheat code. ⚡ #shorts #viral</p>
                      <p className="tiktok-music">🎵 Original Audio - Glide.in Studios</p>
                    </div>

                    {/* FLOATING RETENTION INSIGHTS BADGE */}
                    <div className="floating-analytics-badge tiktok-badge glass-panel">
                      <div className="badge-header">
                        <span className="badge-tag">TIKTOK ANALYTICS</span>
                        <span className="badge-trend-icon">⚡</span>
                      </div>
                      <div className="badge-main">
                        <span className="badge-percentage">+85.2%</span>
                        <span className="badge-label">Avg. Watch Time</span>
                      </div>
                      <div className="badge-views-row">
                        <span className="badge-sub-label">Views:</span>
                        <span className="badge-sub-val">4.8M</span>
                      </div>
                      <div className="retention-graph-bar">
                        <div className="retention-fill-bar" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    {/* Bottom gesture line */}
                    <div className="phone-bottom-bar bg-white"></div>
                  </div>
                </div>
              </div>

              {/* PHONE 3: CINEMATIC / PRODUCTION VIEWPORT */}
              <div 
                className={`phone-shell production-phone ${activeTab === 2 ? 'active' : 'inactive'}`}
                onClick={() => { setActiveTab(2); setIsHovered(true); }}
              >
                <div className="phone-bezel">
                  <div className="phone-dynamic-island"></div>
                  <div className="phone-screen-content production-screen">
                    
                    {/* Viewfinder Grid Overlay */}
                    <div className="camera-grid-overlay">
                      <div className="camera-grid-line-h1"></div>
                      <div className="camera-grid-line-h2"></div>
                      <div className="camera-grid-line-v1"></div>
                      <div className="camera-grid-line-v2"></div>
                    </div>

                    {/* Camera Focus Brackets */}
                    <div className="camera-focus-bracket"></div>

                    {/* Top Stats Bar */}
                    <div className="production-header">
                      <div className="camera-rec-status">
                        <span className="camera-rec-dot"></span>
                        <span>REC</span>
                      </div>
                      <div className="camera-settings">
                        <span>4K RAW</span>
                        <span>60 FPS</span>
                      </div>
                    </div>

                    {/* Bottom overlay / stats */}
                    <div className="production-footer">
                      {/* Audio Channels visualizer */}
                      <div className="camera-audio-levels">
                        <div className="audio-channel">
                          <span>CH1</span>
                          <div className="audio-bar-bg">
                            <div className="audio-bar-fill"></div>
                          </div>
                        </div>
                        <div className="audio-channel">
                          <span>CH2</span>
                          <div className="audio-bar-bg">
                            <div className="audio-bar-fill ch2"></div>
                          </div>
                        </div>
                      </div>

                      <div className="production-bottom-row">
                        <span className="timecode-val">00:14:38:22</span>
                        <span className="camera-lens-val">F/1.8 ISO 800</span>
                      </div>
                    </div>

                    {/* FLOATING SUCCESS BADGE */}
                    <div className="floating-analytics-badge production-badge glass-panel">
                      <div className="badge-header">
                        <span className="badge-tag">CINEMA LEVEL</span>
                        <span className="badge-trend-icon">🎥</span>
                      </div>
                      <div className="badge-main">
                        <span className="badge-percentage" style={{ color: '#A855F7' }}>4K HDR</span>
                        <span className="badge-label">Glidein Standards</span>
                      </div>
                    </div>

                    {/* Bottom gesture line */}
                    <div className="phone-bottom-bar bg-white"></div>
                  </div>
                </div>
              </div>

              {/* PHONE 4: FAST TURNAROUND / DELIVERY PORTAL */}
              <div 
                className={`phone-shell delivery-phone ${activeTab === 3 ? 'active' : 'inactive'}`}
                onClick={() => { setActiveTab(3); setIsHovered(true); }}
              >
                <div className="phone-bezel">
                  <div className="phone-dynamic-island"></div>
                  <div className="phone-screen-content delivery-screen">
                    {/* Status Bar */}
                    <div className="phone-status-bar text-white">
                      <span className="phone-time">9:41</span>
                      <div className="phone-icons">
                        <span className="phone-signal">📶</span>
                        <span className="phone-wifi">📶</span>
                        <span className="phone-battery">🔋</span>
                      </div>
                    </div>

                    {/* Delivery App Header */}
                    <div className="app-header delivery-app-header">
                      <span className="delivery-logo-font">Client Portal</span>
                      <span className="delivery-active-status">Active Sprint</span>
                    </div>

                    {/* Sprint Title Card */}
                    <div className="delivery-campaign-card">
                      <div className="campaign-info">
                        <h5>Weekly Reels Sprint</h5>
                        <span className="campaign-date">Batch #04</span>
                      </div>
                      <div className="campaign-progress-bar">
                        <div className="campaign-progress-fill" style={{ width: '100%' }}></div>
                      </div>
                      <div className="campaign-eta">
                        <span>Speed Priority:</span>
                        <span className="eta-badge">⚡ Express Delivery</span>
                      </div>
                    </div>

                    {/* Delivery Timeline / Steps */}
                    <div className="delivery-timeline-steps">
                      <div className="timeline-step done">
                        <span className="step-check">✓</span>
                        <div className="step-info">
                          <h6>Cinema Filming & Capture</h6>
                          <span>Completed in 12 hours</span>
                        </div>
                      </div>
                      <div className="timeline-step done">
                        <span className="step-check">✓</span>
                        <div className="step-info">
                          <h6>High-Retention Rough Cut</h6>
                          <span>Completed in 24 hours</span>
                        </div>
                      </div>
                      <div className="timeline-step done">
                        <span className="step-check">✓</span>
                        <div className="step-info">
                          <h6>Color & Sound Grading</h6>
                          <span>Completed in 36 hours</span>
                        </div>
                      </div>
                      <div className="timeline-step active">
                        <span className="step-check">✓</span>
                        <div className="step-info">
                          <h6>Final Render & Delivery</h6>
                          <span className="glowing-text">Delivered (Total: 48h)</span>
                        </div>
                      </div>
                    </div>

                    {/* FLOATING DELIVERY BADGE */}
                    <div className="floating-analytics-badge delivery-badge glass-panel">
                      <div className="badge-header">
                        <span className="badge-tag">SPEED & AGILITY</span>
                        <span className="badge-trend-icon">⚡</span>
                      </div>
                      <div className="badge-main">
                        <span className="badge-percentage" style={{ color: '#FF8C00' }}>48 Hours</span>
                        <span className="badge-label">Average Delivery Time</span>
                      </div>
                    </div>

                    {/* Bottom gesture line */}
                    <div className="phone-bottom-bar bg-white"></div>
                  </div>
                </div>
              </div>

              {/* PHONE 5: ROI / CONVERSION DASHBOARD */}
              <div 
                className={`phone-shell roi-phone ${activeTab === 4 ? 'active' : 'inactive'}`}
                onClick={() => { setActiveTab(4); setIsHovered(true); }}
              >
                <div className="phone-bezel">
                  <div className="phone-dynamic-island"></div>
                  <div className="phone-screen-content roi-screen">
                    {/* Status Bar */}
                    <div className="phone-status-bar text-white">
                      <span className="phone-time">9:41</span>
                      <div className="phone-icons">
                        <span className="phone-signal">📶</span>
                        <span className="phone-wifi">📶</span>
                        <span className="phone-battery">🔋</span>
                      </div>
                    </div>

                    {/* Analytics Header */}
                    <div className="app-header roi-app-header">
                      <span className="roi-logo-font">ROAS Tracker</span>
                      <span className="roi-active-status green">Live Camp</span>
                    </div>

                    {/* ROI Summary Card */}
                    <div className="roi-summary-card">
                      <div className="roi-summary-title">
                        <h5>Sales Conversion</h5>
                        <span className="dash-time-range green">Campaign Total</span>
                      </div>
                      
                      <div className="roi-metric-grid">
                        <div className="roi-metric-cell">
                          <span className="roi-cell-val">4.8x</span>
                          <span className="roi-cell-lbl">Avg. ROAS</span>
                          <span className="roi-cell-pct">+182%</span>
                        </div>
                        <div className="roi-metric-cell">
                          <span className="roi-cell-val">$48.2K</span>
                          <span className="roi-cell-lbl">Sales Revenue</span>
                          <span className="roi-cell-pct">+220%</span>
                        </div>
                      </div>

                      {/* ROI Sparkline Chart */}
                      <div className="roi-chart-area">
                        <svg viewBox="0 0 100 40" width="100%" height="40">
                          <defs>
                            <linearGradient id="roi-spark-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00E676" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#00E676" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d="M 0,38 Q 15,35 30,22 T 60,30 T 80,10 T 100,2 L 100,40 L 0,40 Z" fill="url(#roi-spark-grad)" />
                          <path d="M 0,38 Q 15,35 30,22 T 60,30 T 80,10 T 100,2" fill="none" stroke="#00E676" strokeWidth="2.5" />
                          <circle cx="100" cy="2" r="3" fill="#00E676" />
                        </svg>
                      </div>
                    </div>

                    {/* Customer Acquisition Funnel */}
                    <div className="roi-funnel-card">
                      <h6 className="funnel-title">Conversion Funnel</h6>
                      <div className="funnel-bars-container">
                        <div className="funnel-row">
                          <span className="funnel-label">Hook Rate (3s)</span>
                          <div className="funnel-bar"><div className="funnel-fill f1" style={{ width: '88%' }}></div></div>
                          <span className="funnel-val">88%</span>
                        </div>
                        <div className="funnel-row">
                          <span className="funnel-label">Hold Rate (15s)</span>
                          <div className="funnel-bar"><div className="funnel-fill f2" style={{ width: '64%' }}></div></div>
                          <span className="funnel-val">64%</span>
                        </div>
                        <div className="funnel-row">
                          <span className="funnel-label">Click Rate (CTA)</span>
                          <div className="funnel-bar"><div className="funnel-fill f3" style={{ width: '12%' }}></div></div>
                          <span className="funnel-val">12%</span>
                        </div>
                      </div>
                    </div>

                    {/* FLOATING SUCCESS BADGE */}
                    <div className="floating-analytics-badge roi-badge glass-panel">
                      <div className="badge-header">
                        <span className="badge-tag">CONVERSION</span>
                        <span className="badge-trend-icon">📈</span>
                      </div>
                      <div className="badge-main">
                        <span className="badge-percentage" style={{ color: '#00E676' }}>+182%</span>
                        <span className="badge-label">Average Conversion Rate</span>
                      </div>
                    </div>

                    {/* Bottom gesture line */}
                    <div className="phone-bottom-bar bg-white"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Feature List */}
          <div className="features-list-column">
            <div 
              className="features-stack"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {features.map((feat, i) => (
                <div 
                  key={i} 
                  className={`interactive-feature-card glass-panel ${activeTab === i ? 'active' : ''}`}
                  onMouseEnter={() => setActiveTab(i)}
                  onClick={() => setActiveTab(i)}
                >
                  <div className="feature-card-header">
                    <div className="feature-icon-wrapper" style={{ backgroundColor: `${feat.color}20`, color: feat.color }}>
                      <span className="feature-card-icon">{feat.icon}</span>
                    </div>
                    <div className="feature-main-info">
                      <h3>{feat.title}</h3>
                      <span className="feature-platform-tag">{feat.platform.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <p className="feature-desc">{feat.desc}</p>

                  <div className="feature-metrics-panel">
                    <div className="feature-metric-row">
                      <div className="metric-box">
                        <span className="metric-val" style={{ color: feat.color }}>{feat.metricValue}</span>
                        <span className="metric-lbl">{feat.metricLabel}</span>
                      </div>
                      <div className="metric-badge" style={{ backgroundColor: `${feat.color}20`, color: feat.color }}>
                        {feat.metric}
                      </div>
                    </div>
                  </div>

                  <div className="active-progress-bar">
                    <div 
                      className="active-progress-fill" 
                      style={{ 
                        backgroundColor: feat.color,
                        width: activeTab === i ? '100%' : '0%',
                        transition: activeTab === i && !isHovered ? 'width 4s linear' : 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyUs;

