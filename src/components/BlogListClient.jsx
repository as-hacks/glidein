"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './Blog.css';

export default function BlogListClient({ initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [activeTags, setActiveTags] = useState([]);
  const [allTags, setAllTags] = useState(['Creative', 'Design', 'Webdev', 'Video Production', 'Video Editing']);

  useEffect(() => {
    // Extract unique tags and merge with defaults
    const defaultTags = ['Creative', 'Design', 'Webdev', 'Video Production', 'Video Editing'];
    const tagsSet = new Set(defaultTags);
    
    initialBlogs.forEach(blog => {
      if (blog.tags) {
        const tagsArray = blog.tags.split(',').map(t => t.trim()).filter(t => t);
        tagsArray.forEach(t => tagsSet.add(t));
      }
    });
    setAllTags(Array.from(tagsSet));
  }, [initialBlogs]);

  // Filter blogs
  const filteredBlogs = activeTags.length === 0 
    ? blogs 
    : blogs.filter(b => {
        if (!b.tags) return false;
        const blogTags = b.tags.toLowerCase();
        return activeTags.some(tag => blogTags.includes(tag.toLowerCase()));
      });

  const toggleTag = (tag) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  return (
    <section className="blog-section">
      <div className="glow-orb glow-primary" style={{ top: '10%', left: '10%' }}></div>
      <div className="glow-orb glow-secondary" style={{ bottom: '10%', right: '10%' }}></div>
      
      <div className="blog-container">
        <div className="blog-header">
          <h1>Our <span className="gradient-text">Insights</span></h1>
          <p>Thoughts, stories and ideas on video production, digital marketing, and design.</p>
        </div>

        <div className="blog-filter-tags">
          <button 
            className={`filter-tag ${activeTags.length === 0 ? 'active' : ''}`}
            onClick={() => setActiveTags([])}
          >
            All
          </button>
          {allTags.map(tag => (
            <button 
              key={tag} 
              className={`filter-tag ${activeTags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="no-blogs">
            <p>No blogs found for this category.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredBlogs.map(blog => {
              const tagsArray = blog.tags ? blog.tags.split(',').map(t => t.trim()).filter(t => t) : [];
              return (
                <Link href={`/blog/${blog.id}`} key={blog.id} className="blog-card glass-panel" style={{ textDecoration: 'none' }}>
                  {blog.image_url && (
                    <div className="blog-image-wrapper">
                      <img src={blog.image_url} alt={blog.title} className="blog-image" />
                    </div>
                  )}
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-author">{blog.author || 'Admin'}</span>
                      <span className="blog-date">
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h2 className="blog-title">{blog.title}</h2>
                    {tagsArray.length > 0 && (
                      <div className="blog-card-tags" style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                        {tagsArray.slice(0, 3).map((tag, idx) => (
                          <span key={idx} style={{ fontSize: '0.75rem', background: 'var(--primary-glow)', color: 'var(--primary-color)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <p className="blog-excerpt">{blog.content.substring(0, 150).replace(/<[^>]+>/g, '')}...</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
