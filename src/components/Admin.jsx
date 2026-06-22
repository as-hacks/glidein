"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';

const Admin = ({ fetchCMSData }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('settings');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');

  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolio, setNewPortfolio] = useState({ title: '', client_name: '', services_provided: '', youtube_urls: [] });
  const [portfolioImageFile, setPortfolioImageFile] = useState(null);
  const [portfolioLogoFile, setPortfolioLogoFile] = useState(null);
  const [portfolioVideoFiles, setPortfolioVideoFiles] = useState([]);
  const [portfolioGraphicFiles, setPortfolioGraphicFiles] = useState([]);
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [youtubeInput, setYoutubeInput] = useState('');
  const [existingVideoUrls, setExistingVideoUrls] = useState([]);
  const [existingGraphicUrls, setExistingGraphicUrls] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);

  const [settings, setSettings] = useState({
    hero_headline: '',
    hero_subhead: '',
    about_text: '',
    contact_email: '',
    contact_phone: '',
    primary_color: '',
    secondary_color: '',
    primary_color_light: '',
    secondary_color_light: ''
  });

  const [visibility, setVisibility] = useState({});
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', category: '', content: '' });
  const [imageFile, setImageFile] = useState(null);

  const [tools, setTools] = useState([]);
  const [newTool, setNewTool] = useState('');

  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', author: '', tags: '' });
  const [blogImageFile, setBlogImageFile] = useState(null);

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user?.email === 'admin@glidein.in') {
        setIsAuthenticated(true);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCMSData();
    }
  }, [isAuthenticated]);

  const loadCMSData = async () => {
    const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (settingsData) setSettings(settingsData);

    const { data: visData } = await supabase.from('section_visibility').select('*');
    if (visData) {
      const vMap = {};
      visData.forEach(i => vMap[i.section_id] = i.is_visible);
      setVisibility(vMap);
    }

    const { data: srvData } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (srvData) setServices(srvData);

    const { data: techData } = await supabase.from('tech_stack').select('*').order('created_at', { ascending: false });
    if (techData) setTools(techData);

    const { data: blogData } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (blogData) setBlogs(blogData);

    const { data: portData } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
    if (portData) setPortfolios(portData);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('Verifying password...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@glidein.in',
        password: password
      });
      
      if (error) {
        setStatus('Incorrect password or authentication failed: ' + error.message);
        return;
      }
      
      setIsAuthenticated(true);
      setStatus('');
    } catch (err) {
      setStatus('Error checking password. Please try again.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setStatus('Updating password...');

    if (newPasswordVal !== confirmPasswordVal) {
      setStatus('New passwords do not match');
      return;
    }

    try {
      // 1. Update the password in Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        password: newPasswordVal
      });

      if (authError) {
        setStatus('Error updating auth password: ' + authError.message);
        return;
      }

      // 2. Update the password reference in site_settings
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ admin_password: newPasswordVal })
        .eq('id', 1);

      if (!updateError) {
        setStatus('Password updated successfully!');
        setCurrentPassword('');
        setNewPasswordVal('');
        setConfirmPasswordVal('');
      } else {
        setStatus('Error updating password reference: ' + updateError.message);
      }
    } catch (err) {
      setStatus('An error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setStatus('Logged out successfully.');
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    const { error } = await supabase.from('site_settings').update(settings).eq('id', 1);
    if (!error) {
      setStatus('Settings saved!');
      if (fetchCMSData) fetchCMSData(); // refresh app state
    } else setStatus('Error: ' + error.message);
  };

  const toggleVisibility = async (section_id, current_val) => {
    const { error } = await supabase.from('section_visibility').update({ is_visible: !current_val }).eq('section_id', section_id);
    if (!error) {
      setVisibility({ ...visibility, [section_id]: !current_val });
      if (fetchCMSData) fetchCMSData();
    }
  };

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setNewService({ title: service.title, description: service.description, category: service.category, content: service.content || '' });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditService = () => {
    setEditingServiceId(null);
    setNewService({ title: '', description: '', category: '', content: '' });
    setImageFile(null);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    
    // Check if file size exceeds 50MB (Supabase Free tier limit)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (imageFile && imageFile.size > MAX_SIZE) {
      setStatus(`Error: "${imageFile.name}" (${(imageFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB limit of your Supabase Free plan. Please compress the image.`);
      return;
    }

    setStatus(editingServiceId ? 'Updating service...' : 'Adding service...');
    let image_url = undefined;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, imageFile);
      if (!uploadError) {
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        image_url = data.publicUrl;
      }
    }

    const payload = { ...newService };
    if (image_url) payload.image_url = image_url;

    let error;
    if (editingServiceId) {
      const res = await supabase.from('services').update(payload).eq('id', editingServiceId);
      error = res.error;
    } else {
      const res = await supabase.from('services').insert([payload]);
      error = res.error;
    }

    if (!error) {
      setStatus(editingServiceId ? 'Service updated!' : 'Service added!');
      cancelEditService();
      loadCMSData();
    } else setStatus('Error: ' + error.message);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await supabase.from('services').delete().eq('id', id);
      loadCMSData();
    }
  };

  const handleAddTool = async (e) => {
    e.preventDefault();
    setStatus('Adding tool...');
    const { error } = await supabase.from('tech_stack').insert([{ name: newTool }]);
    if (!error) {
      setStatus('Tool added!');
      setNewTool('');
      loadCMSData();
    } else setStatus('Error: ' + error.message);
  };

  const handleDeleteTool = async (id) => {
    await supabase.from('tech_stack').delete().eq('id', id);
    loadCMSData();
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog.id);
    setNewBlog({ title: blog.title, content: blog.content, author: blog.author, tags: blog.tags || '' });
    setBlogImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditBlog = () => {
    setEditingBlogId(null);
    setNewBlog({ title: '', content: '', author: '', tags: '' });
    setBlogImageFile(null);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();

    // Check if file size exceeds 50MB (Supabase Free tier limit)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (blogImageFile && blogImageFile.size > MAX_SIZE) {
      setStatus(`Error: "${blogImageFile.name}" (${(blogImageFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB limit of your Supabase Free plan. Please compress the image.`);
      return;
    }

    setStatus(editingBlogId ? 'Updating blog...' : 'Adding blog...');
    let image_url = undefined;

    if (blogImageFile) {
      const fileExt = blogImageFile.name.split('.').pop();
      const fileName = `blog_${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, blogImageFile);
      if (!uploadError) {
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        image_url = data.publicUrl;
      }
    }

    const payload = { ...newBlog };
    if (image_url) payload.image_url = image_url;

    let error;
    if (editingBlogId) {
      const res = await supabase.from('blogs').update(payload).eq('id', editingBlogId);
      error = res.error;
    } else {
      const res = await supabase.from('blogs').insert([payload]);
      error = res.error;
    }

    if (!error) {
      setStatus(editingBlogId ? 'Blog updated!' : 'Blog added!');
      cancelEditBlog();
      loadCMSData();
    } else setStatus('Error: ' + error.message);
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await supabase.from('blogs').delete().eq('id', id);
      loadCMSData();
    }
  };

  const handleEditPortfolio = (portfolio) => {
    setEditingPortfolioId(portfolio.id);
    setNewPortfolio({
      title: portfolio.title,
      client_name: portfolio.client_name,
      services_provided: portfolio.video_url || '',
      youtube_urls: portfolio.youtube_urls || (portfolio.youtube_url ? [portfolio.youtube_url] : [])
    });
    setExistingVideoUrls(portfolio.video_urls || []);
    setExistingGraphicUrls(portfolio.graphic_urls || []);
    setFilesToDelete([]);
    setPortfolioImageFile(null);
    setPortfolioLogoFile(null);
    setPortfolioVideoFiles([]);
    setPortfolioGraphicFiles([]);
    setYoutubeInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditPortfolio = () => {
    setEditingPortfolioId(null);
    setNewPortfolio({ title: '', client_name: '', services_provided: '', youtube_urls: [] });
    setExistingVideoUrls([]);
    setExistingGraphicUrls([]);
    setFilesToDelete([]);
    setPortfolioImageFile(null);
    setPortfolioLogoFile(null);
    setPortfolioVideoFiles([]);
    setPortfolioGraphicFiles([]);
    setYoutubeInput('');
  };

  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    
    // Check if any file exceeds the 50MB Supabase Free plan limit
    const MAX_SIZE = 50 * 1024 * 1024;
    
    if (portfolioImageFile && portfolioImageFile.size > MAX_SIZE) {
      setStatus(`Error: Cover image "${portfolioImageFile.name}" (${(portfolioImageFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB limit of your Supabase Free plan. Please compress it.`);
      return;
    }
    if (portfolioLogoFile && portfolioLogoFile.size > MAX_SIZE) {
      setStatus(`Error: Client logo "${portfolioLogoFile.name}" (${(portfolioLogoFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB limit of your Supabase Free plan. Please compress it.`);
      return;
    }
    if (portfolioVideoFiles && portfolioVideoFiles.length > 0) {
      for (let i = 0; i < portfolioVideoFiles.length; i++) {
        if (portfolioVideoFiles[i].size > MAX_SIZE) {
          setStatus(`Error: Video "${portfolioVideoFiles[i].name}" (${(portfolioVideoFiles[i].size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB limit of your Supabase Free plan. Please compress the video or upgrade your plan.`);
          return;
        }
      }
    }
    if (portfolioGraphicFiles && portfolioGraphicFiles.length > 0) {
      for (let i = 0; i < portfolioGraphicFiles.length; i++) {
        if (portfolioGraphicFiles[i].size > MAX_SIZE) {
          setStatus(`Error: Graphic "${portfolioGraphicFiles[i].name}" (${(portfolioGraphicFiles[i].size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB limit of your Supabase Free plan. Please compress it.`);
          return;
        }
      }
    }

    setUploadProgress(0);
    setStatus(editingPortfolioId ? 'Updating project metadata...' : 'Preparing project...');

    let image_url = undefined;
    let client_logo_url = undefined;
    let video_urls = [];
    let graphic_urls = [];

    if (portfolioImageFile) {
      setStatus('Uploading cover image...');
      setUploadProgress(5);
      const fileExt = portfolioImageFile.name.split('.').pop();
      const fileName = `portfolio_${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, portfolioImageFile);
      if (!uploadError) {
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        image_url = data.publicUrl;
        setUploadProgress(10);
      }
    }

    if (portfolioLogoFile) {
      setStatus('Uploading client logo...');
      setUploadProgress(15);
      const fileExt = portfolioLogoFile.name.split('.').pop();
      const fileName = `logo_${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, portfolioLogoFile);
      if (!uploadError) {
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        client_logo_url = data.publicUrl;
        setUploadProgress(20);
      }
    }

    if (portfolioVideoFiles && portfolioVideoFiles.length > 0) {
      for (let i = 0; i < portfolioVideoFiles.length; i++) {
        setStatus(`Uploading video ${i + 1} of ${portfolioVideoFiles.length}... Please wait, this may take a while.`);
        setUploadProgress(20 + Math.round((i / portfolioVideoFiles.length) * 70));
        const file = portfolioVideoFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `video_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file); // reusing images bucket for simplicity or videos bucket
        if (!uploadError) {
          const { data } = supabase.storage.from('images').getPublicUrl(fileName);
          video_urls.push(data.publicUrl);
        } else {
          console.error("Video upload error:", uploadError);
          setStatus(`Error uploading video ${i + 1}: ${uploadError.message}`);
          return; // stop execution if upload fails
        }
      }
      setUploadProgress(90);
    }

    if (portfolioGraphicFiles && portfolioGraphicFiles.length > 0) {
      for (let i = 0; i < portfolioGraphicFiles.length; i++) {
        setStatus(`Uploading graphic ${i + 1} of ${portfolioGraphicFiles.length}...`);
        const file = portfolioGraphicFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `graphic_${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
        if (!uploadError) {
          const { data } = supabase.storage.from('images').getPublicUrl(fileName);
          graphic_urls.push(data.publicUrl);
        }
      }
    }

    setStatus('Saving project details to database...');
    setUploadProgress(95);
    
    // Fallback: set primary youtube_url to the first youtube_urls item (if any)
    const primaryYoutubeUrl = newPortfolio.youtube_urls && newPortfolio.youtube_urls.length > 0
      ? newPortfolio.youtube_urls[0]
      : null;

    const payload = {
      title: newPortfolio.title,
      client_name: newPortfolio.client_name,
      video_url: newPortfolio.services_provided, // using legacy column for services provided text
      youtube_urls: newPortfolio.youtube_urls || [],
      youtube_url: primaryYoutubeUrl
    };

    if (image_url) payload.image_url = image_url;
    if (client_logo_url) payload.client_logo_url = client_logo_url;

    // Calculate final video and graphic url arrays
    if (editingPortfolioId) {
      payload.video_urls = [...existingVideoUrls, ...video_urls];
      payload.graphic_urls = [...existingGraphicUrls, ...graphic_urls];
    } else {
      payload.video_urls = video_urls;
      payload.graphic_urls = graphic_urls;
    }

    let error;
    if (editingPortfolioId) {
      const res = await supabase.from('portfolio').update(payload).eq('id', editingPortfolioId);
      error = res.error;
    } else {
      const res = await supabase.from('portfolio').insert([payload]);
      error = res.error;
    }

    // Clean up deleted files from storage
    if (!error && filesToDelete.length > 0) {
      setStatus('Saving complete! Cleaning up deleted files from storage...');
      const getFileName = (url) => {
        if (!url) return null;
        const parts = url.split('/');
        return parts[parts.length - 1];
      };
      const filesToRemove = filesToDelete.map(url => getFileName(url)).filter(Boolean);
      if (filesToRemove.length > 0) {
        const { error: storageError } = await supabase.storage.from('images').remove(filesToRemove);
        if (storageError) console.error('Error removing files from storage:', storageError);
      }
    }

    if (!error) {
      setStatus(editingPortfolioId ? 'Portfolio updated!' : 'Portfolio added!');
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 2000);
      cancelEditPortfolio();
      loadCMSData();
    } else setStatus('Error: ' + error.message);
  };

  const handleDeletePortfolio = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio project? This will also remove all associated images and videos from storage.')) {
      setStatus('Deleting project and associated files...');

      // 1. Fetch the project details first to get file URLs
      const { data: project, error: fetchError } = await supabase
        .from('portfolio')
        .select('image_url, client_logo_url, video_urls')
        .eq('id', id)
        .single();

      if (!fetchError && project) {
        const filesToRemove = [];

        // Helper to extract filename from Supabase public URL
        const getFileName = (url) => {
          if (!url) return null;
          const parts = url.split('/');
          return parts[parts.length - 1];
        };

        if (project.image_url) filesToRemove.push(getFileName(project.image_url));
        if (project.client_logo_url) filesToRemove.push(getFileName(project.client_logo_url));
        if (project.video_urls && Array.isArray(project.video_urls)) {
          project.video_urls.forEach(url => {
            const fileName = getFileName(url);
            if (fileName) filesToRemove.push(fileName);
          });
        }
        if (project.graphic_urls && Array.isArray(project.graphic_urls)) {
          project.graphic_urls.forEach(url => {
            const fileName = getFileName(url);
            if (fileName) filesToRemove.push(fileName);
          });
        }

        const validFiles = filesToRemove.filter(f => f !== null);
        if (validFiles.length > 0) {
          const { error: storageError } = await supabase.storage.from('images').remove(validFiles);
          if (storageError) console.error('Error removing files from storage:', storageError);
        }
      }

      // 2. Delete the row from the database
      const { error: deleteError } = await supabase.from('portfolio').delete().eq('id', id);

      if (!deleteError) {
        setStatus('Project and files deleted successfully.');
        loadCMSData();
      } else {
        setStatus('Error deleting project: ' + deleteError.message);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login glass-panel" style={{ margin: '100px auto', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ padding: '10px', borderRadius: '8px' }} required />
          <button type="submit" className="btn-solid glow-button">Login</button>
        </form>
        <p style={{ marginTop: '15px', color: 'red' }}>{status}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar glass-panel">
        <h2 className="gradient-text" style={{ marginBottom: '30px' }}>Glide.in CMS</h2>
        <ul className="admin-tabs">
          <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Site Settings</li>
          <li className={activeTab === 'change_password' ? 'active' : ''} onClick={() => setActiveTab('change_password')}>Change Password</li>
          <li className={activeTab === 'visibility' ? 'active' : ''} onClick={() => setActiveTab('visibility')}>Visibility</li>
          <li className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>Services</li>
          <li className={activeTab === 'tech_stack' ? 'active' : ''} onClick={() => setActiveTab('tech_stack')}>Tech Stack</li>
          <li className={activeTab === 'blogs' ? 'active' : ''} onClick={() => setActiveTab('blogs')}>Blogs</li>
          <li className={activeTab === 'portfolio' ? 'active' : ''} onClick={() => setActiveTab('portfolio')}>Portfolio</li>
        </ul>
        <a href="/" className="btn-outline" style={{ marginTop: 'auto', display: 'block', textAlign: 'center' }}>Back to Site</a>
        <button onClick={handleLogout} className="btn-outline" style={{ marginTop: '10px', display: 'block', width: '100%', textAlign: 'center', borderColor: '#ff4d4d', color: '#ff4d4d', background: 'transparent', cursor: 'pointer' }}>Logout</button>
      </div>

      <div className="admin-content glass-panel">
        <p className="status-message">{status}</p>

        {activeTab === 'settings' && (
          <div className="tab-pane">
            <h3>Global Site Settings</h3>
            <form onSubmit={saveSettings} className="admin-form">
              <label>Hero Headline (HTML allowed):</label>
              <textarea value={settings.hero_headline} onChange={e => setSettings({ ...settings, hero_headline: e.target.value })} rows="3" />

              <label>Hero Subheading:</label>
              <textarea value={settings.hero_subhead} onChange={e => setSettings({ ...settings, hero_subhead: e.target.value })} rows="2" />

              <label>About Text ("Why Choose Us"):</label>
              <textarea value={settings.about_text} onChange={e => setSettings({ ...settings, about_text: e.target.value })} rows="3" />

              <label>Contact Email:</label>
              <input type="email" value={settings.contact_email} onChange={e => setSettings({ ...settings, contact_email: e.target.value })} />

              <label>Contact Phone:</label>
              <input type="tel" value={settings.contact_phone} onChange={e => setSettings({ ...settings, contact_phone: e.target.value })} />

              <label>Dark Theme Primary Color (Hex):</label>
              <input type="text" value={settings.primary_color} onChange={e => setSettings({ ...settings, primary_color: e.target.value })} />

              <label>Dark Theme Secondary Color (Hex):</label>
              <input type="text" value={settings.secondary_color} onChange={e => setSettings({ ...settings, secondary_color: e.target.value })} />

              <label>Light Theme Primary Color (Hex):</label>
              <input type="text" value={settings.primary_color_light || ''} onChange={e => setSettings({ ...settings, primary_color_light: e.target.value })} />

              <label>Light Theme Secondary Color (Hex):</label>
              <input type="text" value={settings.secondary_color_light || ''} onChange={e => setSettings({ ...settings, secondary_color_light: e.target.value })} />

              <button type="submit" className="btn-solid glow-button">Save Settings</button>
            </form>
          </div>
        )}

        {activeTab === 'change_password' && (
          <div className="tab-pane">
            <h3>Change Admin Password</h3>
            <form onSubmit={handleUpdatePassword} className="admin-form" style={{ maxWidth: '500px' }}>
              <label>Current Password:</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                required 
              />

              <label>New Password:</label>
              <input 
                type="password" 
                value={newPasswordVal} 
                onChange={e => setNewPasswordVal(e.target.value)} 
                required 
              />

              <label>Confirm New Password:</label>
              <input 
                type="password" 
                value={confirmPasswordVal} 
                onChange={e => setConfirmPasswordVal(e.target.value)} 
                required 
              />

              <button type="submit" className="btn-solid glow-button">Update Password</button>
            </form>
          </div>
        )}

        {activeTab === 'visibility' && (
          <div className="tab-pane">
            <h3>Toggle Sections</h3>
            <div className="visibility-toggles">
              {Object.keys(visibility).map(section => (
                <div key={section} className="toggle-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ textTransform: 'capitalize', fontSize: '1.2rem' }}>{section.replace('_', ' ')}</span>
                  <button onClick={() => toggleVisibility(section, visibility[section])} className={visibility[section] ? 'btn-solid glow-button' : 'btn-outline'} style={{ padding: '8px 20px' }}>
                    {visibility[section] ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="tab-pane">
            <h3>Manage Services</h3>
            <form onSubmit={handleSaveService} className="admin-form" style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <h4>{editingServiceId ? 'Edit Service' : 'Add New Service'}</h4>
              <input type="text" placeholder="Service Title" value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} required />
              <input type="text" placeholder="Category" value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })} required />
              <textarea placeholder="Short Description (for homepage card)" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} required rows="2"></textarea>
              <textarea placeholder="Full Description (HTML supported, for dedicated page)" value={newService.content} onChange={e => setNewService({ ...newService, content: e.target.value })} required rows="6"></textarea>
              <label>{editingServiceId ? 'Update Background Image (leave blank to keep current):' : 'Optional Background Image:'}</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-solid glow-button">{editingServiceId ? 'Update Service' : 'Add Service'}</button>
                {editingServiceId && (
                  <button type="button" onClick={cancelEditService} className="btn-cancel">Cancel</button>
                )}
              </div>
            </form>

            <div className="admin-list">
              {services.map(s => (
                <div key={s.id} className="admin-list-item glass-panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', marginBottom: '10px' }}>
                  <div>
                    <strong>{s.title}</strong> - {s.category}
                  </div>
                  <div>
                    <button onClick={() => handleEditService(s)} style={{ background: 'rgba(0,123,255,0.2)', color: '#66b3ff', border: '1px solid #007bff', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                    <button onClick={() => handleDeleteService(s.id)} style={{ background: 'rgba(255,0,0,0.2)', color: 'white', border: '1px solid red', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tech_stack' && (
          <div className="tab-pane">
            <h3>Manage Tech Stack</h3>
            <form onSubmit={handleAddTool} className="admin-form" style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <h4>Add New Tool</h4>
              <input type="text" placeholder="Tool Name (e.g., Figma)" value={newTool} onChange={e => setNewTool(e.target.value)} required />
              <button type="submit" className="btn-solid glow-button">Add Tool</button>
            </form>

            <div className="admin-list">
              {tools.map(t => (
                <div key={t.id} className="admin-list-item glass-panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', marginBottom: '10px', alignItems: 'center' }}>
                  <div><strong>{t.name}</strong></div>
                  <button onClick={() => handleDeleteTool(t.id)} style={{ background: 'rgba(255,0,0,0.2)', color: 'white', border: '1px solid red', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="tab-pane">
            <h3>Manage Blogs</h3>
            <form onSubmit={handleSaveBlog} className="admin-form" style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <h4>{editingBlogId ? 'Edit Blog' : 'Publish New Blog'}</h4>
              <input type="text" placeholder="Blog Title" value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} required />
              <input type="text" placeholder="Author Name" value={newBlog.author} onChange={e => setNewBlog({ ...newBlog, author: e.target.value })} required />
              <input type="text" placeholder="Tags (comma-separated, e.g. Design, WebDev)" value={newBlog.tags} onChange={e => setNewBlog({ ...newBlog, tags: e.target.value })} />
              <textarea placeholder="Blog Content (HTML supported)" value={newBlog.content} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })} required rows="8"></textarea>
              <label>{editingBlogId ? 'Update Cover Image (leave blank to keep current):' : 'Optional Cover Image:'}</label>
              <input type="file" accept="image/*" onChange={e => setBlogImageFile(e.target.files[0])} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-solid glow-button">{editingBlogId ? 'Update Blog' : 'Publish Blog'}</button>
                {editingBlogId && (
                  <button type="button" onClick={cancelEditBlog} className="btn-cancel">Cancel</button>
                )}
              </div>
            </form>

            <div className="admin-list">
              {blogs.map(b => (
                <div key={b.id} className="admin-list-item glass-panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', marginBottom: '10px' }}>
                  <div>
                    <strong>{b.title}</strong> by {b.author || 'Admin'}
                  </div>
                  <div>
                    <button onClick={() => handleEditBlog(b)} style={{ background: 'rgba(0,123,255,0.2)', color: '#66b3ff', border: '1px solid #007bff', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                    <button onClick={() => handleDeleteBlog(b.id)} style={{ background: 'rgba(255,0,0,0.2)', color: 'white', border: '1px solid red', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="tab-pane">
            <h3>Manage Portfolio</h3>
            <form onSubmit={handleSavePortfolio} className="admin-form" style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <h4>{editingPortfolioId ? 'Edit Project' : 'Add New Project'}</h4>
              <input type="text" placeholder="Project Title" value={newPortfolio.title} onChange={e => setNewPortfolio({ ...newPortfolio, title: e.target.value })} required />
              <input type="text" placeholder="Client Name" value={newPortfolio.client_name} onChange={e => setNewPortfolio({ ...newPortfolio, client_name: e.target.value })} required />
              <input type="text" placeholder="Services Provided (e.g. Video Production)" value={newPortfolio.services_provided} onChange={e => setNewPortfolio({ ...newPortfolio, services_provided: e.target.value })} />
              {/* YouTube URLs Manager */}
              <div className="youtube-urls-manager" style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>YouTube Video URLs:</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter YouTube Video URL (e.g., https://www.youtube.com/watch?v=...)" 
                    value={youtubeInput} 
                    onChange={e => setYoutubeInput(e.target.value)} 
                    style={{ flex: 1, marginTop: 0 }} 
                  />
                  <button 
                    type="button" 
                    className="btn-solid glow-button" 
                    onClick={() => {
                      if (youtubeInput.trim()) {
                        const updatedUrls = [...(newPortfolio.youtube_urls || [])];
                        if (!updatedUrls.includes(youtubeInput.trim())) {
                          updatedUrls.push(youtubeInput.trim());
                          setNewPortfolio({ ...newPortfolio, youtube_urls: updatedUrls });
                        }
                        setYoutubeInput('');
                      }
                    }}
                    style={{ padding: '0 20px', borderRadius: '8px', fontSize: '0.95rem' }}
                  >
                    Add Video
                  </button>
                </div>
                {(newPortfolio.youtube_urls || []).length > 0 && (
                  <div className="youtube-links-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0, 0, 0, 0.2)', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                    {(newPortfolio.youtube_urls || []).map((url, idx) => (
                      <div key={idx} className="youtube-link-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.9rem', color: '#ccc', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '80%' }}>{url}</span>
                        <button 
                          type="button" 
                          onClick={() => {
                            const updatedUrls = (newPortfolio.youtube_urls || []).filter((_, i) => i !== idx);
                            setNewPortfolio({ ...newPortfolio, youtube_urls: updatedUrls });
                          }}
                          style={{ background: 'rgba(255,0,0,0.15)', color: '#ff4d4d', border: '1px solid rgba(255,0,0,0.3)', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label>{editingPortfolioId ? 'Update Cover Image (optional):' : 'Cover Image:'}</label>
              <input type="file" accept="image/*" onChange={e => setPortfolioImageFile(e.target.files[0])} />

              <label>{editingPortfolioId ? 'Update Client Logo (optional):' : 'Client Logo:'}</label>
              <input type="file" accept="image/*" onChange={e => setPortfolioLogoFile(e.target.files[0])} />

              {/* Existing Media Assets Management */}
              {editingPortfolioId && (
                <div className="existing-media-management" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  
                  {/* Existing Videos */}
                  <div>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#fff' }}>Current Uploaded Videos</h5>
                    {existingVideoUrls.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {existingVideoUrls.map((url, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px' }}>
                            <video src={`${url}#t=0.5`} style={{ width: '80px', height: '45px', borderRadius: '4px', objectFit: 'cover', background: '#000' }} />
                            <span style={{ fontSize: '0.85rem', color: '#aaa', marginLeft: '10px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              Video {idx + 1} ({url.split('/').pop()})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Delete this video from the project? This will be finalized when you click Save Project.')) {
                                  setExistingVideoUrls(existingVideoUrls.filter((_, i) => i !== idx));
                                  setFilesToDelete([...filesToDelete, url]);
                                }
                              }}
                              style={{ background: 'rgba(255,77,77,0.15)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                              Delete Video
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#777', margin: 0 }}>No local videos uploaded.</p>
                    )}
                  </div>

                  {/* Existing Graphics */}
                  <div>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#fff' }}>Current Uploaded Graphics</h5>
                    {existingGraphicUrls.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                        {existingGraphicUrls.map((url, idx) => (
                          <div key={idx} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
                            <img src={url} alt={`graphic-${idx}`} style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }} />
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Delete this graphic from the project? This will be finalized when you click Save Project.')) {
                                  setExistingGraphicUrls(existingGraphicUrls.filter((_, i) => i !== idx));
                                  setFilesToDelete([...filesToDelete, url]);
                                }
                              }}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(255,77,77,0.9)',
                                color: '#fff',
                                border: 'none',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                lineHeight: 1
                              }}
                              title="Delete Graphic"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#777', margin: 0 }}>No local graphics uploaded.</p>
                    )}
                  </div>

                </div>
              )}

              <label>{editingPortfolioId ? 'Upload Additional Videos (optional):' : 'Upload Videos:'}</label>
              <input type="file" accept="video/*" multiple onChange={e => setPortfolioVideoFiles(e.target.files)} />

              <label>{editingPortfolioId ? 'Upload Additional Graphics (optional):' : 'Upload Graphics:'}</label>
              <input type="file" accept="image/*" multiple onChange={e => setPortfolioGraphicFiles(e.target.files)} />

              {uploadProgress > 0 && uploadProgress <= 100 && (
                <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, background: 'var(--secondary-color)', height: '100%', transition: 'width 0.3s' }}></div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" className="btn-solid glow-button" disabled={uploadProgress > 0 && uploadProgress < 100}>
                  {editingPortfolioId ? 'Update Project' : 'Add Project'}
                </button>
                {editingPortfolioId && (
                  <button type="button" onClick={cancelEditPortfolio} className="btn-cancel" disabled={uploadProgress > 0 && uploadProgress < 100}>Cancel</button>
                )}
              </div>
            </form>

            <div className="admin-list">
              {portfolios.map(p => (
                <div key={p.id} className="admin-list-item glass-panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', marginBottom: '10px' }}>
                  <div>
                    <strong>{p.title}</strong> - {p.client_name}
                  </div>
                  <div>
                    <button onClick={() => handleEditPortfolio(p)} style={{ background: 'rgba(0,123,255,0.2)', color: '#66b3ff', border: '1px solid #007bff', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                    <button onClick={() => handleDeletePortfolio(p.id)} style={{ background: 'rgba(255,0,0,0.2)', color: 'white', border: '1px solid red', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Admin;
