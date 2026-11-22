import React from "react";
import "./AssignedTasks.css";

const tasks = [
  {
    id: 1,
    title: "Design Homepage",
    project: "Website Design",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Fix Login Page",
    project: "Mobile Application",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: 3,
    title: "Create Dashboard",
    project: "Dashboard System",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 4,
    title: "Update Documentation",
    project: "TaskFlow",
    priority: "Low",
    status: "Completed",
  },
];

const AssignedTasks = () => {
  return (
    <div className="assigned-tasks">
      <div className="assigned-header">
        <div>
          <h3>Assigned Tasks</h3>
          <p>Tasks assigned to your team</p>
        </div>
        <span>View All</span>
      </div>

      <div className="assigned-list">
        {tasks.map((task) => (
          <div className="assigned-item" key={task.id}>
            <div className="task-details">
              <h4>{task.title}</h4>
              <p>{task.project}</p>
            </div>

            <div className="task-labels">
              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>

              <span className={`task-status ${task.status.toLowerCase().replace(" ", "-")}`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedTasks;