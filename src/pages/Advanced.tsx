
import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import WeatherIntegration from '@/components/WeatherIntegration';
import MLPredictions from '@/components/MLPredictions';
import IrrigationControl from '@/components/IrrigationControl';
import MobilePushNotifications from '@/components/MobilePushNotifications';
import ToastNotification from '@/components/ToastNotification';
import { useFarmData } from '@/hooks/useFarmData';

const Advanced = () => {
  const { currentData, isOnline, isRefreshing, refreshData, getChartData } = useFarmData();
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
    showToast('Advanced features refreshed!', 'success');
  };

  const handleWeatherUpdate = (weather: any) => {
    showToast('Weather data updated', 'info');
  };

  const handleIrrigationStart = (zoneId: string, duration: number) => {
    showToast(`Irrigation started for ${zoneId} (${duration} minutes)`, 'success');
  };

  const handleIrrigationStop = (zoneId: string) => {
    showToast(`Irrigation stopped for ${zoneId}`, 'info');
  };

  const handleNotificationSent = (message: string) => {
    showToast(message, 'success');
  };

  const historicalData = getChartData('7d').map(item => ({
    temperature: item.temperature,
    humidity: item.humidity,
    soilMoisture: item.soilMoisture,
    timestamp: item.time
  }));

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header 
        isOnline={isOnline} 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing}
      />

      <main className="p-4 space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Advanced Features</h2>
          <p className="text-purple-100">AI-powered insights, weather integration, and smart automation.</p>
        </div>

        {/* Weather Integration */}
        <WeatherIntegration 
          location="Your Farm Location"
          onWeatherUpdate={handleWeatherUpdate}
        />

        {/* ML Predictions */}
        <MLPredictions 
          currentData={currentData}
          historicalData={historicalData}
        />

        {/* Irrigation Control */}
        <IrrigationControl 
          currentSoilMoisture={currentData.soilMoisture}
          onIrrigationStart={handleIrrigationStart}
          onIrrigationStop={handleIrrigationStop}
        />

        {/* Mobile Push Notifications */}
        <MobilePushNotifications 
          onNotificationSent={handleNotificationSent}
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
