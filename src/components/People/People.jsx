 import React, { useState, useEffect } from "react";
import "./People.css";

const defaultMembers = [
  { id: 1, name: "Sarah Ahmed", role: "UI/UX Designer", initial: "S" },
  { id: 2, name: "Omar Ali", role: "Frontend Developer", initial: "O" },
  { id: 3, name: "Lina Hassan", role: "Backend Developer", initial: "L" },
  { id: 4, name: "Adam Khaled", role: "Project Manager", initial: "A" },
];

const People = ({ team = [] }) => {
  const [members, setMembers] = useState(defaultMembers);
  const [showMembers, setShowMembers] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (team.length > 0) {
      const apiMembers = team.map((member) => ({
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        role: member.company?.title || "Team Member",
        initial: member.firstName?.[0] || "?",
      }));

      setMembers(apiMembers);
    }
  }, [team]);

  const handleAddMember = (e) => {
    e.preventDefault();

    if (!name.trim() || !role.trim()) return;

    const newMember = {
      id: Date.now(),
      name: name.trim(),
      role: role.trim(),
      initial: name.trim()[0].toUpperCase(),
    };

    setMembers((prev) => [...prev, newMember]);
    setName("");
    setRole("");
    setShowForm(false);
    setShowMembers(true);
  };

  const handleDeleteMember = (id) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <div className="people-card">
      <div className="people-header">
        <div>
          <h3>Team Members</h3>
          <p>Meet your team</p>
        </div>

        <div className="people-actions">
          <button
            className="add-member-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Add Member
          </button>

          <button
            className="members-toggle"
            onClick={() => setShowMembers(!showMembers)}
            aria-expanded={showMembers}
          >
            {members.length} Members
            <span>{showMembers ? "⌃" : "⌄"}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form className="add-member-form" onSubmit={handleAddMember}>
          <input
            type="text"
            placeholder="Member name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Job role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />

          <div className="member-form-actions">
            <button type="submit" className="save-member-btn">
              Add
            </button>

            <button
              type="button"
              className="cancel-member-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {showMembers && (
        <div className="people-list">
          {members.map((member) => (
            <div className="person-item" key={member.id}>
              <div className="person-avatar">{member.initial}</div>

              <div className="person-info">
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>

              <button
                className="delete-member-btn"
                onClick={() => handleDeleteMember(member.id)}
                title="Delete member"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default People;