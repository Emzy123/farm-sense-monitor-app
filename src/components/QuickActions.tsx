
import React from 'react';
import { Bell, History, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Bell,
      label: 'View Alerts',
      path: '/alerts',
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      icon: History,
      label: 'Check History',
      path: '/history',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/analytics',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map(({ icon: Icon, label, path, color }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`${color} text-white rounded-lg px-4 py-3 flex items-center gap-3 transition-colors font-medium shadow-md`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
