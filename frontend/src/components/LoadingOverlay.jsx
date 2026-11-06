import React from 'react';
import './LoadingOverlay.css';

export const LoadingOverlay = ({ active }) => {
  if (!active) return null;

  return (
    <>
      <div className="studi-overlay" />
      <span className="studi-loader" />
    </>
  );
};

export default LoadingOverlay;
