import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface SimpleNotificationPrefsProps {
  onSave: (message: string) => void;
}

const SimpleNotificationPrefs: React.FC<SimpleNotificationPrefsProps> = ({ onSave }) => {
  const [preferences, setPreferences] = useState<NotificationPref[]>([
    {
      id: 'temperature',
      label: 'Temperature Alerts',
      description: 'Get notified of extreme temperatures',
      enabled: true
    },
    {
      id: 'humidity',
      label: 'Humidity Alerts', 
      description: 'Humidity level warnings',
      enabled: true
    },
    {
      id: 'soil',
      label: 'Soil Moisture Alerts',
      description: 'Low soil moisture notifications',
      enabled: true
    },
    {
      id: 'system',
      label: 'System Updates',
      description: 'App and system notifications',
      enabled: false
    }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const togglePreference = (id: string) => {
    const updated = preferences.map(pref =>
      pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
    );
    setPreferences(updated);
    localStorage.setItem('notificationPreferences', JSON.stringify(updated));
    onSave('Notification preferences updated');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Notification Preferences</h2>
      </div>

      <div className="space-y-4">
        {preferences.map((pref) => (
          <div key={pref.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-gray-800">{pref.label}</div>
              <div className="text-sm text-gray-600">{pref.description}</div>
            </div>
            <button
              onClick={() => togglePreference(pref.id)}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                pref.enabled 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {pref.enabled && <Check className="w-5 h-5" />}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          Your notification preferences are saved locally. Actual notifications depend on your device settings.
        </p>
      </div>
    </div>
  );
};

export default SimpleNotificationPrefs;