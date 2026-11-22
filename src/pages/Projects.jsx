 import React from "react";

import ProjectCard from "../components/ProjectCard/ProjectCard";
import StatCard from "../components/StatCard/StatCard";
import TasksChart from "../components/TasksChart/TasksChart";
import People from "../components/People/People";
import RecentActivity from "../components/RecentActivity/RecentActivity";
import AssignedTasks from "../components/AssignedTasks/AssignedTasks";

import "./Projects.css";

const projects = [
  {
    id: 1,
    name: "Website Design",
    description: "Design and develop a modern website.",
    status: "In Progress",
    progress: 75,
    members: 4,
    deadline: "Dec 20",
  },
  {
    id: 2,
    name: "Mobile Application",
    description: "Build a mobile application for users.",
    status: "Completed",
    progress: 100,
    members: 3,
    deadline: "Dec 15",
  },
  {
    id: 3,
    name: "Dashboard System",
    description: "Create an interactive dashboard system.",
    status: "In Progress",
    progress: 45,
    members: 5,
    deadline: "Dec 30",
  },
];

const Projects = () => {
  return (
    <div className="projects-page">

      {/* Page Heading */}
      <div className="projects-heading">
        <div>
          <p className="projects-subtitle">WORKSPACE / PROJECTS</p>
          <h1>Projects</h1>
          <p>Manage and track all your projects.</p>
        </div>

        <button className="new-project-btn">
          + New Project
        </button>
      </div>

      {/* Statistics */}
      <div className="projects-stats">
        <StatCard
          title="Total Projects"
          value="12"
          description="Projects in workspace"
          icon="📁"
        />

        <StatCard
          title="Active Tasks"
          value="24"
          description="Tasks currently active"
          icon="📋"
        />

        <StatCard
          title="Team Members"
          value="08"
          description="People in your team"
          icon="👥"
        />

        <StatCard
          title="Completed"
          value="18"
          description="Tasks completed"
          icon="✅"
        />
      </div>

      {/* Projects Cards */}
      <div className="projects-section-title">
        <h2>All Projects</h2>
        <p>Keep track of your latest projects.</p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>

      {/* Other Sections */}
      <div className="projects-lower-grid">
        <TasksChart />
        <People />
        <RecentActivity />
        <AssignedTasks />
      </div>

    </div>
  );
};

export default Projects;