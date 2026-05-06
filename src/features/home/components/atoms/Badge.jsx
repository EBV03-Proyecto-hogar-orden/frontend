import React from 'react';
import { Flag } from 'lucide-react';
import '../styles/home.css';

export const Badge = ({ type, value }) => {
  const isPriority = type === 'priority';
  
  // Mapping values to CSS modifier classes
  const colorMap = {
    'Alta': 'red',
    'Media': 'orange',
    'Baja': 'green',
    'Pendiente': 'gray',
    'En progreso': 'orange',
    'Completada': 'green'
  };

  const colorClass = colorMap[value] || 'gray';

  return (
    <span className={`badge badge--${colorClass} ${isPriority ? 'badge--priority' : 'badge--status'}`}>
      {isPriority && <Flag size={12} className="badge__icon" />}
      {value}
    </span>
  );
};
