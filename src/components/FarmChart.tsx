
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
}

interface FarmChartProps {
  data: ChartData[];
  timeRange: '24h' | '7d';
  onTimeRangeChange: (range: '24h' | '7d') => void;
}

const FarmChart: React.FC<FarmChartProps> = ({ data, timeRange, onTimeRangeChange }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Trends Over Time</h2>
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value as '24h' | '7d')}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              className="text-sm text-gray-600"
              tick={{ fontSize: 12 }}
            />
            <YAxis className="text-sm text-gray-600" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Temperature (°C)"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#3B82F6" 
              strokeWidth={3}
              name="Humidity (%)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="soilMoisture" 
              stroke="#8B4513" 
              strokeWidth={3}
              name="Soil Moisture (%)"
              dot={{ fill: '#8B4513', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FarmChart;
