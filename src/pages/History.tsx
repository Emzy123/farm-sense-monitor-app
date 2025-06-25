
import React, { useState } from 'react';
import { Calendar, Table, BarChart3 } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import FarmChart from '@/components/FarmChart';
import { useFarmData } from '@/hooks/useFarmData';

const History: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('chart');
  const [timeRange, setTimeRange] = useState<'24h' | '7d'>('24h');
  const { getChartData } = useFarmData();

  const chartData = getChartData(timeRange);

  const handleTimeRangeChange = (range: '24h' | '7d') => {
    setTimeRange(range);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-blue-500 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">History</h1>
      </header>

      <main className="p-4 space-y-4">
        {/* Controls */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <select
                value={timeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value as '24h' | '7d')}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Chart
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Table className="w-4 h-4" />
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'chart' ? (
          <FarmChart 
            data={chartData} 
            timeRange={timeRange} 
            onTimeRangeChange={handleTimeRangeChange}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Historical Data</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Temperature</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Humidity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Soil Moisture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {chartData.slice(0, 10).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{row.time}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.temperature.toFixed(1)}°C</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.humidity.toFixed(0)}%</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.soilMoisture.toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-600">Showing 10 of {chartData.length} records</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default History;
