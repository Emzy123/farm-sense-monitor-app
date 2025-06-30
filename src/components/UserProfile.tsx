
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface UserProfileProps {
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onLogout }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-green-100 p-3 rounded-full">
          <User className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Profile</h2>
          <p className="text-gray-600">Manage your account settings</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Name</span>
          <span className="font-medium text-gray-800">{user.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Email</span>
          <span className="font-medium text-gray-800">{user.email}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Farm</span>
          <span className="font-medium text-gray-800">{user.farmName}</span>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full mt-6 bg-red-500 text-white rounded-lg px-4 py-3 font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>
    </div>
  );
};

export default UserProfile;
