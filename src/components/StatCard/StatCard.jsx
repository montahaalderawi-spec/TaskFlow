import React from 'react';
import './StatCard.css';

const StatCard = React.memo(({ title, value, color = 'blue' }) => {
  return (
    <div className={`stat-card stat-${color}`}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
});

export default StatCard;