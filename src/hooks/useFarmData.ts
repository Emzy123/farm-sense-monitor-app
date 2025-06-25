
import { useState, useEffect } from 'react';

export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  timestamp: string;
}

export interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
}

export const useFarmData = () => {
  const [currentData, setCurrentData] = useState<SensorData>({
    temperature: 28.5,
    humidity: 65,
    soilMoisture: 42,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate mock historical data
  const generateMockData = (timeRange: '24h' | '7d'): ChartData[] => {
    const data: ChartData[] = [];
    const now = new Date();
    const points = timeRange === '24h' ? 24 : 7;
    const interval = timeRange === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 hour or 1 day

    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * interval));
      const timeStr = timeRange === '24h' 
        ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : time.toLocaleDateString([], { month: 'short', day: 'numeric' });

      // Generate realistic sensor data with some variation
      const baseTemp = 28;
      const baseHumidity = 65;
      const baseSoilMoisture = 40;

      data.push({
        time: timeStr,
        temperature: baseTemp + (Math.random() - 0.5) * 10,
        humidity: baseHumidity + (Math.random() - 0.5) * 20,
        soilMoisture: baseSoilMoisture + (Math.random() - 0.5) * 30,
      });
    }

    return data;
  };

  // Simulate real-time data updates
  const updateCurrentData = () => {
    const baseTemp = 28;
    const baseHumidity = 65;
    const baseSoilMoisture = 40;

    setCurrentData({
      temperature: Math.round((baseTemp + (Math.random() - 0.5) * 6) * 10) / 10,
      humidity: Math.round(baseHumidity + (Math.random() - 0.5) * 15),
      soilMoisture: Math.round(baseSoilMoisture + (Math.random() - 0.5) * 25),
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateCurrentData();
    setIsRefreshing(false);
  };

  const getChartData = (timeRange: '24h' | '7d') => {
    return generateMockData(timeRange);
  };

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-refresh data every 5 seconds when online
  useEffect(() => {
    if (isOnline) {
      const interval = setInterval(updateCurrentData, 5000);
      return () => clearInterval(interval);
    }
  }, [isOnline]);

  // Initialize chart data
  useEffect(() => {
    setChartData(generateMockData('24h'));
  }, []);

  return {
    currentData,
    chartData,
    isOnline,
    isRefreshing,
    refreshData,
    getChartData,
  };
};
