
import React from 'react';
import { Home, Bell, History, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bg-gray-800 text-white flex justify-around py-4 fixed bottom-0 w-full shadow-lg z-50">
      {navItems.map(({ icon: Icon, label, path }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive ? 'text-green-400 bg-gray-700' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
