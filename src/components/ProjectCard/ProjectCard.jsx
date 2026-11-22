import React from "react";
import "./ProjectCard.css";

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className="project-icon">📁</div>
        <span className={`project-status ${project.status}`}>
          {project.status}
        </span>
      </div>

      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <div className="project-progress">
        <div className="progress-info">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="project-card-footer">
        <span>👥 {project.members} Members</span>
        <span>📅 {project.deadline}</span>
      </div>
    </div>
  );
};

export default ProjectCard;