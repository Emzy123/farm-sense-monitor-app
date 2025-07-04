
import React from 'react';
import { RefreshCw, Wifi, WifiOff, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  isOnline: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const Header: React.FC<HeaderProps> = ({ isOnline, onRefresh, isRefreshing }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-green-500 text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold">Smart Farm Monitor</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5" />
          ) : (
            <WifiOff className="w-5 h-5 text-yellow-300" />
          )}
          <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-300' : 'bg-red-400'}`} />
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="focus:outline-none p-1 rounded-full hover:bg-green-600 transition-colors"
        >
          <RefreshCw className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="focus:outline-none p-1 rounded-full hover:bg-green-600 transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
