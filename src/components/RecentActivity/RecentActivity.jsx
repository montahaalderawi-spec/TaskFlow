 import React, { useState } from "react";
import "./RecentActivity.css";

const RecentActivity = ({ team = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const getMemberName = (index, fallback) => {
    const member = team[index];
    return member
      ? `${member.firstName} ${member.lastName}`
      : fallback;
  };

  const activities = [
    {
      id: 1,
      name: getMemberName(0, "Sarah Ahmed"),
      action: "completed a task",
      project: "Website Design",
      time: "10 minutes ago",
      icon: "✓",
      type: "Tasks",
    },
    {
      id: 2,
      name: getMemberName(1, "Omar Ali"),
      action: "created a new task",
      project: "Mobile Application",
      time: "30 minutes ago",
      icon: "+",
      type: "Tasks",
    },
    {
      id: 3,
      name: getMemberName(2, "Lina Hassan"),
      action: "updated a project",
      project: "Dashboard System",
      time: "1 hour ago",
      icon: "↻",
      type: "Projects",
    },
    {
      id: 4,
      name: getMemberName(3, "Adam Khaled"),
      action: "joined the team",
      project: "TaskFlow",
      time: "2 hours ago",
      icon: "👤",
      type: "Team",
    },
    {
      id: 5,
      name: getMemberName(0, "Sarah Ahmed"),
      action: "uploaded new UI assets",
      project: "Website Design",
      time: "3 hours ago",
      icon: "⬆",
      type: "Projects",
    },
    {
      id: 6,
      name: getMemberName(1, "Omar Ali"),
      action: "fixed responsive layout",
      project: "Dashboard System",
      time: "5 hours ago",
      icon: "✓",
      type: "Tasks",
    },
  ];

  const filters = ["All", "Tasks", "Projects", "Team"];

  const filteredActivities =
    activeFilter === "All"
      ? activities
      : activities.filter(
          (activity) => activity.type === activeFilter
        );

  const visibleActivities = showAll
    ? filteredActivities
    : filteredActivities.slice(0, 4);

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <div>
          <h3>Recent Activity</h3>
          <p>Latest team activities</p>
        </div>

        {filteredActivities.length > 4 && (
          <button
            className="activity-view-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      <div className="activity-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`activity-filter ${
              activeFilter === filter ? "active" : ""
            }`}
            onClick={() => {
              setActiveFilter(filter);
              setShowAll(false);
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="activity-list">
        {visibleActivities.length > 0 ? (
          visibleActivities.map((activity) => (
            <div className="activity-item" key={activity.id}>
              <div className="activity-timeline">
                <div className={`activity-icon activity-${activity.type.toLowerCase()}`}>
                  {activity.icon}
                </div>
              </div>

              <div className="activity-info">
                <p>
                  <span className="activity-avatar">
                    {activity.name.charAt(0).toUpperCase()}
                  </span>

                  <strong>{activity.name}</strong>{" "}
                  {activity.action}
                </p>

                <span className="activity-project">
                  {activity.project}
                </span>
              </div>

              <small className="activity-time">
                {activity.time}
              </small>
            </div>
          ))
        ) : (
          <div className="activity-empty">
            No activities found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;