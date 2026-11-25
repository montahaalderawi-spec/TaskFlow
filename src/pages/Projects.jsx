 import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import StatCard from "../components/StatCard/StatCard";
import TasksOverview from "../components/TasksOverview/TasksOverview";
import People from "../components/People/People";
import RecentActivity from "../components/RecentActivity/RecentActivity";
import AssignedTasks from "../components/AssignedTasks/AssignedTasks";
import "./Projects.css";

const initialProjects = [
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
  const [team, setTeam] = useState([]);
  const [projectList, setProjectList] = useState(initialProjects);

  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("In Progress");

  useEffect(() => {
    fetch("https://dummyjson.com/users?limit=4")
      .then((res) => res.json())
      .then((data) => setTeam(data.users || []))
      .catch((err) => console.error("Error fetching team:", err));
  }, []);

  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setDeadline("");
    setProgress(0);
    setStatus("In Progress");
    setEditingProjectId(null);
    setShowForm(false);
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setProjectName(project.name);
    setDescription(project.description);
    setDeadline(project.deadline);
    setProgress(project.progress);
    setStatus(project.status);
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (confirmed) {
      setProjectList((prev) =>
        prev.filter((project) => project.id !== id)
      );
    }
  };

  const handleSubmitProject = (e) => {
    e.preventDefault();

    if (!projectName.trim()) return;

    if (editingProjectId !== null) {
      setProjectList((prev) =>
        prev.map((project) =>
          project.id === editingProjectId
            ? {
                ...project,
                name: projectName.trim(),
                description: description.trim(),
                deadline: deadline || "Not set",
                progress: Number(progress),
                status,
              }
            : project
        )
      );
    } else {
      const formattedDeadline = deadline
        ? new Date(`${deadline}T00:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Not set";

      const newProject = {
        id: Date.now(),
        name: projectName.trim(),
        description: description.trim(),
        status: "In Progress",
        progress: 0,
        members: 1,
        deadline: formattedDeadline,
      };

      setProjectList((prev) => [...prev, newProject]);
    }

    resetForm();
  };

  return (
    <div className="projects-page" lang="en">
      <div className="projects-heading">
        <div>
          <p className="projects-subtitle">WORKSPACE / PROJECTS</p>
          <h1>Projects</h1>
          <p>Manage and track all your projects.</p>
        </div>

        <button
          className="new-project-btn"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
        >
          {showForm ? "✕ Close" : "+ New Project"}
        </button>
      </div>

      {showForm && (
        <form
          className="add-project-form"
          onSubmit={handleSubmitProject}
          lang="en-US"
        >
          <div className="form-title">
            <span className="form-plus">
              {editingProjectId !== null ? "✏️" : "+"}
            </span>

            <div>
              <h3>
                {editingProjectId !== null
                  ? "Edit Project"
                  : "Add a New Project"}
              </h3>
              <p>
                {editingProjectId !== null
                  ? "Update your project details."
                  : "Enter the details of your new project."}
              </p>
            </div>
          </div>

          <div className="project-inputs">
            <div className="project-field">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="What is your project name?"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>

            <div className="project-field">
              <label>Description</label>
              <input
                type="text"
                placeholder="Describe your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="project-field">
              <label>Deadline</label>
              <input
                type={editingProjectId !== null ? "text" : "date"}
                placeholder={
                  editingProjectId !== null ? "Example: Dec 20" : ""
                }
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            {editingProjectId !== null && (
              <>
                <div className="project-field">
                  <label>Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    required
                  />
                </div>

                <div className="project-field">
                  <label>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="project-form-actions">
            <button type="submit" className="add-project-submit">
              {editingProjectId !== null
                ? "Save Changes"
                : "Add Project →"}
            </button>

            <button
              type="button"
              className="cancel-project-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="projects-stats">
        <StatCard
          title="Total Projects"
          value={12 + projectList.length - initialProjects.length}
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

      <div className="projects-section-title">
        <h2>All Projects</h2>
        <p>Keep track of your latest projects.</p>
      </div>

      <div className="projects-grid">
        {projectList.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>

      <div className="projects-lower-grid">
        <TasksOverview />
        <People team={team} />
        <RecentActivity team={team} />
        <AssignedTasks />
      </div>
    </div>
  );
};

export default Projects;