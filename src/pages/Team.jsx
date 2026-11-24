import { useState, useEffect } from "react";
import "./Team.css";

const initialMembers = [
  {
    id: 1,
    name: "Montaha Al-Derawi",
    role: "Project Manager",
    email: "montaha@taskflow.io",
    status: "Active",
  },
  {
    id: 2,
    name: "Lamees",
    role: "Frontend Developer",
    email: "lamees@taskflow.io",
    status: "Active",
  },
  {
    id: 3,
    name: "Esraa",
    role: "UI/UX Designer",
    email: "esraa@taskflow.io",
    status: "Active",
  },
  {
    id: 4,
    name: "Laialy",
    role: "Team Member",
    email: "laialy@taskflow.io",
    status: "Away",
  },
];

const Team = () => {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("taskflow_team_v2");
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Team Member");

  useEffect(() => {
    localStorage.setItem("taskflow_team_v2", JSON.stringify(members));
  }, [members]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newMember = {
      id: Date.now(),
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: "Active",
    };

    setMembers([newMember, ...members]);
    setNewName("");
    setNewEmail("");
    setNewRole("Team Member");
    setShowForm(false);
  };

  const handleToggleStatus = (id) => {
    setMembers(
      members.map((member) =>
        member.id === id
          ? {
              ...member,
              status: member.status === "Active" ? "Away" : "Active",
            }
          : member
      )
    );
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activeCount = members.filter((m) => m.status === "Active").length;

  return (
    <main className="team-page">
      {/* Header */}
      <div className="team-header">
        <div>
          <h1>Team Members</h1>
          <p>Manage your workspace team and their roles</p>
        </div>
        <button
          className="btn-add-member"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Member"}
        </button>
      </div>

      {/* Add Member Form */}
      {showForm && (
        <form className="add-member-form" onSubmit={handleAddMember}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Team Member">Team Member</option>
            </select>
            <button type="submit" className="btn-save-member">
              Save
            </button>
          </div>
        </form>
      )}

      {/* Quick Stats */}
      <div className="team-stats">
        <div className="stat-box">
          <span className="stat-label">Total Members</span>
          <strong className="stat-value">{members.length}</strong>
        </div>
        <div className="stat-box">
          <span className="stat-label">Active Now</span>
          <strong className="stat-value active-text">{activeCount}</strong>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="team-controls">
        <input
          type="text"
          className="team-search"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="team-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Project Manager">Project Manager</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="UI/UX Designer">UI/UX Designer</option>
          <option value="Team Member">Team Member</option>
        </select>
      </div>

      {/* Members List */}
      <div className="team-cards">
        {filteredMembers.length === 0 ? (
          <p className="empty-state">No team members found.</p>
        ) : (
          filteredMembers.map((member) => (
            <div className="member-card" key={member.id}>
              <div className="member-top">
                <div className="member-avatar">{getInitials(member.name)}</div>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(member.id)}
                  title="Click to change status"
                  className={`status-dot ${
                    member.status === "Active" ? "online" : "away"
                  }`}
                  style={{ border: "none", cursor: "pointer" }}
                >
                  {member.status}
                </button>
              </div>

              <div className="member-info">
                <h3>{member.name}</h3>
                <span className="role-badge">{member.role}</span>
                <p className="member-email">{member.email}</p>
              </div>

              <div className="member-actions">
                <button
                  className="btn-remove"
                  onClick={() => handleDelete(member.id, member.name)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Team;