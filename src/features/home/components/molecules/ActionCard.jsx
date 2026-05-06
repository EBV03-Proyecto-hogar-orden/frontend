import React from 'react';
import '../styles/home.css';

export const ActionCard = ({ title, icon: Icon, colorVariant, filled = false }) => {
  return (
    <div className={`action-card action-card--${colorVariant} ${filled ? 'action-card--filled' : 'action-card--outline'}`}>
      <div className="action-card__icon-wrapper">
        <Icon size={24} className="action-card__icon" />
      </div>
      <span className="action-card__title">{title}</span>
    </div>
  );
};
