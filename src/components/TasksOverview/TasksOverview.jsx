import React from "react";
import "./TasksOverview.css";

const TasksOverview = () => {
  const tasks = [
    { day: "Sat", completed: 40, pending: 25 },
    { day: "Sun", completed: 65, pending: 20 },
    { day: "Mon", completed: 50, pending: 35 },
    { day: "Tue", completed: 80, pending: 15 },
    { day: "Wed", completed: 60, pending: 25 },
    { day: "Thu", completed: 90, pending: 10 },
    { day: "Fri", completed: 70, pending: 20 },
  ];

  return (
    <div className="tasks-chart">
      <div className="chart-header">
        <div>
          <h3>Tasks Overview</h3>
          <p>Weekly task performance</p>
        </div>
        <span className="chart-period">This Week</span>
      </div>

      <div className="chart-legend">
        <span><i className="completed-dot"></i> Completed</span>
        <span><i className="pending-dot"></i> Pending</span>
      </div>

      <div className="chart-bars">
        {tasks.map((task) => (
          <div className="chart-column" key={task.day}>
            <div className="bars">
              <div
                className="bar completed-bar"
                style={{ height: `${task.completed}%` }}
              ></div>

              <div
                className="bar pending-bar"
                style={{ height: `${task.pending}%` }}
              ></div>
            </div>

            <span>{task.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksOverview;