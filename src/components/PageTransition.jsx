import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import './PageTransition.css';

const PageTransition = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Show loader for 800ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-transition">
      {loading ? (
        <div className="page-loader-container">
          <div className="spinner page-spinner"></div>
        </div>
      ) : (
        <div className={`page-content ${loading ? '' : 'page-loaded'}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default PageTransition; 