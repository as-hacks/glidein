import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FaYoutube, FaInstagram, FaLinkedin, FaTwitter, FaFacebook, FaShareAlt } from 'react-icons/fa';
import './BlogPost.css';

const BlogPost = ({ settings }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setBlog(data);
    } else {
      console.error("Error fetching blog", error);
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: `Check out this blog: ${blog.title}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <div className="loading">Loading Blog...</div>;
  if (!blog) return <div className="loading">Blog not found.</div>;

  const tags = blog.tags ? blog.tags.split(',').map(t => t.trim()).filter(t => t) : [];

  return (
    <article className="blog-post-section">
      <div className="glow-orb glow-primary" style={{ top: '10%', left: '10%' }}></div>
      <div className="glow-orb glow-secondary" style={{ bottom: '10%', right: '10%' }}></div>

      <div className="blog-post-container glass-panel">
        <div className="blog-post-header">
          <Link to="/blog" className="back-link">&larr; Back to Blogs</Link>
          {tags.length > 0 && (
            <div className="blog-post-tags">
              {tags.map((tag, idx) => <span key={idx} className="blog-tag">{tag}</span>)}
            </div>
          )}
          <h1 className="blog-post-title">{blog.title}</h1>
          <div className="blog-post-meta">
            <span>By <strong>{blog.author || 'Admin'}</strong></span>
            <span>&bull;</span>
            <span>{new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {blog.image_url && (
          <div className="blog-post-hero-image">
            <img src={blog.image_url} alt={blog.title} />
          </div>
        )}

        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>

        <div className="blog-post-footer">
          <div className="share-section">
            <h4>Share this article</h4>
            <button className="share-btn glow-button" onClick={handleShare}>
              <FaShareAlt /> Share
            </button>
          </div>

          <div className="social-section">
            <h4>Follow Us</h4>
            <div className="social-icons" style={{ marginTop: '10px' }}>
              <a href="https://www.youtube.com/@ashacks1834" className="social-icon"><FaYoutube /></a>
              <a href="https://www.instagram.com/as_hacks_1/" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaLinkedin /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaFacebook /></a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
