
import React, { useState } from 'react';
import { Bell, Thermometer } from 'lucide-react';
import { ThresholdSettings, loadThresholds, saveThresholds, updateThreshold } from '@/utils/thresholdManager';

interface ThresholdConfigProps {
  onSave: (message: string) => void;
}

const ThresholdConfig: React.FC<ThresholdConfigProps> = ({ onSave }) => {
  const [thresholds, setThresholds] = useState<ThresholdSettings>(loadThresholds());

  const handleSaveThresholds = () => {
    saveThresholds(thresholds);
    onSave('Threshold settings saved successfully');
  };

  const handleThresholdChange = (key: keyof ThresholdSettings, value: string) => {
    const update = updateThreshold(key, value);
    if (Object.keys(update).length > 0) {
      setThresholds(prev => ({ ...prev, ...update }));
    }
  };

  return (
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
  );
};

export default ThresholdConfig;
