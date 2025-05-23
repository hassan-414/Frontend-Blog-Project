import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CommentSystem from './CommentSystem';
import Loader from './Loader';
import ButtonLoader from './ButtonLoader';
import PageTransition from './PageTransition';
import './Bloglist.css';

const Bloglist = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [addingBlog, setAddingBlog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://backend-blog-project-production-67cb.up.railway.app/api/blogs");
      const data = response.data;
      
      let blogsArray = [];
      if (Array.isArray(data)) {
        blogsArray = data;
      } else if (data && typeof data === 'object') {
        blogsArray = data.blogs || [];
      }

      if (blogsArray.length > 0) {
        const sortedBlogs = blogsArray.sort((a, b) => 
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
        setBlogs(sortedBlogs);
      } else {
        setBlogs([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
      setBlogs([]);
      setLoading(false);
    }
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const getAuthorName = (author) => {
    if (!author) return 'Unknown Author';
    if (typeof author === 'string') return author;
    return author.username || 'Unknown Author';
  };

  const getTruncatedContent = (content) => {
    if (!content) return '';
    const maxLength = 150; // Character limit for truncated content
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleAddBlog = () => {
    setAddingBlog(true);
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/addyourblog');
    } else {
      alert('Please login to start blogging.');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader size="large" fullScreen={true} showText={false} />
      </div>
    );
  }
  
  if (error) return <div className="blog-error">{error}</div>;
  if (blogs.length === 0) return <div className="no-blogs-message">No blogs found</div>;

  return (
    <PageTransition>
      <div className="blog-list-container">
        <h1 className="blog-list-title">Latest Blog Posts</h1>
        <div className="blog-list">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <h2 className="blog-title">{blog.title}</h2>
              <span className="blog-date">
                By {getAuthorName(blog.author)} • {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              
              {blog.image && (
                <div className="blog-image-container">
                  <img 
                    src={blog.image || "default.jpg"} 
                    alt={blog.title} 
                    className="blog-image"
                  />
                </div>
              )}

              <div className="blog-content">
                {blog.description && (
                  <p className="blog-description">
                    {expandedPosts[blog._id] ? blog.description : getTruncatedContent(blog.description)}
                    {blog.description && blog.description.length > 150 && (
                      <button 
                        className="read-more-btn"
                        onClick={() => toggleReadMore(blog._id)}
                      >
                        <ButtonLoader 
                          text={expandedPosts[blog._id] ? 'Show Less' : 'Read More'} 
                          loading={false} 
                        />
                      </button>
                    )}
                  </p>
                )}
                
                <div className="blog-content-wrapper">
                  <p className={`blog-content-text ${expandedPosts[`content-${blog._id}`] ? 'expanded' : ''}`}>
                    {expandedPosts[`content-${blog._id}`] ? blog.content : getTruncatedContent(blog.content)}
                  </p>
                  {blog.content && blog.content.length > 150 && (
                    <button 
                      className="read-more-btn"
                      onClick={() => toggleReadMore(`content-${blog._id}`)}
                    >
                      <ButtonLoader 
                        text={expandedPosts[`content-${blog._id}`] ? 'Show Less' : 'Read More'} 
                        loading={false} 
                      />
                    </button>
                  )}
                </div>
              </div>

              <div className="comments-container">
                <CommentSystem blogId={blog._id} />
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="add-blog-btn"
          onClick={handleAddBlog}
          disabled={addingBlog}
        >
          <ButtonLoader text="Add Your Blog" loading={addingBlog} />
        </button>
      </div>
    </PageTransition>
  );
};

export default Bloglist;