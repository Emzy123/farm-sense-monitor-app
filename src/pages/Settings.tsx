
import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SensorConfig from '@/components/SensorConfig';
import ThresholdConfig from '@/components/ThresholdConfig';
import UserProfile from '@/components/UserProfile';
import NotificationSettingsComponent from '@/components/NotificationSettings';

import MultiSensorConfig from '@/components/MultiSensorConfig';
import ToastNotification from '@/components/ToastNotification';
import { useAuth } from '@/hooks/useAuth';
import { useFarmData } from '@/hooks/useFarmData';
import { Bell } from 'lucide-react';

const Settings = () => {
  console.log('Settings page loading...');
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

  const handleThresholdSave = (message: string) => {
    showToast(message, 'success');
  };

  const handleNotificationSave = () => {
    showToast('Notification settings saved successfully', 'success');
  };

  const handleSensorUpdate = () => {
    showToast('Multi-sensor configuration updated', 'success');
  };

  const [deviceNotificationsEnabled, setDeviceNotificationsEnabled] = useState(() => {
    return localStorage.getItem('deviceNotificationsEnabled') === 'true';
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setDeviceNotificationsEnabled(true);
        localStorage.setItem('deviceNotificationsEnabled', 'true');
        showToast('Device notifications enabled!', 'success');
      } else {
        setDeviceNotificationsEnabled(false);
        localStorage.setItem('deviceNotificationsEnabled', 'false');
        showToast('Device notifications not enabled', 'info');
      }
    }
  };

  const handleToggleDeviceNotifications = (enabled: boolean) => {
    setDeviceNotificationsEnabled(enabled);
    localStorage.setItem('deviceNotificationsEnabled', enabled ? 'true' : 'false');
    showToast(
      enabled ? 'Device notifications enabled!' : 'Device notifications disabled.',
      enabled ? 'success' : 'info'
    );
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

        {/* Multi-Sensor Configuration */}
        <MultiSensorConfig onSensorUpdate={handleSensorUpdate} />

        {/* Sensor Configuration */}
        <SensorConfig
          sensorConfig={sensorConfig}
          sensorConnected={sensorConnected}
          lastSensorError={lastSensorError}
          onUpdateConfig={handleSensorConfigUpdate}
        />

        {/* Alert Thresholds */}
        <ThresholdConfig onSave={handleThresholdSave} />

        {/* Device Notification Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Device Notifications</h2>
          </div>
          <div className="mb-4">
            <span className="font-medium">Permission Status: </span>
            <span className={
              notificationPermission === 'granted' ? 'text-green-600' :
              notificationPermission === 'denied' ? 'text-red-600' : 'text-yellow-600'
            }>
              {notificationPermission.charAt(0).toUpperCase() + notificationPermission.slice(1)}
            </span>
          </div>
          {notificationPermission !== 'granted' ? (
            <button
              onClick={handleRequestPermission}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Enable Device Notifications
            </button>
          ) : (
            <label className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                checked={deviceNotificationsEnabled}
                onChange={e => handleToggleDeviceNotifications(e.target.checked)}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-700">Receive device notifications for critical readings</span>
            </label>
          )}
        </div>

        {/* Notification Settings */}
        <NotificationSettingsComponent onSave={handleNotificationSave} />

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
