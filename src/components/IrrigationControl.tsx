
import React, { useState, useEffect } from 'react';
import { Droplets, Power, Clock, Settings, Play, Square } from 'lucide-react';

interface IrrigationZone {
  id: string;
  name: string;
  isActive: boolean;
  duration: number; // minutes
  soilMoisture: number;
  lastWatered: string;
}

interface IrrigationControlProps {
  currentSoilMoisture: number;
  onIrrigationStart: (zoneId: string, duration: number) => void;
  onIrrigationStop: (zoneId: string) => void;
}

const IrrigationControl: React.FC<IrrigationControlProps> = ({
  currentSoilMoisture,
  onIrrigationStart,
  onIrrigationStop
}) => {
  const [zones, setZones] = useState<IrrigationZone[]>([
    {
      id: 'zone1',
      name: 'Main Field',
      isActive: false,
      duration: 30,
      soilMoisture: currentSoilMoisture,
      lastWatered: '2 hours ago'
    },
    {
      id: 'zone2',
      name: 'Greenhouse',
      isActive: false,
      duration: 15,
      soilMoisture: currentSoilMoisture + 5,
      lastWatered: '4 hours ago'
    },
    {
      id: 'zone3',
      name: 'Seedling Area',
      isActive: false,
      duration: 10,
      soilMoisture: currentSoilMoisture - 3,
      lastWatered: '1 hour ago'
    }
  ]);

  const [autoMode, setAutoMode] = useState(localStorage.getItem('autoIrrigation') === 'true');
  const [threshold, setThreshold] = useState(Number(localStorage.getItem('irrigationThreshold')) || 30);

  const handleStartIrrigation = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (zone) {
      setZones(prev => prev.map(z => 
        z.id === zoneId ? { ...z, isActive: true } : z
      ));
      onIrrigationStart(zoneId, zone.duration);
      
      // Simulate irrigation completion
      setTimeout(() => {
        setZones(prev => prev.map(z => 
          z.id === zoneId ? { 
            ...z, 
            isActive: false, 
            soilMoisture: Math.min(100, z.soilMoisture + 20),
            lastWatered: 'Just now'
          } : z
        ));
      }, zone.duration * 1000); // Convert to milliseconds for demo
    }
  };

  const handleStopIrrigation = (zoneId: string) => {
    setZones(prev => prev.map(z => 
      z.id === zoneId ? { ...z, isActive: false } : z
    ));
    onIrrigationStop(zoneId);
  };

  const updateZoneDuration = (zoneId: string, duration: number) => {
    setZones(prev => prev.map(z => 
      z.id === zoneId ? { ...z, duration } : z
    ));
  };

  useEffect(() => {
    localStorage.setItem('autoIrrigation', autoMode.toString());
    localStorage.setItem('irrigationThreshold', threshold.toString());
  }, [autoMode, threshold]);

  // Auto irrigation logic
  useEffect(() => {
    if (autoMode) {
      zones.forEach(zone => {
        if (zone.soilMoisture < threshold && !zone.isActive) {
          handleStartIrrigation(zone.id);
        }
      });
    }
  }, [autoMode, threshold, zones]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Droplets className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Irrigation Control</h2>
      </div>

      {/* Auto Mode Settings */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Automatic Mode</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => setAutoMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
        
        {autoMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-start threshold: {threshold}%
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        )}
      </div>

      {/* Irrigation Zones */}
      <div className="space-y-4">
        {zones.map((zone) => (
          <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">{zone.name}</h3>
              <div className={`px-2 py-1 rounded-full text-xs ${
                zone.isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {zone.isActive ? 'Running' : 'Idle'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600">Soil Moisture</span>
                <div className="font-medium">{zone.soilMoisture}%</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Last Watered</span>
                <div className="font-medium">{zone.lastWatered}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  value={zone.duration}
                  onChange={(e) => updateZoneDuration(zone.id, Number(e.target.value))}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                  min="1"
                  max="120"
                />
                <span className="text-sm text-gray-600">minutes</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {zone.isActive ? (
                <button
                  onClick={() => handleStopIrrigation(zone.id)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              ) : (
                <button
                  onClick={() => handleStartIrrigation(zone.id)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={autoMode}
                >
                  <Play className="w-4 h-4" />
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IrrigationControl;
