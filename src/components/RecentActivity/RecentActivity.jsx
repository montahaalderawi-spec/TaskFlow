import React, { useState } from "react";
import "./RecentActivity.css";

const RecentActivity = ({ team = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const getMemberName = (index, fallback) => {
    const member = team[index];
    return member ? `${member.firstName} ${member.lastName}` : fallback;
  };

  const activities = [
    {
      id: 1,
      name: getMemberName(0, "Sarah Ahmed"),
      action: "completed a task",
      project: "Website Design",
      time: "10 minutes ago",
      icon: "✓",
    },
    {
      id: 2,
      name: getMemberName(1, "Omar Ali"),
      action: "created a new task",
      project: "Mobile Application",
      time: "30 minutes ago",
      icon: "+",
    },
    {
      id: 3,
      name: getMemberName(2, "Lina Hassan"),
      action: "updated a project",
      project: "Dashboard System",
      time: "1 hour ago",
      icon: "↻",
    },
    {
      id: 4,
      name: getMemberName(3, "Adam Khaled"),
      action: "joined the team",
      project: "TaskFlow",
      time: "2 hours ago",
      icon: "👤",
    },
    {
      id: 5,
      name: getMemberName(0, "Sarah Ahmed"),
      action: "uploaded new UI assets",
      project: "Website Design",
      time: "3 hours ago",
      icon: "⬆",
    },
    {
      id: 6,
      name: getMemberName(1, "Omar Ali"),
      action: "fixed responsive layout",
      project: "Dashboard System",
      time: "5 hours ago",
      icon: "✓",
    },
  ];

  const visibleActivities = showAll ? activities : activities.slice(0, 4);

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <div>
          <h3>Recent Activity</h3>
          <p>Latest team activities</p>
        </div>

        {activities.length > 4 && (
          <span
            onClick={() => setShowAll(!showAll)}
            style={{ cursor: "pointer" }}
          >
            {showAll ? "Show Less" : "View All"}
          </span>
        )}
      </div>

      <div className="activity-list">
        {visibleActivities.map((activity) => (
          <div className="activity-item" key={activity.id}>
            <div className="activity-icon">{activity.icon}</div>

            <div className="activity-info">
              <p>
                <strong>{activity.name}</strong> {activity.action}
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