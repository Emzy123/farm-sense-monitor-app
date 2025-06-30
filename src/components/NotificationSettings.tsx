
import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Save } from 'lucide-react';

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  emailAddress: string;
  phoneNumber: string;
  temperatureAlerts: boolean;
  humidityAlerts: boolean;
  soilMoistureAlerts: boolean;
}

interface NotificationSettingsProps {
  onSave: (settings: NotificationSettings) => void;
}

const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: localStorage.getItem('emailEnabled') === 'true',
    smsEnabled: localStorage.getItem('smsEnabled') === 'true',
    emailAddress: localStorage.getItem('emailAddress') || '',
    phoneNumber: localStorage.getItem('phoneNumber') || '',
    temperatureAlerts: localStorage.getItem('temperatureAlerts') !== 'false',
    humidityAlerts: localStorage.getItem('humidityAlerts') !== 'false',
    soilMoistureAlerts: localStorage.getItem('soilMoistureAlerts') !== 'false',
  });

  const handleSave = () => {
    // Save to localStorage
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
    
    onSave(settings);
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Bell className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Notification Settings</h2>
          <p className="text-gray-600">Configure alerts for critical conditions</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800">Email Notifications</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => updateSetting('emailEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          
          {settings.emailEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={settings.emailAddress}
                onChange={(e) => updateSetting('emailAddress', e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>

        {/* SMS Notifications */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">SMS Notifications</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsEnabled}
                onChange={(e) => updateSetting('smsEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
          
          {settings.smsEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) => updateSetting('phoneNumber', e.target.value)}
                placeholder="+1234567890"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Alert Types */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Alert Types</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.temperatureAlerts}
                onChange={(e) => updateSetting('temperatureAlerts', e.target.checked)}
                className="rounded border-gray-300 text-green-500 focus:ring-green-500"
              />
              <span className="text-gray-700">Temperature Alerts</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.humidityAlerts}
                onChange={(e) => updateSetting('humidityAlerts', e.target.checked)}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-700">Humidity Alerts</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.soilMoistureAlerts}
                onChange={(e) => updateSetting('soilMoistureAlerts', e.target.checked)}
                className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-gray-700">Soil Moisture Alerts</span>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-6 bg-green-500 text-white rounded-lg px-4 py-3 font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        Save Notification Settings
      </button>
    </div>
  );
};

export default NotificationSettingsComponent;
