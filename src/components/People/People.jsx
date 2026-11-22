import React from "react";
import "./People.css";

const members = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "UI/UX Designer",
    initial: "S",
  },
  {
    id: 2,
    name: "Omar Ali",
    role: "Frontend Developer",
    initial: "O",
  },
  {
    id: 3,
    name: "Lina Hassan",
    role: "Backend Developer",
    initial: "L",
  },
  {
    id: 4,
    name: "Adam Khaled",
    role: "Project Manager",
    initial: "A",
  },
];

const People = () => {
  return (
    <div className="people-card">
      <div className="people-header">
        <div>
          <h3>Team Members</h3>
          <p>Meet your team</p>
        </div>
        <span>{members.length} Members</span>
      </div>

      <div className="people-list">
        {members.map((member) => (
          <div className="person-item" key={member.id}>
            <div className="person-avatar">
              {member.initial}
            </div>

            <div className="person-info">
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;