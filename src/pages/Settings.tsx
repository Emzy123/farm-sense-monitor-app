
import React, { useState } from 'react';
import { User, LogOut, Bell, Thermometer } from 'lucide-react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SensorConfig from '@/components/SensorConfig';
import ToastNotification from '@/components/ToastNotification';
import { useAuth } from '@/hooks/useAuth';
import { useFarmData } from '@/hooks/useFarmData';

const Settings = () => {
  const { user, logout } = useAuth();
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

  // Alert thresholds state
  const [thresholds, setThresholds] = useState({
    tempMin: Number(localStorage.getItem('tempMin') || '15'),
    tempMax: Number(localStorage.getItem('tempMax') || '35'),
    humidityMin: Number(localStorage.getItem('humidityMin') || '40'),
    humidityMax: Number(localStorage.getItem('humidityMax') || '80'),
    soilMoistureMin: Number(localStorage.getItem('soilMoistureMin') || '20'),
    soilMoistureMax: Number(localStorage.getItem('soilMoistureMax') || '80'),
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
  };

  const handleSaveThresholds = () => {
    Object.entries(thresholds).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
    showToast('Threshold settings saved successfully', 'success');
  };

  const handleThresholdChange = (key: string, value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setThresholds(prev => ({ ...prev, [key]: numValue }));
    }
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
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Profile</h2>
              <p className="text-gray-600">Manage your account settings</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Name</span>
              <span className="font-medium text-gray-800">{user?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-800">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Farm</span>
              <span className="font-medium text-gray-800">{user?.farmName}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-6 bg-red-500 text-white rounded-lg px-4 py-3 font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>

        {/* Sensor Configuration */}
        <SensorConfig
          sensorConfig={sensorConfig}
          sensorConnected={sensorConnected}
          lastSensorError={lastSensorError}
          onUpdateConfig={handleSensorConfigUpdate}
        />

        {/* Alert Thresholds */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Bell className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Alert Thresholds</h2>
              <p className="text-gray-600">Set warning limits for your sensors</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Temperature Thresholds */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Thermometer className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-gray-800">Temperature (°C)</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
                  <input
                    type="number"
                    value={thresholds.tempMin}
                    onChange={(e) => handleThresholdChange('tempMin', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                  <input
                    type="number"
                    value={thresholds.tempMax}
                    onChange={(e) => handleThresholdChange('tempMax', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Humidity Thresholds */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-800">Humidity (%)</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
                  <input
                    type="number"
                    value={thresholds.humidityMin}
                    onChange={(e) => handleThresholdChange('humidityMin', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                  <input
                    type="number"
                    value={thresholds.humidityMax}
                    onChange={(e) => handleThresholdChange('humidityMax', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Soil Moisture Thresholds */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-amber-600 rounded-full"></div>
                <h3 className="font-semibold text-gray-800">Soil Moisture (%)</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
                  <input
                    type="number"
                    value={thresholds.soilMoistureMin}
                    onChange={(e) => handleThresholdChange('soilMoistureMin', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                  <input
                    type="number"
                    value={thresholds.soilMoistureMax}
                    onChange={(e) => handleThresholdChange('soilMoistureMax', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveThresholds}
            className="w-full mt-6 bg-green-500 text-white rounded-lg px-4 py-3 font-medium hover:bg-green-600 transition-colors"
          >
            Save Threshold Settings
          </button>
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

export default Settings;
