import { useState, useEffect, useCallback, useRef } from "react";
import "./Tasks.css";

const API_URL = "https://dummyjson.com/todos";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newCategory, setNewCategory] = useState("Personal");
  const [newDueDate, setNewDueDate] = useState("");
  const newTaskInputRef = useRef(null);

  const [taskMeta, setTaskMeta] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("taskflow-task-meta") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("taskflow-task-meta", JSON.stringify(taskMeta));
  }, [taskMeta]);

  const updateTaskMeta = (id, changes) => {
    setTaskMeta((previous) => ({
      ...previous,
      [id]: {
        ...(previous[id] || {}),
        ...changes,
      },
    }));
  };

  const createNewTask = () => {
    setNewTask("");
    setNewPriority("medium");
    setNewCategory("Personal");
    setNewDueDate("");
    setFilter("all");
    setSearch("");

    newTaskInputRef.current?.focus();
  };

  // Fetch tasks and register previously completed tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}?limit=30`);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      const fetchedTasks = data.todos || [];

      setTasks(fetchedTasks);

      // Tasks already completed by the API have no completion date.
      // Register them once so they can appear in weekly activity.
      setTaskMeta((previous) => {
        const updatedMeta = { ...previous };
        const today = new Date().toISOString();

        fetchedTasks.forEach((task) => {
          if (task.completed && !updatedMeta[task.id]?.completedAt) {
            updatedMeta[task.id] = {
              ...(updatedMeta[task.id] || {}),
              completedAt: today,
            };
          }
        });

        return updatedMeta;
      });
    } catch {
      setError("Unable to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a new task
  const addTask = useCallback(
    (e) => {
      e.preventDefault();

      const taskText = newTask.trim();

      if (!taskText) {
        newTaskInputRef.current?.focus();
        return;
      }

      const createdTask = {
        id: -Date.now(),
        todo: taskText,
        completed: false,
        userId: 1,
        isLocal: true,
      };

      setTasks((previousTasks) => [createdTask, ...previousTasks]);

      setTaskMeta((previous) => ({
        ...previous,
        [createdTask.id]: {
          priority: newPriority,
          category: newCategory,
          dueDate: newDueDate,
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
      }));

      setNewTask("");
      setNewPriority("medium");
      setNewCategory("Personal");
      setNewDueDate("");
      setFilter("all");
      setSearch("");
      setError("");
    },
    [newTask, newPriority, newCategory, newDueDate],
  );

  // Complete or uncomplete a task
  const toggleTask = useCallback(async (task) => {
    const completed = !task.completed;
    const completedAt = completed ? new Date().toISOString() : null;

    if (task.isLocal) {
      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item.id === task.id ? { ...item, completed } : item,
        ),
      );

      updateTaskMeta(task.id, { completedAt });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item.id === task.id ? { ...item, ...updatedTask } : item,
        ),
      );

      updateTaskMeta(task.id, { completedAt });
      setError("");
    } catch {
      setError("Unable to update task status.");
    }
  }, []);

  // Edit a task
  const updateTask = useCallback(
    async (id) => {
      const updatedText = editText.trim();

      if (!updatedText) return;

      const currentTask = tasks.find((task) => task.id === id);

      if (currentTask?.isLocal) {
        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task.id === id ? { ...task, todo: updatedText } : task,
          ),
        );

        setEditingId(null);
        setEditText("");
        setError("");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            todo: updatedText,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to edit task");
        }

        const updatedTask = await response.json();

        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task,
          ),
        );

        setEditingId(null);
        setEditText("");
        setError("");
      } catch {
        setError("Unable to edit task. Please try again.");
      }
    },
    [editText, tasks],
  );

  // Delete a task
  const deleteTask = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this task?")) {
        return;
      }

      const currentTask = tasks.find((task) => task.id === id);

      if (currentTask?.isLocal) {
        setTasks((previousTasks) =>
          previousTasks.filter((task) => task.id !== id),
        );

        setTaskMeta((previous) => {
          const next = { ...previous };
          delete next[id];
          return next;
        });

        setError("");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete task");
        }

        await response.json();

        setTasks((previousTasks) =>
          previousTasks.filter((task) => task.id !== id),
        );

        setTaskMeta((previous) => {
          const next = { ...previous };
          delete next[id];
          return next;
        });

        setError("");
      } catch {
        setError("Unable to delete task. Please try again.");
      }
    },
    [tasks],
  );

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.todo);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  // Task statistics
  const completedCount = tasks.filter((task) => task.completed).length;

  const pendingCount = tasks.length - completedCount;

  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  // Weekly activity
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();

  const weeklyActivity = weekDays.map((day, index) => {
    const date = new Date(today);

    date.setDate(today.getDate() - ((today.getDay() - index + 7) % 7));

    const key = date.toDateString();

    const count = Object.values(taskMeta).filter(
      (meta) =>
        meta.completedAt && new Date(meta.completedAt).toDateString() === key,
    ).length;

    return {
      day,
      count,
    };
  });

  const maxWeeklyActivity = Math.max(
    1,
    ...weeklyActivity.map((item) => item.count),
  );

  // Search and filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.todo
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="tasks-page">
      <div className="tasks-page__container">
        {/* Header */}
        <header className="tasks-page__header">
          <div className="tasks-page__brand">
            <span className="tasks-page__brand-mark">T</span>
            <span>Task Space</span>
          </div>

          <div className="tasks-page__welcome">
            <span className="tasks-page__eyebrow">YOUR DAILY WORKSPACE</span>

            <h1>
              One step at a time, <span>achieve more.</span>
            </h1>

            <p>
              Organize your priorities and track your progress in one place.
            </p>
          </div>

          <div className="tasks-page__date">
            <span className="tasks-page__date-dot" />
            <span>Task Dashboard</span>
          </div>
        </header>

        {/* Overview */}
        <section className="tasks-page__overview" aria-label="Tasks overview">
          <div className="tasks-page__overview-main">
            <div className="tasks-page__overview-copy">
              <span className="tasks-page__eyebrow">OVERVIEW</span>

              <h2>Your Progress So Far</h2>

              <p>
                Keep going. Every completed task brings you closer to your goal.
              </p>
            </div>

            <div
              className="tasks-page__progress"
              style={{
                "--progress": `${progress}%`,
              }}
            >
              <div className="tasks-page__progress-inner">
                <strong>{progress}%</strong>
                <span>Completed</span>
              </div>
            </div>
          </div>

          <div className="tasks-page__metrics">
            <div className="tasks-page__metric">
              <span className="tasks-page__metric-icon">▤</span>

              <div>
                <span>Total Tasks</span>
                <strong>{tasks.length}</strong>
              </div>
            </div>

            <div className="tasks-page__metric">
              <span className="tasks-page__metric-icon is-done">✓</span>

              <div>
                <span>Completed</span>
                <strong>{completedCount}</strong>
              </div>
            </div>

            <div className="tasks-page__metric">
              <span className="tasks-page__metric-icon is-pending">◷</span>

              <div>
                <span>In Progress</span>
                <strong>{pendingCount}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Activity */}
        <section className="tasks-page__activity" aria-label="Weekly activity">
          <div className="tasks-page__activity-heading">
            <div>
              <span className="tasks-page__eyebrow">YOUR MOMENTUM</span>

              <h2>Weekly Activity</h2>
            </div>

            <p>Tasks you completed each day</p>
          </div>

          <div className="tasks-page__activity-chart">
            {weeklyActivity.map((item) => (
              <div className="tasks-page__activity-day" key={item.day}>
                <span className="tasks-page__activity-value">{item.count}</span>

                <div className="tasks-page__activity-track">
                  <span
                    style={{
                      height: `${(item.count / maxWeeklyActivity) * 100}%`,
                    }}
                  />
                </div>

                <span className="tasks-page__activity-label">{item.day}</span>
              </div>
            ))}
          </div>

          <p className="tasks-page__activity-note">
            Activity is tracked on this device from the moment you complete a
            task.
          </p>
        </section>

        {/* Tasks Workspace */}
        <section className="tasks-page__workspace">
          <div className="tasks-page__workspace-heading">
            <div>
              <span className="tasks-page__eyebrow">WORK LIST</span>

              <h2>My Tasks</h2>
            </div>

            <span className="tasks-page__task-count">
              {filteredTasks.length} tasks displayed
            </span>

            <button
              type="button"
              className="tasks-page__create-button"
              onClick={createNewTask}
            >
              + Create New Task
            </button>
          </div>

          {/* Add Task Form */}
          <form className="tasks-page__add-panel" onSubmit={addTask}>
            <div className="tasks-page__add-symbol">＋</div>

            <label className="tasks-page__add-field">
              <span>Add a New Task</span>

              <input
                ref={newTaskInputRef}
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What do you want to accomplish?"
                aria-label="New task"
              />
            </label>

            <div className="tasks-page__add-options">
              <label>
                <span>Priority</span>

                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </label>

              <label>
                <span>Category</span>

                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option>Personal</option>
                  <option>Study</option>
                  <option>Work</option>
                </select>
              </label>

              <label>
                <span>Due date</span>

                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </label>
            </div>

            <button type="submit">
              Add Task <span>←</span>
            </button>
          </form>

          {/* Search and Filters */}
          <div className="tasks-page__controls">
            <label className="tasks-page__search">
              <span>⌕</span>

              <input
                type="search"
                placeholder="Search your tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tasks"
              />
            </label>

            <div className="tasks-page__filters" aria-label="Filter tasks">
              <button
                type="button"
                className={filter === "all" ? "active" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>

              <button
                type="button"
                className={filter === "pending" ? "active" : ""}
                onClick={() => setFilter("pending")}
              >
                In Progress
              </button>

              <button
                type="button"
                className={filter === "completed" ? "active" : ""}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="tasks-page__error" role="alert">
              <span>{error}</span>

              <button type="button" onClick={fetchTasks}>
                Try Again
              </button>
            </div>
          )}

          {/* Tasks List */}
          {loading ? (
            <div className="tasks-page__message">
              <div className="tasks-page__loader" />
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="tasks-page__empty">
              <span className="tasks-page__empty-icon">✦</span>

              <h3>No Tasks Here</h3>

              <p>Add a new task or try changing your search and filters.</p>
            </div>
          ) : (
            <div className="tasks-page__list">
              {filteredTasks.map((task, index) => (
                <article
                  className={`tasks-page__task ${
                    task.completed ? "is-completed" : ""
                  }`}
                  key={task.id}
                >
                  <span className="tasks-page__task-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Complete Button */}
                  <button
                    type="button"
                    className={`tasks-page__check ${
                      task.completed ? "checked" : ""
                    }`}
                    onClick={() => toggleTask(task)}
                    aria-label={
                      task.completed
                        ? "Mark task as in progress"
                        : "Mark task as completed"
                    }
                    title={task.completed ? "Undo completion" : "Complete task"}
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="tasks-page__task-info">
                    {editingId === task.id ? (
                      <form
                        className="tasks-page__edit-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateTask(task.id);
                        }}
                      >
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                          aria-label="Edit task text"
                        />

                        <button type="submit" disabled={!editText.trim()}>
                          Save
                        </button>

                        <button
                          type="button"
                          className="cancel"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <h3>{task.todo}</h3>

                        <div className="tasks-page__task-details">
                          <span
                            className={`tasks-page__status ${
                              task.completed ? "completed" : "pending"
                            }`}
                          >
                            <i />
                            {task.completed ? "Completed" : "In Progress"}
                          </span>

                          <span
                            className={`tasks-page__priority priority-${
                              taskMeta[task.id]?.priority || "medium"
                            }`}
                          >
                            {taskMeta[task.id]?.priority || "Medium"} priority
                          </span>

                          <span className="tasks-page__category">
                            {taskMeta[task.id]?.category || "Personal"}
                          </span>

                          {taskMeta[task.id]?.dueDate && (
                            <span className="tasks-page__due-date">
                              Due{" "}
                              {new Date(
                                `${taskMeta[task.id].dueDate}T00:00:00`,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Task Metadata Controls */}
                        <div className="tasks-page__task-meta-controls">
                          <label>
                            <span>Priority</span>

                            <select
                              value={taskMeta[task.id]?.priority || "medium"}
                              onChange={(e) =>
                                updateTaskMeta(task.id, {
                                  priority: e.target.value,
                                })
                              }
                              aria-label={`Priority for ${task.todo}`}
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </label>

                          <label>
                            <span>Category</span>

                            <select
                              value={taskMeta[task.id]?.category || "Personal"}
                              onChange={(e) =>
                                updateTaskMeta(task.id, {
                                  category: e.target.value,
                                })
                              }
                              aria-label={`Category for ${task.todo}`}
                            >
                              <option>Personal</option>
                              <option>Study</option>
                              <option>Work</option>
                            </select>
                          </label>

                          <label>
                            <span>Due date</span>

                            <input
                              type="date"
                              value={taskMeta[task.id]?.dueDate || ""}
                              onChange={(e) =>
                                updateTaskMeta(task.id, {
                                  dueDate: e.target.value,
                                })
                              }
                              aria-label={`Due date for ${task.todo}`}
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Edit and Delete Buttons */}
                  {editingId !== task.id && (
                    <div className="tasks-page__actions">
                      <button
                        type="button"
                        onClick={() => startEditing(task)}
                        aria-label="Edit task"
                        title="Edit"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete"
                        onClick={() => deleteTask(task.id)}
                        aria-label="Delete task"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Tasks;
