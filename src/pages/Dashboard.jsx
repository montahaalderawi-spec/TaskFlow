import {useState, useEffect, useMemo} from 'react'
import StatCard from '../components/StatCard/StatCard';
import TasksChart from '../components/TasksChart/TasksChart';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   Promise.all([
    fetch('https://dummyjson.com/todos')
    .then((res) => res.json()),
    fetch('https://dummyjson.com/users?limit=4')
    .then((res) => res.json())
   ])
      .then(([todosData, usersData]) => {
        setTasks(todosData.todos);
        setTeam(usersData.users);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      });
  }, []);
  // حساب الاحصائيات ونسبة الانجاز وتخزين النتيجة
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;


    return { total, completed, pending, completionRate };
  }, [tasks]);
   const chartData = useMemo(() => [
    { name: 'Completed', value: stats.completed },
    { name: 'Pending', value: stats.pending },
  ], [stats.completed, stats.pending]);

  if (loading) {
    return <div className="loading-state">جاري تحميل لوحة التحكم... ⏳</div>;
  }
  return (
    <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard Overview</h2>
        
        {/* القسم الأول: بطاقات الإحصائيات */ }
      <div className="stats-grid">
        <StatCard title="Total Tasks" value={stats.total} color="blue" />
        <StatCard title="Completed" value={stats.completed} color="green" />
        <StatCard title="Pending" value={stats.pending} color="orange" />
        <StatCard title="Completion Rate" value={`${stats.completionRate}%`} color="purple" />
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

        {/* قسم الرسم البياني */}
      <TasksChart data={chartData} />

     {/* القسم الثالث: فريق العمل */}
      <h3 className="section-subtitle">Our Team</h3>
      <div className="team-grid">
        {team.map((member) => (
          <div key={member.id} className="team-card">
            <img src={member.image} alt={member.firstName} className="team-avatar" />
            <h4>{member.firstName} {member.lastName}</h4>
            <p className="team-role">{member.company.title}</p>
          </div>
        ))}
      </div>

    </div>
    
  )
}

export default Dashboard