
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

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
  const chartRef = React.useRef<HTMLDivElement>(null);

  const handleExportCSV = () => {
    const csvContent = [
      'Time,Temperature,Humidity,Soil Moisture',
      ...data.map(row => `${row.time},${row.temperature},${row.humidity},${row.soilMoisture}`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-history-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    if (chartRef.current) {
      // Use html2canvas or similar if you want a real chart snapshot. For now, just create a blank PNG as placeholder.
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 800, 400);
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText('Farm History Chart', 20, 30);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `farm-history-${timeRange}-${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Trends Over Time</h2>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as '24h' | '7d')}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <div className="relative group">
            <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={handleExportPNG}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                Export as PNG
              </button>
              <button
                onClick={handleExportCSV}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={chartRef} className="h-80">
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
              name="Temperature (\u00b0C)"
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
