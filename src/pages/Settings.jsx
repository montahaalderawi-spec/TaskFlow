import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import "./Settings.css";

const DEFAULT_PROFILE = {
  email: "montaha@taskflow.app",
  role: "Admin",
  bio: "Managing projects, priorities, and team workflows in TaskFlow.",
};

const DEFAULT_NOTIFICATIONS = {
  taskReminders: true,
  teamUpdates: true,
  weeklyReport: false,
};

const Settings = () => {
  const {
    userName,
    setUserName,
    userRole,
    setUserRole,
    darkMode,
    toggleDarkMode,
  } = useContext(UserContext);

  // Profile state
  const [displayName, setDisplayName] = useState(userName);
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("taskflow_profile");
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        role: userRole || parsed.role || DEFAULT_PROFILE.role,
      };
    } catch {
      return {
        ...DEFAULT_PROFILE,
        role: userRole || DEFAULT_PROFILE.role,
      };
    }
  });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("taskflow_notifications");
      return saved
        ? { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(saved) }
        : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  // Security / Password state
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  // Sync displayName and role if context changes
  useEffect(() => {
    setDisplayName(userName);
  }, [userName]);

  useEffect(() => {
    if (userRole) {
      setProfile((prev) => ({ ...prev, role: userRole }));
    }
  }, [userRole]);

  // Persist notifications automatically
  useEffect(() => {
    localStorage.setItem(
      "taskflow_notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  const showTempMessage = (setter, type, text) => {
    setter({ type, text });
    setTimeout(() => {
      setter({ type: "", text: "" });
    }, 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      showTempMessage(setProfileMsg, "error", "Display name cannot be empty.");
      return;
    }

    setUserName(trimmedName);
    if (setUserRole) {
      setUserRole(profile.role);
    }
    localStorage.setItem("taskflow_profile", JSON.stringify(profile));
    showTempMessage(setProfileMsg, "success", "Profile updated successfully!");
  };

  const handleThemeSelect = (wantDark) => {
    if (wantDark !== darkMode) {
      toggleDarkMode();
    }
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.next || !passwords.confirm) {
      showTempMessage(setPasswordMsg, "error", "Please fill in all fields.");
      return;
    }

    if (passwords.next.length < 6) {
      showTempMessage(
        setPasswordMsg,
        "error",
        "New password must be at least 6 characters."
      );
      return;
    }

    if (passwords.next !== passwords.confirm) {
      showTempMessage(
        setPasswordMsg,
        "error",
        "New passwords do not match."
      );
      return;
    }

    setPasswords({ current: "", next: "", confirm: "" });
    showTempMessage(
      setPasswordMsg,
      "success",
      "Password updated successfully!"
    );
  };

  const handleResetLocalData = () => {
    const confirmed = window.confirm(
      "This will reset your saved profile details, notification preferences, and local task metadata. Continue?"
    );
    if (!confirmed) return;

    localStorage.removeItem("taskflow_profile");
    localStorage.removeItem("taskflow_notifications");
    localStorage.removeItem("taskflow-task-meta");
    localStorage.removeItem("taskflow_role");

    setProfile(DEFAULT_PROFILE);
    if (setUserRole) {
      setUserRole(DEFAULT_PROFILE.role);
    }
    setNotifications(DEFAULT_NOTIFICATIONS);
    showTempMessage(setProfileMsg, "success", "Local data has been reset.");
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      setUserName("");
    }
  };

  const avatarLetter = (userName || "U").trim().charAt(0).toUpperCase();

  return (
    <main className="settings-page">
      <div className="settings-page__container">
        {/* Page Header */}
        <header className="settings-page__header">
          <div>
            <span className="settings-page__eyebrow">PREFERENCES</span>
            <h1>Account Settings</h1>
            <p>
              Manage your profile details, appearance, notifications, and
              account security.
            </p>
          </div>

          <div className="settings-page__profile-chip">
            <span className="settings-page__avatar">{avatarLetter}</span>
            <div className="settings-page__chip-info">
              <strong>{userName || "Guest User"}</strong>
              <span>{profile.role}</span>
            </div>
          </div>
        </header>

        {/* Main Content Layout */}
        <div className="settings-page__layout">
          {/* Left Column */}
          <div className="settings-page__column">
            {/* Profile Settings Card */}
            <section className="settings-page__card">
              <div className="settings-page__card-head">
                <h2>Profile Information</h2>
                <p>Update your personal details shown across TaskFlow.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="settings-page__form">
                <div className="settings-page__row">
                  <div className="settings-page__field">
                    <label htmlFor="settings-username">Display Name</label>
                    <input
                      id="settings-username"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div className="settings-page__field">
                    <label htmlFor="settings-role">Role</label>
                    <select
                      id="settings-role"
                      value={profile.role}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                    >
                      <option value="Admin">Admin</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Frontend Developer">
                        Frontend Developer
                      </option>
                      <option value="Team Member">Team Member</option>
                    </select>
                  </div>
                </div>

                <div className="settings-page__field">
                  <label htmlFor="settings-email">Email Address</label>
                  <input
                    id="settings-email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="name@example.com"
                  />
                </div>

                <div className="settings-page__field">
                  <label htmlFor="settings-bio">Bio</label>
                  <textarea
                    id="settings-bio"
                    rows="3"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Write a short note about your role..."
                  />
                </div>

                {profileMsg.text && (
                  <div
                    className={`settings-page__alert is-${profileMsg.type}`}
                    role="status"
                  >
                    {profileMsg.text}
                  </div>
                )}

                <div className="settings-page__actions">
                  <button type="submit" className="settings-page__btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* Security Card */}
            <section className="settings-page__card">
              <div className="settings-page__card-head">
                <h2>Security & Password</h2>
                <p>Keep your workspace account protected.</p>
              </div>

              <form
                onSubmit={handlePasswordChange}
                className="settings-page__form"
              >
                <div className="settings-page__field">
                  <label htmlFor="current-password">Current Password</label>
                  <input
                    id="current-password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                    placeholder="••••••••"
                  />
                </div>

                <div className="settings-page__row">
                  <div className="settings-page__field">
                    <label htmlFor="new-password">New Password</label>
                    <input
                      id="new-password"
                      type="password"
                      value={passwords.next}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          next: e.target.value,
                        }))
                      }
                      placeholder="At least 6 characters"
                    />
                  </div>

                  <div className="settings-page__field">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          confirm: e.target.value,
                        }))
                      }
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>

                {passwordMsg.text && (
                  <div
                    className={`settings-page__alert is-${passwordMsg.type}`}
                    role="status"
                  >
                    {passwordMsg.text}
                  </div>
                )}

                <div className="settings-page__actions">
                  <button type="submit" className="settings-page__btn-primary">
                    Update Password
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Right Column */}
          <div className="settings-page__column">
            {/* Appearance Card */}
            <section className="settings-page__card">
              <div className="settings-page__card-head">
                <h2>Appearance</h2>
                <p>Choose how TaskFlow looks on your device.</p>
              </div>

              <div className="settings-page__theme-options">
                <button
                  type="button"
                  className={`settings-page__theme-card ${
                    !darkMode ? "is-active" : ""
                  }`}
                  onClick={() => handleThemeSelect(false)}
                >
                  <div className="settings-page__theme-preview is-light">
                    <span className="preview-sidebar" />
                    <span className="preview-content">
                      <i />
                      <i />
                    </span>
                  </div>
                  <div className="settings-page__theme-meta">
                    <strong>Light Mode</strong>
                    <span>Clean & bright workspace</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`settings-page__theme-card ${
                    darkMode ? "is-active" : ""
                  }`}
                  onClick={() => handleThemeSelect(true)}
                >
                  <div className="settings-page__theme-preview is-dark">
                    <span className="preview-sidebar" />
                    <span className="preview-content">
                      <i />
                      <i />
                    </span>
                  </div>
                  <div className="settings-page__theme-meta">
                    <strong>Dark Mode</strong>
                    <span>Easy on the eyes at night</span>
                  </div>
                </button>
              </div>
            </section>

            {/* Notifications Card */}
            <section className="settings-page__card">
              <div className="settings-page__card-head">
                <h2>Notifications</h2>
                <p>Control which alerts you want to receive.</p>
              </div>

              <div className="settings-page__toggles">
                <div className="settings-page__toggle-item">
                  <div>
                    <strong>Task Due Reminders</strong>
                    <span>Get reminded before upcoming deadlines.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications.taskReminders}
                    className={`settings-page__switch ${
                      notifications.taskReminders ? "is-on" : ""
                    }`}
                    onClick={() => handleToggleNotification("taskReminders")}
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-page__toggle-item">
                  <div>
                    <strong>Team Activity Updates</strong>
                    <span>Alerts when teammates update shared projects.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications.teamUpdates}
                    className={`settings-page__switch ${
                      notifications.teamUpdates ? "is-on" : ""
                    }`}
                    onClick={() => handleToggleNotification("teamUpdates")}
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-page__toggle-item">
                  <div>
                    <strong>Weekly Progress Summary</strong>
                    <span>Overview of your completed tasks every week.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications.weeklyReport}
                    className={`settings-page__switch ${
                      notifications.weeklyReport ? "is-on" : ""
                    }`}
                    onClick={() => handleToggleNotification("weeklyReport")}
                  >
                    <span />
                  </button>
                </div>
              </div>
            </section>

            {/* Danger Zone Card */}
            <section className="settings-page__card settings-page__danger">
              <div className="settings-page__card-head">
                <h2>Account Actions</h2>
                <p>Manage local workspace storage or sign out.</p>
              </div>

              <div className="settings-page__danger-actions">
                <button
                  type="button"
                  className="settings-page__btn-secondary"
                  onClick={handleResetLocalData}
                >
                  Reset Local Data
                </button>

                <button
                  type="button"
                  className="settings-page__btn-danger"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;