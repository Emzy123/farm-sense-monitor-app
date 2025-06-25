
import React, { useState } from 'react';
import { Wifi, WifiOff, Settings } from 'lucide-react';

interface SensorConfigProps {
  sensorConfig: {
    sensorIP: string;
    sensorPort: string;
    useMockData: boolean;
  };
  sensorConnected: boolean;
  lastSensorError: string;
  onUpdateConfig: (ip: string, port: string, useMock: boolean) => void;
}

const SensorConfig: React.FC<SensorConfigProps> = ({
  sensorConfig,
  sensorConnected,
  lastSensorError,
  onUpdateConfig,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ip, setIp] = useState(sensorConfig.sensorIP);
  const [port, setPort] = useState(sensorConfig.sensorPort);
  const [useMock, setUseMock] = useState(sensorConfig.useMockData);

  const handleSave = () => {
    onUpdateConfig(ip, port, useMock);
    setIsExpanded(false);
  };

  const handleReset = () => {
    setIp(sensorConfig.sensorIP);
    setPort(sensorConfig.sensorPort);
    setUseMock(sensorConfig.useMockData);
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Sensor Configuration</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-3 mb-4">
        {sensorConnected ? (
          <Wifi className="w-5 h-5 text-green-600" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-600" />
        )}
        <div>
          <p className={`font-medium ${sensorConnected ? 'text-green-600' : 'text-red-600'}`}>
            {sensorConnected ? 'Sensor Connected' : 'Sensor Disconnected'}
          </p>
          {!sensorConnected && lastSensorError && (
            <p className="text-sm text-gray-600">{lastSensorError}</p>
          )}
        </div>
      </div>

      {/* Current Configuration */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Current Settings</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Mode: {sensorConfig.useMockData ? 'Mock Data' : 'Real Sensor'}</p>
          {!sensorConfig.useMockData && (
            <>
              <p>IP Address: {sensorConfig.sensorIP}</p>
              <p>Port: {sensorConfig.sensorPort}</p>
            </>
          )}
        </div>
      </div>

      {/* Configuration Form */}
      {isExpanded && (
        <div className="border-t pt-4">
          <div className="space-y-4">
            {/* Mock Data Toggle */}
            <div className="flex items-center justify-between">
              <label className="font-medium text-gray-700">Use Mock Data</label>
              <input
                type="checkbox"
                checked={useMock}
                onChange={(e) => setUseMock(e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
            </div>

            {/* Sensor Configuration */}
            {!useMock && (
              <>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Sensor IP Address
                  </label>
                  <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="192.168.1.100"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Local network IP address of your sensor device
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Port
                  </label>
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="80"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-green-600 transition-colors"
              >
                Save Configuration
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {isExpanded && !useMock && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Setup Instructions</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>1. Connect your Arduino sensor device to the same WiFi network</p>
            <p>2. Find your sensor's IP address (check router admin or Arduino serial output)</p>
            <p>3. Ensure your sensor exposes HTTP endpoint: /api/sensors/current</p>
            <p>4. Expected JSON format: {`{"temperature": 25.5, "humidity": 60, "soilMoisture": 35}`}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorConfig;
