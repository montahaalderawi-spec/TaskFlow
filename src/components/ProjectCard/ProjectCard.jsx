import React from 'react'
import './ProjectCard.css';

const ProjectCard = ({id, title, description, status,Delete}) => {
  return (
    <div className="project-card">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="card-footer">
        <span className={`status ${status.toLowerCase()}`}>{status}</span>
        
        <button onClick={() => Delete(id)}className="delete-btn">Delete</button>
      </div>
    </div>
  )
}

export default ProjectCard