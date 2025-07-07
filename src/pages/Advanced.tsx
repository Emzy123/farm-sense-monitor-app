import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import AdvancedChart from '@/components/AdvancedChart';
import MLPredictions from '@/components/MLPredictions';
import WeatherIntegration from '@/components/WeatherIntegration';
import IrrigationControl from '@/components/IrrigationControl';
import ToastNotification from '@/components/ToastNotification';
import { useFarmData } from '@/hooks/useFarmData';

const Advanced = () => {
  const { 
    currentData,
    chartData,
    isOnline,
    isRefreshing,
    refreshData,
    getChartData
  } = useFarmData();

  const [timeRange, setTimeRange] = useState<'24h' | '7d'>('24h');
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
    showToast('Advanced data refreshed!', 'success');
  };

  const handleTimeRangeChange = (range: '24h' | '7d') => {
    setTimeRange(range);
    showToast(`Time range changed to ${range}`, 'info');
  };

  const handleWeatherUpdate = (weather: any) => {
    showToast('Weather data updated', 'info');
  };

  const handleIrrigationStart = (zoneId: string, duration: number) => {
    showToast(`Irrigation started for zone ${zoneId} (${duration} minutes)`, 'success');
  };

  const handleIrrigationStop = (zoneId: string) => {
    showToast(`Irrigation stopped for zone ${zoneId}`, 'success');
  };

  const handleExport = (format: 'png' | 'csv' | 'json') => {
    showToast(`Data exported as ${format.toUpperCase()}`, 'success');
  };

  // Convert chart data to historical sensor data format for ML predictions
  const historicalData = chartData.map(data => ({
    temperature: data.temperature,
    humidity: data.humidity,
    soilMoisture: data.soilMoisture,
    timestamp: data.time
  }));

  // Get dynamic chart data based on time range
  const dynamicChartData = getChartData(timeRange);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header 
        isOnline={isOnline} 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing}
      />

      <main className="p-4 space-y-6">
        {/* Advanced Analytics Chart */}
        <AdvancedChart 
          data={dynamicChartData}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          onExport={handleExport}
        />

        {/* ML Predictions */}
        <MLPredictions 
          currentData={currentData}
          historicalData={historicalData}
        />

        {/* Weather Integration */}
        <WeatherIntegration 
          location="Farm Location"
          onWeatherUpdate={handleWeatherUpdate}
        />

        {/* Irrigation Control */}
        <IrrigationControl 
          currentSoilMoisture={currentData.soilMoisture}
          onIrrigationStart={handleIrrigationStart}
          onIrrigationStop={handleIrrigationStop}
        />
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

export default Advanced;