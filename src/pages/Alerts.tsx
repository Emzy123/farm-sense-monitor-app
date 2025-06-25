
import React from 'react';
import { Bell, Trash2, CheckCircle, X } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

interface Alert {
  id: string;
  type: 'temperature' | 'humidity' | 'soilMoisture';
  value: number;
  threshold: number;
  severity: 'warning' | 'critical';
  timestamp: string;
  acknowledged: boolean;
}

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = React.useState<Alert[]>([
    {
      id: '1',
      type: 'soilMoisture',
      value: 15,
      threshold: 20,
      severity: 'critical',
      timestamp: '2025-06-25 14:30',
      acknowledged: false,
    },
    {
      id: '2',
      type: 'temperature',
      value: 38,
      threshold: 35,
      severity: 'warning',
      timestamp: '2025-06-25 13:15',
      acknowledged: false,
    },
  ]);

  const getAlertMessage = (alert: Alert) => {
    const typeNames = {
      temperature: 'Temperature',
      humidity: 'Humidity',
      soilMoisture: 'Soil Moisture'
    };

    const units = {
      temperature: '°C',
      humidity: '%',
      soilMoisture: '%'
    };

    return `${typeNames[alert.type]}: ${alert.value}${units[alert.type]} (Threshold: ${alert.threshold}${units[alert.type]})`;
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-red-500 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Alerts</h1>
        {alerts.length > 0 && (
          <button
            onClick={clearAllAlerts}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Clear All</span>
          </button>
        )}
      </header>

      <main className="p-4 space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-lg">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Alerts</h2>
            <p className="text-gray-600">All your farm parameters are within normal ranges.</p>
          </div>
        ) : (
          <>
            {unacknowledgedAlerts.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-500" />
                  Active Alerts ({unacknowledgedAlerts.length})
                </h2>
                <div className="space-y-3">
                  {unacknowledgedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-xl p-4 shadow-lg ${
                        alert.severity === 'critical' 
                          ? 'bg-red-50 border-l-4 border-red-500' 
                          : 'bg-yellow-50 border-l-4 border-yellow-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            alert.severity === 'critical' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-yellow-500 text-white'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">{alert.timestamp}</p>
                        </div>
                      </div>
                      <p className="text-gray-800 font-medium mb-4">{getAlertMessage(alert)}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Acknowledge
                        </button>
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {acknowledgedAlerts.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Acknowledged ({acknowledgedAlerts.length})
                </h2>
                <div className="space-y-3">
                  {acknowledgedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="bg-gray-50 border-l-4 border-gray-400 rounded-xl p-4 shadow-lg opacity-75"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-400 text-white">
                          ACKNOWLEDGED
                        </span>
                        <p className="text-sm text-gray-600">{alert.timestamp}</p>
                      </div>
                      <p className="text-gray-700 font-medium mb-2">{getAlertMessage(alert)}</p>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Alerts;
