
import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SensorConfig from '@/components/SensorConfig';
import ThresholdConfig from '@/components/ThresholdConfig';
import UserProfile from '@/components/UserProfile';
import ToastNotification from '@/components/ToastNotification';
import { useAuth } from '@/hooks/useAuth';
import { useFarmData } from '@/hooks/useFarmData';

const Settings = () => {
  const { logout } = useAuth();
  const { 
    sensorConnected, 
    lastSensorError, 
    sensorConfig, 
    updateSensorConfig,
    isOnline,
    isRefreshing,
    refreshData
  } = useFarmData();

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

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
  };

  const handleSensorConfigUpdate = (ip: string, port: string, useMock: boolean) => {
    updateSensorConfig(ip, port, useMock);
    showToast(
      useMock 
        ? 'Switched to mock data mode' 
        : `Sensor configuration updated: ${ip}:${port}`, 
      'success'
    );
  };

  const handleRefresh = async () => {
    await refreshData();
    showToast('Settings refreshed!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Header 
        isOnline={isOnline} 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing}
      />

      <main className="p-4 space-y-6">
        {/* User Profile Section */}
        <UserProfile onLogout={handleLogout} />

        {/* Sensor Configuration */}
        <SensorConfig
          sensorConfig={sensorConfig}
          sensorConnected={sensorConnected}
          lastSensorError={lastSensorError}
          onUpdateConfig={handleSensorConfigUpdate}
        />

        {/* Alert Thresholds */}
        <ThresholdConfig onSave={showToast} />
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

export default Settings;
