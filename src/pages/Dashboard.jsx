import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard/StatCard';
import TasksChart from '../components/TasksChart/TasksChart';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      fetch('https://dummyjson.com/todos').then((res) => res.json()),
      fetch('https://dummyjson.com/users?limit=4').then((res) => res.json()),
    ])
      .then(([todosData, usersData]) => {
        setTasks(todosData.todos);
        setTeam(usersData.users);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, []);

  // تبديل حالة المهمة مباشرة من الداشبورد
  const toggleTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // حساب الإحصائيات ونسبة الإنجاز
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  }, [tasks]);

  const chartData = useMemo(
    () => [
      { name: 'Completed', value: stats.completed },
      { name: 'Pending', value: stats.pending },
    ],
    [stats.completed, stats.pending]
  );
    const filteredTasks = useMemo(() => {
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    if (filter === 'pending') return tasks.filter((t) => !t.completed);
    return tasks;
    }, [tasks, filter]);

    if (loading) {
    return <div className="loading-state">Loading dashboard...</div>;
    }
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      {/* القسم الأول: بطاقات الإحصائيات */}
      <div className="stats-flex">
        <StatCard title="Total Tasks" value={stats.total} color="blue" />
        <StatCard title="Completed" value={stats.completed} color="green" />
        <StatCard title="Pending" value={stats.pending} color="orange" />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          color="purple"
        />
      </div>

      {/* القسم الثاني: شريط نسبة الإنجاز */}
      <div className="progress-section">
        <div className="progress-header">
          <span>Overall Completion Progress</span>
          <span>{stats.completionRate}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* القسم الثالث: الرسم البياني + آخر المهام جنب بعض */}
      <div className="middle-section">
        <div className="chart-box">
          <TasksChart data={chartData} />
        </div>

        <div className="recent-tasks-card">
          <div className="section-header">
            <h3>Recent Tasks</h3>
            <Link to="/tasks" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="filter-buttons">
          <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
         onClick={() => setFilter('all')}
         >
          All
        </button>
        <button
        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
        onClick={() => setFilter('pending')}
        >
        Pending
        </button>
        <button
        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        onClick={() => setFilter('completed')}
        >
        Completed
        </button>
        </div>
          <ul className="recent-tasks-list">
            {filteredTasks.slice(0, 5).map((task) => (
              <li
                key={task.id}
                className="recent-task-item"
                onClick={() => toggleTaskStatus(task.id)}
                title="Click to toggle task status"
              >
                <span
                  className={`task-text ${task.completed ? 'completed-text' : ''}`}
                >
                  {task.todo}
                </span>
                <span
                  className={`status-badge ${task.completed ? 'done' : 'pending'}`}
                >
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* القسم الرابع: فريق العمل */}
      <div className="section-header team-header">
        <h3 className="section-subtitle">Our Team</h3>
        <Link to="/team" className="view-all-link">
          View All Team →
        </Link>
      </div>

      <div className="team-flex">
        {team.map((member) => (
          <div key={member.id} className="team-card">
            <div className="team-avatar-initials">
              {member.firstName[0]}
              {member.lastName[0]}
            </div>
            <h4>
              {member.firstName} {member.lastName}
            </h4>
            <p className="team-role">{member.company.title}</p>
            <span className="team-dept">{member.company.department}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;