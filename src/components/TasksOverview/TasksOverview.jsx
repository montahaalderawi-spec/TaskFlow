 import React, { useState } from "react";
import "./TasksOverview.css";

const chartData = {
  "This Week": [
    { day: "Sat", completed: 40, pending: 25 },
    { day: "Sun", completed: 65, pending: 20 },
    { day: "Mon", completed: 50, pending: 35 },
    { day: "Tue", completed: 80, pending: 15 },
    { day: "Wed", completed: 60, pending: 25 },
    { day: "Thu", completed: 90, pending: 10 },
    { day: "Fri", completed: 70, pending: 20 },
  ],

  "Last Week": [
    { day: "Sat", completed: 30, pending: 40 },
    { day: "Sun", completed: 55, pending: 30 },
    { day: "Mon", completed: 70, pending: 20 },
    { day: "Tue", completed: 45, pending: 35 },
    { day: "Wed", completed: 85, pending: 15 },
    { day: "Thu", completed: 60, pending: 25 },
    { day: "Fri", completed: 75, pending: 20 },
  ],

  "This Month": [
    { day: "Week 1", completed: 55, pending: 35 },
    { day: "Week 2", completed: 75, pending: 20 },
    { day: "Week 3", completed: 65, pending: 25 },
    { day: "Week 4", completed: 90, pending: 10 },
  ],
};

const TasksOverview = () => {
  const [period, setPeriod] = useState("This Week");
  const [showOptions, setShowOptions] = useState(false);

  const tasks = chartData[period];

  return (
    <div className="tasks-chart">

      <div className="chart-header">
        <div>
          <h3>Tasks Overview</h3>
          <p>Weekly task performance</p>
        </div>

        <div className="period-container">
          <button
            className="chart-period"
            onClick={() => setShowOptions(!showOptions)}
          >
            {period} <span>⌄</span>
          </button>

          {showOptions && (
            <div className="period-options">
              {Object.keys(chartData).map((option) => (
                <button
                  key={option}
                  className={period === option ? "selected-period" : ""}
                  onClick={() => {
                    setPeriod(option);
                    setShowOptions(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="chart-legend">
        <span>
          <i className="completed-dot"></i> Completed
        </span>

        <span>
          <i className="pending-dot"></i> Pending
        </span>
      </div>

      <div className="chart-bars">
        {tasks.map((task) => (
          <div className="chart-column" key={task.day}>
            <div className="bars">
              <div
                className="bar completed-bar"
                style={{ height: `${task.completed}%` }}
                title={`Completed: ${task.completed}`}
              ></div>

              <div
                className="bar pending-bar"
                style={{ height: `${task.pending}%` }}
                title={`Pending: ${task.pending}`}
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