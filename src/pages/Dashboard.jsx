 import React, { useState } from "react";
import "./Dashboard.css";

const tasks = [
  { id: 1, title: "Do something nice for someone you care about", status: "Pending" },
  { id: 2, title: "Memorize a poem", status: "Completed" },
  { id: 3, title: "Watch a classic movie", status: "Completed" },
  { id: 4, title: "Watch a documentary", status: "Pending" },
  { id: 5, title: "Invest in cryptocurrency", status: "Pending" },
];

const team = [
  { id: 1, initials: "EJ", name: "Emily Johnson", job: "Sales Manager", department: "Engineering", color: "#36a9e8" },
  { id: 2, initials: "MW", name: "Michael Williams", job: "Support Specialist", department: "Support", color: "#22b8b5" },
  { id: 3, initials: "SB", name: "Sophia Brown", job: "Accountant", department: "Research and Development", color: "#8064d8" },
  { id: 4, initials: "JD", name: "James Davis", job: "Research Analyst", department: "Support", color: "#e99528" },
];

function Dashboard() {
  const [filter, setFilter] = useState("All");
  const [taskList, setTaskList] = useState(tasks);

  const completed = taskList.filter(task => task.status === "Completed").length;
  const pending = taskList.filter(task => task.status === "Pending").length;
  const total = 30;
  const percentage = 50;

  const filteredTasks =
    filter === "All"
      ? taskList
      : taskList.filter(task => task.status === filter);

  const toggleTask = (id) => {
    setTaskList(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              status: task.status === "Completed" ? "Pending" : "Completed"
            }
          : task
      )
    );
  };

  return (
    <div className="dashboard">

      <h2 className="overview-title">Dashboard Overview</h2>

      <div className="overview-cards">
        <div className="overview-card blue">
          <p>TOTAL TASKS</p>
          <h2>{total}</h2>
        </div>

        <div className="overview-card green">
          <p>COMPLETED</p>
          <h2>{15 + completed - 2}</h2>
        </div>

        <div className="overview-card orange">
          <p>PENDING</p>
          <h2>{15 + pending - 3}</h2>
        </div>

        <div className="overview-card purple">
          <p>COMPLETION RATE</p>
          <h2>{percentage}%</h2>
        </div>
      </div>

      <div className="progress-card">
        <div className="progress-heading">
          <h2>Overall Completion Progress</h2>
          <span>{percentage}%</span>
        </div>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <div className="dashboard-middle">

        <div className="distribution-card">
          <h2>Tasks Distribution</h2>

          <div className="donut-chart">
            <div className="donut-center"></div>
          </div>

          <div className="chart-legend">
            <span><i className="legend-green"></i> Completed</span>
            <span><i className="legend-orange"></i> Pending</span>
          </div>
        </div>

        <div className="recent-tasks-card">
          <div className="recent-header">
            <h2>Recent Tasks</h2>
            <span>View All →</span>
          </div>

          <div className="task-filters">
            {["All", "Pending", "Completed"].map(item => (
              <button
                key={item}
                className={filter === item ? "active-filter" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="recent-task-list">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className={`recent-task ${task.status === "Completed" ? "done" : ""}`}
                onClick={() => toggleTask(task.id)}
              >
                <span>{task.title}</span>
                <small className={task.status.toLowerCase()}>
                  {task.status}
                </small>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="team-section">
        <div className="team-heading">
          <h2>Our Team</h2>
          <span>View All Team →</span>
        </div>

        <div className="team-grid">
          {team.map(member => (
            <div className="team-card" key={member.id}>
              <div
                className="team-avatar"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>

              <h3>{member.name}</h3>
              <p>{member.job}</p>
              <span>{member.department}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;