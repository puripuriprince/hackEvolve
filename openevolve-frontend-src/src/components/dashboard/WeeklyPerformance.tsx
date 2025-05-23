import React, { useState, useEffect, useCallback, memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Memoized chart component for performance optimization
const WeeklyPerformanceChart = memo(({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorExperiments" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorApiCalls" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12 }}
          aria-label="Days of the week"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          aria-label="Number of experiments and API calls"
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: 'none'
          }}
        />
        <Area
          type="monotone"
          dataKey="experiments"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorExperiments)"
          name="Experiments"
          activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
        />
        <Area
          type="monotone"
          dataKey="apiCalls"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorApiCalls)"
          name="API Calls"
          activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});

// Weekly performance data
const initialData = [
  { day: 'Mon', experiments: 12, apiCalls: 240 },
  { day: 'Tue', experiments: 18, apiCalls: 320 },
  { day: 'Wed', experiments: 15, apiCalls: 280 },
  { day: 'Thu', experiments: 22, apiCalls: 390 },
  { day: 'Fri', experiments: 25, apiCalls: 410 },
  { day: 'Sat', experiments: 8, apiCalls: 150 },
  { day: 'Sun', experiments: 10, apiCalls: 180 },
];

interface WeeklyPerformanceProps {
  initialData?: any[];
  height?: number | string;
  refreshInterval?: number;
}

export const WeeklyPerformance: React.FC<WeeklyPerformanceProps> = ({ 
  initialData: propData = initialData,
  height = 300,
  refreshInterval = 30000 // 30 seconds by default
}) => {
  const [data, setData] = useState(propData);
  
  // Simulate data updates
  const updateData = useCallback(() => {
    setData(prevData => 
      prevData.map(item => ({
        ...item,
        experiments: Math.max(1, item.experiments + Math.floor(Math.random() * 5) - 2),
        apiCalls: Math.max(10, item.apiCalls + Math.floor(Math.random() * 30) - 15)
      }))
    );
  }, []);
  
  // Set up interval for data refresh
  useEffect(() => {
    const interval = setInterval(updateData, refreshInterval);
    return () => clearInterval(interval);
  }, [updateData, refreshInterval]);
  
  return (
    <div style={{ height }} aria-label="Weekly performance chart showing experiments and API calls">
      <WeeklyPerformanceChart data={data} />
    </div>
  );
};

export default WeeklyPerformance;
