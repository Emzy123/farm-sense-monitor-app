
import React, { useState } from 'react';
import { Thermometer, Droplets, Gauge } from 'lucide-react';
import Header from '@/components/Header';
import DataCard from '@/components/DataCard';
import AdvancedChart from '@/components/AdvancedChart';
import QuickActions from '@/components/QuickActions';
import BottomNavigation from '@/components/BottomNavigation';
import ToastNotification from '@/components/ToastNotification';
import { useFarmData } from '@/hooks/useFarmData';
import { getDataStatus } from '@/utils/dataProcessing';

const Index = () => {
  const { currentData, isOnline, isRefreshing, refreshData, getChartData } = useFarmData();
  const [chartTimeRange, setChartTimeRange] = useState<'24h' | '7d'>('24h');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleRefresh = async () => {
    await refreshData();
    showToast('Data updated successfully!', 'success');
  };

  const handleChartTimeRangeChange = (range: '24h' | '7d') => {
    setChartTimeRange(range);
  };

  const handleExport = (format: 'png' | 'csv' | 'json') => {
    showToast(`Data exported as ${format.toUpperCase()}`, 'success');
  };

  const chartData = getChartData(chartTimeRange);

  React.useEffect(() => {
    if (!isOnline) {
      showToast('Offline: Showing cached data', 'info');
    }

    // Device notification for critical readings
    if (document.visibilityState === 'visible' && 'Notification' in window && Notification.permission === 'granted') {
      const criticals = [
        { type: 'temperature' as 'temperature', value: currentData.temperature },
        { type: 'humidity' as 'humidity', value: currentData.humidity },
        { type: 'soilMoisture' as 'soilMoisture', value: currentData.soilMoisture },
      ].filter(({ type, value }) => getDataStatus(type, value) === 'critical');

      criticals.forEach(({ type, value }) => {
        const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
        const body = `${typeLabel} critical: ${value}`;
        new Notification('Critical Farm Alert', {
          body,
          icon: '/favicon.png',
          tag: `critical-${type}`
        });
      });
    }
  }, [isOnline, currentData]);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header 
        isOnline={isOnline} 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing}
      />

      <main className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome to Your Smart Farm</h2>
          <p className="text-green-100">Monitor your crops in real-time with advanced analytics and make informed decisions.</p>
        </div>

        {/* Real-time Data Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Current Conditions</h2>
          <div className="grid gap-4">
            <DataCard
              title="Temperature"
              value={currentData.temperature.toString()}
              unit="°C"
              status={getDataStatus('temperature', currentData.temperature)}
              icon={Thermometer}
              lastUpdated={`Updated ${currentData.timestamp}`}
            />
            
            <DataCard
              title="Humidity"
              value={currentData.humidity.toString()}
              unit="%"
              status={getDataStatus('humidity', currentData.humidity)}
              icon={Droplets}
              lastUpdated={`Updated ${currentData.timestamp}`}
            />
            
            <DataCard
              title="Soil Moisture"
              value={currentData.soilMoisture.toString()}
              unit="%"
              status={getDataStatus('soilMoisture', currentData.soilMoisture)}
              icon={Gauge}
              lastUpdated={`Updated ${currentData.timestamp}`}
            />
          </div>
        </div>

        {/* Advanced Chart Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Advanced Data Analysis</h2>
          <AdvancedChart 
            data={chartData}
            timeRange={chartTimeRange}
            onTimeRangeChange={handleChartTimeRangeChange}
            onExport={handleExport}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Farm Status Summary */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Farm Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Sensors Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-gray-600">Active Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
      
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default Index;
