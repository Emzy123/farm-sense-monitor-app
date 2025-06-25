
import React, { useState } from 'react';
import { Save, User, Thermometer, Droplets, Gauge } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

interface Thresholds {
  temperature: { min: number; max: number };
  humidity: { min: number; max: number };
  soilMoisture: { min: number; max: number };
}

const Settings: React.FC = () => {
  const [thresholds, setThresholds] = useState<Thresholds>({
    temperature: { min: 15, max: 35 },
    humidity: { min: 40, max: 80 },
    soilMoisture: { min: 20, max: 80 },
  });

  const [offlineMode, setOfflineMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleThresholdChange = (
    sensor: keyof Thresholds,
    type: 'min' | 'max',
    value: number
  ) => {
    setThresholds(prev => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        [type]: value,
      },
    }));
  };

  const handleSave = () => {
    // Save to local storage
    localStorage.setItem('farmThresholds', JSON.stringify(thresholds));
    localStorage.setItem('offlineMode', JSON.stringify(offlineMode));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Show success message (in a real app, use a toast)
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* User Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <User className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Account</h2>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700"><span className="font-medium">Farm:</span> Green Valley Farm</p>
            <p className="text-gray-700"><span className="font-medium">Owner:</span> John Farmer</p>
            <p className="text-gray-700"><span className="font-medium">Location:</span> Rural District, Kenya</p>
          </div>
        </div>

        {/* Threshold Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Alert Thresholds</h2>
          
          {/* Temperature */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Thermometer className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-700">Temperature (°C)</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Minimum</label>
                <input
                  type="number"
                  value={thresholds.temperature.min}
                  onChange={(e) => handleThresholdChange('temperature', 'min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Maximum</label>
                <input
                  type="number"
                  value={thresholds.temperature.max}
                  onChange={(e) => handleThresholdChange('temperature', 'max', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Droplets className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-700">Humidity (%)</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Minimum</label>
                <input
                  type="number"
                  value={thresholds.humidity.min}
                  onChange={(e) => handleThresholdChange('humidity', 'min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Maximum</label>
                <input
                  type="number"
                  value={thresholds.humidity.max}
                  onChange={(e) => handleThresholdChange('humidity', 'max', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Soil Moisture */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Gauge className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-700">Soil Moisture (%)</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Minimum</label>
                <input
                  type="number"
                  value={thresholds.soilMoisture.min}
                  onChange={(e) => handleThresholdChange('soilMoisture', 'min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Maximum</label>
                <input
                  type="number"
                  value={thresholds.soilMoisture.max}
                  onChange={(e) => handleThresholdChange('soilMoisture', 'max', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">App Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Offline Mode</h3>
                <p className="text-sm text-gray-600">Cache data for offline viewing</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineMode}
                  onChange={(e) => setOfflineMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Push Notifications</h3>
                <p className="text-sm text-gray-600">Receive alerts for critical conditions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-3"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
