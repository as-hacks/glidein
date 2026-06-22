"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Link from 'next/link';
import './PortfolioList.css';

export default function PortfolioListClient() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching portfolio:', error);
    } else {
      setProjects(data);
    }
    setLoading(false);
  };

  return (
    <section className="portfolio-list-section">
      {/* Page Header */}
      <div className="portfolio-list-header">
        <h1 className="gradient-text">All Projects</h1>
        <p>A collection of our finest work</p>
      </div>

      {loading ? (
        <div className="portfolio-loading">
          <div className="pl-loader">
            <div className="pl-track">
              <div className="pl-line" />
            </div>
          </div>
        </div>
      ) : (
        <div className="portfolio-cards-grid">
          {projects.length === 0 && (
            <div className="portfolio-empty">No projects found yet. Check back soon!</div>
          )}

          {projects.map((project) => (
            <Link
              href={`/portfolio/${project.id}`}
              key={project.id}
              className="portfolio-card"
            >
              {/* Thumbnail */}
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.client_name}
                  className="portfolio-card-thumb"
                />
              ) : (
                <div className="portfolio-card-thumb-placeholder" />
              )}

              {/* Card body */}
              <div className="portfolio-card-body">
                <div className="portfolio-card-meta">
                  <span>{project.category || 'Creative Direction'}</span>
                  <span>{new Date(project.created_at).getFullYear()}</span>
                </div>

                <h2 className="portfolio-card-title">{project.client_name}</h2>

                {project.description && (
                  <p className="portfolio-card-desc">{project.description}</p>
                )}

                <span className="portfolio-card-link">
                  View Case Study →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
