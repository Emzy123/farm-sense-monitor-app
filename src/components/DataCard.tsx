
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: LucideIcon;
  lastUpdated: string;
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  unit, 
  status, 
  icon: Icon, 
  lastUpdated 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'warning': return 'Warning';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-500">
      <div className="flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-full">
          <Icon className="w-8 h-8 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            <span className="text-lg text-gray-600">{unit}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <span className="text-xs text-gray-500">{lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
