
import React, { useState, useEffect } from 'react';
import { Bell, Smartphone, Check, X, Settings } from 'lucide-react';

interface NotificationPreference {
  type: 'temperature' | 'humidity' | 'soilMoisture' | 'irrigation' | 'weather';
  enabled: boolean;
  title: string;
  description: string;
}

interface MobilePushNotificationsProps {
  onNotificationSent: (message: string) => void;
}

const MobilePushNotifications: React.FC<MobilePushNotificationsProps> = ({ onNotificationSent }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      type: 'temperature',
      enabled: true,
      title: 'Temperature Alerts',
      description: 'Critical temperature conditions'
    },
    {
      type: 'humidity',
      enabled: true,
      title: 'Humidity Alerts',
      description: 'Humidity level warnings'
    },
    {
      type: 'soilMoisture',
      enabled: true,
      title: 'Soil Moisture Alerts',
      description: 'Low soil moisture notifications'
    },
    {
      type: 'irrigation',
      enabled: false,
      title: 'Irrigation Updates',
      description: 'Irrigation system status'
    },
    {
      type: 'weather',
      enabled: false,
      title: 'Weather Alerts',
      description: 'Severe weather warnings'
    }
  ]);

  useEffect(() => {
    // Check if push notifications are supported
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    setPermission(Notification.permission);
    
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('pushNotificationPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;
    
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribeToNotifications();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const subscribeToNotifications = async () => {
    if (!isSupported || permission !== 'granted') return;
    
    try {
      // Register service worker (simplified for demo)
      const registration = await navigator.serviceWorker.register('/sw.js').catch(() => null);
      
      if (registration) {
        // Create subscription (simplified - would need actual VAPID keys in production)
        const mockSubscription = {
          endpoint: 'https://fcm.googleapis.com/fcm/send/mock-endpoint',
          keys: {
            p256dh: 'mock-key',
            auth: 'mock-auth'
          }
        } as unknown as PushSubscription;
        
        setSubscription(mockSubscription);
        onNotificationSent('Push notifications enabled successfully!');
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Farm Monitor Test', {
        body: 'Push notifications are working correctly!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification'
      });
      onNotificationSent('Test notification sent!');
    }
  };

  const updatePreference = (type: string, enabled: boolean) => {
    const updatedPreferences = preferences.map(pref =>
      pref.type === type ? { ...pref, enabled } : pref
    );
    setPreferences(updatedPreferences);
    localStorage.setItem('pushNotificationPreferences', JSON.stringify(updatedPreferences));
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { text: 'Enabled', color: 'text-green-600 bg-green-100', icon: <Check className="w-4 h-4" /> };
      case 'denied':
        return { text: 'Blocked', color: 'text-red-600 bg-red-100', icon: <X className="w-4 h-4" /> };
      default:
        return { text: 'Not Set', color: 'text-yellow-600 bg-yellow-100', icon: <Bell className="w-4 h-4" /> };
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-800">Mobile Push Notifications</h2>
        </div>
        <div className="text-center py-8">
          <Smartphone className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Push notifications are not supported in this browser.</p>
          <p className="text-sm text-gray-500 mt-2">Try using Chrome, Firefox, or Safari on mobile.</p>
        </div>
      </div>
    );
  }

  const status = getPermissionStatus();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Smartphone className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Mobile Push Notifications</h2>
      </div>

      {/* Permission Status */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Permission Status</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.color}`}>
            {status.icon}
            {status.text}
          </div>
        </div>
        
        {permission !== 'granted' && (
          <button
            onClick={requestPermission}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Enable Push Notifications
          </button>
        )}
        
        {permission === 'granted' && (
          <div className="space-y-2">
            <button
              onClick={sendTestNotification}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Send Test Notification
            </button>
            {subscription && (
              <p className="text-xs text-green-600 text-center">✓ Subscribed to push notifications</p>
            )}
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Notification Types</h3>
        </div>
        
        <div className="space-y-3">
          {preferences.map((pref) => (
            <div key={pref.type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-800">{pref.title}</div>
                <div className="text-sm text-gray-600">{pref.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pref.enabled}
                  onChange={(e) => updatePreference(pref.type, e.target.checked)}
                  className="sr-only peer"
                  disabled={permission !== 'granted'}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 peer-disabled:opacity-50"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {permission === 'denied' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            Push notifications are blocked. To enable them, click the notification icon in your browser's address bar or check your browser settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default MobilePushNotifications;
