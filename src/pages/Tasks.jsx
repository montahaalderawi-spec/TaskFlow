
import { useState, useEffect, useCallback } from "react";
import "./Tasks.css";

const API_URL = "https://dummyjson.com/todos";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}?limit=30`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data.todos || []);
    } catch {
      setError("تعذّر تحميل المهام. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (e) => {
    e.preventDefault();
    const taskText = newTask.trim();
    if (!taskText) return;

    try {
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo: taskText,
          completed: false,
          userId: 1
        }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      const createdTask = await response.json();
      setTasks((previousTasks) => [createdTask, ...previousTasks]);
      setNewTask("");
      setFilter("all");
      setError("");
    } catch {
      setError("تعذّرت إضافة المهمة. حاول مرة أخرى.");
    }
  }, [newTask]);

  const toggleTask = useCallback(async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !task.completed
        }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTask = await response.json();

      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item.id === task.id ? { ...item, ...updatedTask } : item
        )
      );

      setError("");
    } catch {
      setError("تعذّر تغيير حالة المهمة.");
    }
  }, []);

  const updateTask = useCallback(async (id) => {
    const updatedText = editText.trim();
    if (!updatedText) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: updatedText }),
      });

      if (!response.ok) throw new Error("Failed to edit task");

      const updatedTask = await response.json();

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === id ? { ...task, ...updatedTask } : task
        )
      );

      setEditingId(null);
      setEditText("");
      setError("");
    } catch {
      setError("تعذّر تعديل المهمة. حاول مرة أخرى.");
    }
  }, [editText]);

  const deleteTask = useCallback(async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه المهمة؟")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete task");

      await response.json();

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id)
      );

      setError("");
    } catch {
      setError("تعذّر حذف المهمة. حاول مرة أخرى.");
    }
  }, []);

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.todo);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingCount = tasks.length - completedCount;

  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

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
    <main className="tasks-page" dir="rtl">
      <div className="tasks-page__container">

        <header className="tasks-page__header">
          <div className="tasks-page__brand">
            <span className="tasks-page__brand-mark">T</span>
            <span>مساحة المهام</span>
          </div>

          <div className="tasks-page__welcome">
            <span className="tasks-page__eyebrow">
              مساحة تنظيمك اليومية
            </span>

            <h1>
              خطوة بخطوة، <span>تنجز أكثر.</span>
            </h1>

            <p>
              رتّب أولوياتك وتابع إنجازك في مكان واحد.
            </p>
          </div>

          <div className="tasks-page__date">
            <span className="tasks-page__date-dot" />
            <span>لوحة المهام</span>
          </div>
        </header>

        <section
          className="tasks-page__overview"
          aria-label="ملخص المهام"
        >
          <div className="tasks-page__overview-main">
            <div className="tasks-page__overview-copy">
              <span className="tasks-page__eyebrow">
                نظرة عامة
              </span>

              <h2>إنجازك حتى الآن</h2>

              <p>
                استمر، كل مهمة مكتملة تقرّبك من هدفك.
              </p>
            </div>

            <div
              className="tasks-page__progress"
              style={{ "--progress": `${progress}%` }}
            >
              <div className="tasks-page__progress-inner">
                <strong>{progress}%</strong>
                <span>مكتمل</span>
              </div>
            </div>
          </div>

          <div className="tasks-page__metrics">
            <div className="tasks-page__metric">
              <span className="tasks-page__metric-icon">▤</span>
              <div>
                <span>كل المهام</span>
                <strong>{tasks.length}</strong>
              </div>
            </div>

            <div className="tasks-page__metric">
              <span className="tasks-page__metric-icon is-done">
                ✓
              </span>
              <div>
                <span>مكتملة</span>
                <strong>{completedCount}</strong>
              </div>
            </div>

            <div className="tasks-page__metric">
              <span className="tasks-page__metric-icon is-pending">
                ◷
              </span>
              <div>
                <span>قيد الإنجاز</span>
                <strong>{pendingCount}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="tasks-page__workspace">
          <div className="tasks-page__workspace-heading">
            <div>
              <span className="tasks-page__eyebrow">
                قائمة العمل
              </span>
              <h2>مهامي</h2>
            </div>

            <span className="tasks-page__task-count">
              {filteredTasks.length} مهمة معروضة
            </span>
          </div>

          <form
            className="tasks-page__add-panel"
            onSubmit={addTask}
          >
            <div className="tasks-page__add-symbol">＋</div>

            <label className="tasks-page__add-field">
              <span>أضف مهمة جديدة</span>

              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="ما الذي تريد إنجازه؟"
                aria-label="مهمة جديدة"
              />
            </label>

            <button
              type="submit"
              disabled={!newTask.trim()}
            >
              إضافة المهمة <span>←</span>
            </button>
          </form>

          <div className="tasks-page__controls">
            <label className="tasks-page__search">
              <span>⌕</span>

              <input
                type="search"
                placeholder="ابحث في مهامك..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="البحث في المهام"
              />
            </label>

            <div
              className="tasks-page__filters"
              aria-label="تصفية المهام"
            >
              <button
                type="button"
                className={filter === "all" ? "active" : ""}
                onClick={() => setFilter("all")}
              >
                الكل
              </button>

              <button
                type="button"
                className={filter === "pending" ? "active" : ""}
                onClick={() => setFilter("pending")}
              >
                قيد الإنجاز
              </button>

              <button
                type="button"
                className={filter === "completed" ? "active" : ""}
                onClick={() => setFilter("completed")}
              >
                مكتملة
              </button>
            </div>
          </div>

          {error && (
            <div className="tasks-page__error" role="alert">
              <span>{error}</span>

              <button
                type="button"
                onClick={fetchTasks}
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {loading ? (
            <div className="tasks-page__message">
              <div className="tasks-page__loader" />
              <p>جارٍ تحميل المهام...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="tasks-page__empty">
              <span className="tasks-page__empty-icon">✦</span>
              <h3>لا توجد مهام هنا</h3>
              <p>
                أضف مهمة جديدة أو جرّب تغيير كلمات البحث والتصفية.
              </p>
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

                  <button
                    type="button"
                    className={`tasks-page__check ${
                      task.completed ? "checked" : ""
                    }`}
                    onClick={() => toggleTask(task)}
                    aria-label={
                      task.completed
                        ? "إعادة المهمة إلى قيد الإنجاز"
                        : "وضع المهمة كمكتملة"
                    }
                    title={
                      task.completed
                        ? "إلغاء الإكمال"
                        : "إكمال المهمة"
                    }
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
                          onChange={(e) =>
                            setEditText(e.target.value)
                          }
                          autoFocus
                          aria-label="تعديل نص المهمة"
                        />

                        <button
                          type="submit"
                          disabled={!editText.trim()}
                        >
                          حفظ
                        </button>

                        <button
                          type="button"
                          className="cancel"
                          onClick={cancelEditing}
                        >
                          إلغاء
                        </button>
                      </form>
                    ) : (
                      <>
                        <h3>{task.todo}</h3>

                        <span
                          className={`tasks-page__status ${
                            task.completed
                              ? "completed"
                              : "pending"
                          }`}
                        >
                          <i />
                          {task.completed
                            ? "مكتملة"
                            : "قيد الإنجاز"}
                        </span>
                      </>
                    )}
                  </div>

                  {editingId !== task.id && (
                    <div className="tasks-page__actions">
                      <button
                        type="button"
                        onClick={() => startEditing(task)}
                        aria-label="تعديل المهمة"
                        title="تعديل"
                      >
                        تعديل
                      </button>

                      <button
                        type="button"
                        className="delete"
                        onClick={() => deleteTask(task.id)}
                        aria-label="حذف المهمة"
                        title="حذف"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="tasks-page__footer">
          <span>خطط بوضوح، وأنجز بثقة.</span>
          <span>TASK SPACE <i /> 2026</span>
        </footer>

      </div>
    </main>
  );
}
