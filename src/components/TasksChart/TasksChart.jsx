import React from 'react'
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer}from 'recharts';
import './TasksChart.css';
const COLORS = ['#2ecc71', '#f39c12'];
const TasksChart = React.memo (({ data }) => {
  return (
   <div className="chart-card">
      <h3 className="chart-title">Tasks Distribution</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})

export default TasksChart