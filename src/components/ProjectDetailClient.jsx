"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabaseClient';
import Loader from './Loader';
import './ProjectDetail.css';

export default function ProjectDetailClient({ projectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to extract YouTube video ID and return embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      console.log('Fetching project with ID:', projectId);
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) {
        console.error('Supabase error fetching project:', error);
        setProject(null);
      } else {
        console.log('Project data fetched successfully:', data);
        setProject(data);
      }
    } catch (err) {
      console.error('Unexpected error in fetchProject:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '60vh' }}>
        <Loader />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="error-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Project not found</h2>
        <p>There was an error loading the project details or the project does not exist.</p>
        <button onClick={() => window.location.reload()} className="btn-solid" style={{ marginTop: '20px' }}>Try Refreshing</button>
      </div>
    );
  }

  // Combine videos and graphics for the grid
  const mediaItems = [];
  const addedEmbedUrls = new Set();
  
  // Parse and add YouTube videos if available from the array
  if (Array.isArray(project.youtube_urls)) {
    project.youtube_urls.forEach(url => {
      const embedUrl = getYouTubeEmbedUrl(url);
      if (embedUrl && !addedEmbedUrls.has(embedUrl)) {
        mediaItems.push({ type: 'youtube', url: embedUrl });
        addedEmbedUrls.add(embedUrl);
      }
    });
  }

  // Fallback for legacy single youtube_url
  if (project.youtube_url) {
    const embedUrl = getYouTubeEmbedUrl(project.youtube_url);
    if (embedUrl && !addedEmbedUrls.has(embedUrl)) {
      mediaItems.push({ type: 'youtube', url: embedUrl });
      addedEmbedUrls.add(embedUrl);
    }
  }

  if (Array.isArray(project.video_urls)) {
    project.video_urls.forEach(url => mediaItems.push({ type: 'video', url }));
  } else if (project.video_url && project.video_url.startsWith('http')) {
    mediaItems.push({ type: 'video', url: project.video_url });
  }

  if (Array.isArray(project.graphic_urls)) {
    project.graphic_urls.forEach(url => mediaItems.push({ type: 'image', url }));
  }

  return (
    <section className="project-detail-section">
      <div className="back-button-container">
        <Link href="/portfolio" className="back-link">
          <span className="back-arrow">←</span> Back to Portfolio
        </Link>
      </div>
      <div className="project-header">
        <h1>{project.title}</h1>
        <hr className="dashed-separator" />
        <div className="project-meta">
          {project.client_name && (
            <div className="meta-item">
              <span className="meta-label">Client</span>
              <span className="meta-value">{project.client_name}</span>
            </div>
          )}
          {project.video_url && !project.video_url.startsWith('http') && (
            <div className="meta-item">
              <span className="meta-label">Services Provided</span>
              <span className="meta-value">{project.video_url}</span>
            </div>
          )}
        </div>
      </div>

      <div className="project-media-grid">
        {mediaItems.length > 0 ? (
          mediaItems.map((item, index) => (
            <div key={index} className="media-item">
              {item.type === 'youtube' ? (
                <div className="youtube-embed-container" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000' }}>
                  <iframe
                    src={item.url}
                    title={`${project.title} YouTube video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '12px' }}
                  ></iframe>
                </div>
              ) : item.type === 'video' ? (
                <video 
                  src={`${item.url}#t=0.5`} 
                  controls 
                  playsInline 
                  preload="metadata"
                  className="project-video"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={item.url} 
                  alt={`${project.title} graphic ${index}`} 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              )}
            </div>
          ))
        ) : (
          !project.image_url && (
            <p style={{ textAlign: 'center', width: '100%', color: '#888' }}>No media available for this project.</p>
          )
        )}
      </div>
    </section>
  );
}
