
import React, { useState } from 'react';
import { Plus, Trash2, Wifi, WifiOff } from 'lucide-react';

interface Sensor {
  id: string;
  name: string;
  ip: string;
  port: string;
  location: string;
  isActive: boolean;
  lastUpdate?: string;
}

interface MultiSensorConfigProps {
  onSensorUpdate: (sensors: Sensor[]) => void;
}

const MultiSensorConfig: React.FC<MultiSensorConfigProps> = ({ onSensorUpdate }) => {
  const [sensors, setSensors] = useState<Sensor[]>(() => {
    const savedSensors = localStorage.getItem('sensors');
    return savedSensors ? JSON.parse(savedSensors) : [
      {
        id: '1',
        name: 'Main Field Sensor',
        ip: '192.168.1.100',
        port: '80',
        location: 'Field A - North Section',
        isActive: true,
        lastUpdate: new Date().toLocaleTimeString()
      }
    ];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSensor, setNewSensor] = useState<Partial<Sensor>>({
    name: '',
    ip: '',
    port: '80',
    location: '',
    isActive: true
  });

  const saveSensors = (updatedSensors: Sensor[]) => {
    setSensors(updatedSensors);
    localStorage.setItem('sensors', JSON.stringify(updatedSensors));
    onSensorUpdate(updatedSensors);
  };

  const addSensor = () => {
    if (newSensor.name && newSensor.ip && newSensor.port && newSensor.location) {
      const sensor: Sensor = {
        id: Date.now().toString(),
        name: newSensor.name,
        ip: newSensor.ip,
        port: newSensor.port,
        location: newSensor.location,
        isActive: newSensor.isActive || true,
        lastUpdate: new Date().toLocaleTimeString()
      };
      
      const updatedSensors = [...sensors, sensor];
      saveSensors(updatedSensors);
      
      setNewSensor({ name: '', ip: '', port: '80', location: '', isActive: true });
      setShowAddForm(false);
    }
  };

  const removeSensor = (id: string) => {
    const updatedSensors = sensors.filter(sensor => sensor.id !== id);
    saveSensors(updatedSensors);
  };

  const toggleSensor = (id: string) => {
    const updatedSensors = sensors.map(sensor =>
      sensor.id === id ? { ...sensor, isActive: !sensor.isActive } : sensor
    );
    saveSensors(updatedSensors);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Multi-Sensor Management</h2>
          <p className="text-gray-600">Manage multiple sensors across your farm</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Sensor
        </button>
      </div>

      {/* Add Sensor Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Add New Sensor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sensor Name</label>
              <input
                type="text"
                value={newSensor.name || ''}
                onChange={(e) => setNewSensor(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Field B Sensor"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={newSensor.location || ''}
                onChange={(e) => setNewSensor(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Greenhouse 2"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
              <input
                type="text"
                value={newSensor.ip || ''}
                onChange={(e) => setNewSensor(prev => ({ ...prev, ip: e.target.value }))}
                placeholder="192.168.1.101"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <input
                type="text"
                value={newSensor.port || '80'}
                onChange={(e) => setNewSensor(prev => ({ ...prev, port: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addSensor}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Sensor
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sensors List */}
      <div className="space-y-4">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {sensor.isActive ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <h4 className="font-semibold text-gray-800">{sensor.name}</h4>
                  <p className="text-sm text-gray-600">{sensor.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSensor(sensor.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    sensor.isActive
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {sensor.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => removeSensor(sensor.id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">IP Address:</span>
                <span className="ml-2 font-mono">{sensor.ip}:{sensor.port}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Update:</span>
                <span className="ml-2">{sensor.lastUpdate || 'Never'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sensors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No sensors configured yet.</p>
          <p className="text-sm">Click "Add Sensor" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MultiSensorConfig;
