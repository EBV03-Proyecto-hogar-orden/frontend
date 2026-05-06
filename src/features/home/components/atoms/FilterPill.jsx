import React from 'react';
import '../styles/home.css';

export const FilterPill = ({ label, isActive, onClick, colorVariant = 'default' }) => {
  return (
    <button 
      className={`filter-pill ${isActive ? `filter-pill--active-${colorVariant}` : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
