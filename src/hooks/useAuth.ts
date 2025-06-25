
import { useState, useEffect, createContext, useContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  farmName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, farmName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthHook = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for stored user on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('farmMonitorUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('farmMonitorUser');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored users
      const storedUsers = JSON.parse(localStorage.getItem('farmMonitorUsers') || '[]');
      const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        farmName: foundUser.farmName,
      };
      
      setUser(userData);
      localStorage.setItem('farmMonitorUser', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, farmName: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing users
      const storedUsers = JSON.parse(localStorage.getItem('farmMonitorUsers') || '[]');
      
      // Check if user already exists
      if (storedUsers.find((u: any) => u.email === email)) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In production, this would be hashed
        name,
        farmName,
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('farmMonitorUsers', JSON.stringify(storedUsers));
      
      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        farmName: newUser.farmName,
      };
      
      setUser(userData);
      localStorage.setItem('farmMonitorUser', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farmMonitorUser');
  };

  return {
    user,
    login,
    register,
    logout,
    isLoading,
  };
};

export { AuthContext };
