import React from "react";
import "./StatCard.css";

const StatCard = ({ title, value, description, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>
        <span className="stat-card-icon">{icon}</span>
      </div>

      <h2>{value}</h2>

      <p>{description}</p>
    </div>
  );
};

export default StatCard;