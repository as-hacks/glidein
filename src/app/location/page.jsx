import React from 'react';
import Link from 'next/link';
import { locationsRegistry } from '@/data/locations';
import '@/components/LocationPage.css';

export const metadata = {
  title: { absolute: 'Our Target Locations | Glide.in Studios' },
  description: 'Explore the regional growth marketing, corporate video production, and editing services offered by Glide.in Studios across Ujjain, Indore, Bhopal, Madhya Pradesh, and other hubs in India.',
  keywords: ['locations', 'video production ujjain', 'marketing agency indore', 'seo agency bhopal', 'glidein locations'],
};

export default function LocationDirectoryPage() {
  const items = Object.values(locationsRegistry);

  // Group by location to make it highly structured
  const locationsMap = items.reduce((acc, curr) => {
    if (!acc[curr.location]) {
      acc[curr.location] = [];
    }
    acc[curr.location].push(curr);
    return acc;
  }, {});

  return (
    <main className="location-directory-page">
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <div className="directory-header">
          <span className="directory-badge">Regional Expertise</span>
          <h1 className="location-directory-title">
            Our Service Locations
          </h1>
          <p className="directory-desc">
            Glide.in Studios delivers high-end video production and performance marketing services across major creative and commercial centers in India. Find your location below.
          </p>
        </div>

        {/* Directory Groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {Object.entries(locationsMap).map(([locName, servicesList]) => (
            <section key={locName} className="location-group-section" style={{ padding: '40px' }}>
              
              {/* Group Heading */}
              <div className="group-header-wrapper">
                <span style={{ fontSize: '2rem' }}>📍</span>
                <h2 className="group-title">
                  {locName}
                </h2>
                <span className="group-badge">
                  {servicesList.length} {servicesList.length === 1 ? 'Service Page' : 'Service Pages'}
                </span>
              </div>

              {/* Cards Grid */}
              <div className="directory-grid">
                {servicesList.map((item) => (
                  <Link 
                    key={item.slug} 
                    href={`/location/${item.slug}`} 
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div className="location-card">
                      <div>
                        <span className="card-category">
                          {item.service}
                        </span>
                        <h3 className="card-title">
                          {item.service} in {item.location}
                        </h3>
                        <p className="card-desc">
                          {item.metaDesc}
                        </p>
                      </div>

                      <div className="card-action">
                        <span>Explore Area</span>
                        <span className="card-arrow">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

            </section>
          ))}
        </div>

      </div>
    </main>
  );
}
