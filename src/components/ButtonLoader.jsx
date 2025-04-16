import React from 'react';
import './Loader.css';

const ButtonLoader = ({ text, loading, color = 'white' }) => {
  return (
    <div className="button-loader">
      {loading && (
        <div className={`spinner spinner-small spinner-${color}`} style={{ width: '16px', height: '16px' }}></div>
      )}
      <span>{loading ? 'Loading...' : text}</span>
    </div>
  );
};

export default ButtonLoader; 