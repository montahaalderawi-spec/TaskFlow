import React from "react";
import "./RecentActivity.css";

const activities = [
  {
    id: 1,
    name: "Sarah Ahmed",
    action: "completed a task",
    project: "Website Design",
    time: "10 minutes ago",
    icon: "✓",
  },
  {
    id: 2,
    name: "Omar Ali",
    action: "created a new task",
    project: "Mobile Application",
    time: "30 minutes ago",
    icon: "+",
  },
  {
    id: 3,
    name: "Lina Hassan",
    action: "updated a project",
    project: "Dashboard System",
    time: "1 hour ago",
    icon: "↻",
  },
  {
    id: 4,
    name: "Adam Khaled",
    action: "joined the team",
    project: "TaskFlow",
    time: "2 hours ago",
    icon: "👤",
  },
];

const RecentActivity = () => {
  return (
    <div className="recent-activity">
      <div className="activity-header">
        <div>
          <h3>Recent Activity</h3>
          <p>Latest team activities</p>
        </div>
        <span>View All</span>
      </div>

      <div className="activity-list">
        {activities.map((activity) => (
          <div className="activity-item" key={activity.id}>
            <div className="activity-icon">
              {activity.icon}
            </div>

            <div className="activity-info">
              <p>
                <strong>{activity.name}</strong>{" "}
                {activity.action}
              </p>

              <span>{activity.project}</span>
            </div>

            <small>{activity.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;