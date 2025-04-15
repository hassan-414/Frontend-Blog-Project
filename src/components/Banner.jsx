import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Banner.css';

function Banner() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="banner">
      <div className="banner-content">
        <div className="banner-text">
          <h1 className="banner-title">Create a blog worth sharing</h1>
          <p className="banner-description">
            Whether it's about study hacks, travel adventures, or delicious food experiences – start your blog today and share your story with the world!
          </p>

          <button
            className={`banner-button ${isHovered ? 'button-hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              const token = localStorage.getItem('token');
              if (token) {
                navigate('/addyourblog');
              } else {
                alert('Please login to start blogging.');
                navigate('/login');
              }
            }}
          >
            Start Blogging
          </button>

          <p className="banner-note">
            Try it for free for an unlimited time.
          </p>
        </div>

        <div className="banner-preview">
          <div className="browser-mockup">
            <div className="browser-header">
              <div className="browser-dot red"></div>
              <div className="browser-dot yellow"></div>
              <div className="browser-dot green"></div>
            </div>

            <div className="blog-preview">
              <div className="preview-content">
                <h2 className="preview-title">Hassan Ahmed BLOG</h2>
                <p className="preview-subtitle">Your path to mindfulness and health</p>
                <div className="preview-grid"></div>
              </div>
            </div>
          </div>

          <div className="decorative-element square"></div>
          <div className="decorative-element circle"></div>
        </div>
      </div>

      <div className="bg-circle top-right"></div>
      <div className="bg-circle bottom-left"></div>
    </div>
  );
}

export default Banner;
