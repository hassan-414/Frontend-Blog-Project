import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', color = 'primary', fullScreen = false, showText = false }) => {
  const loaderClasses = `loader loader-${size} loader-${color} ${fullScreen ? 'loader-fullscreen' : ''}`;
  
  return (
    <div className={loaderClasses}>
      <div className="spinner"></div>
      {showText && <p className="loading-text">Loading...</p>}
    </div>
  );
};

export default Loader; 