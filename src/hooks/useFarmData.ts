
import { useState, useEffect } from 'react';
import { useSensorConnection } from './useSensorConnection';
import { generateMockCurrentData, generateMockHistoricalData } from '@/utils/mockDataGenerator';
import { loadSensorConfig, saveSensorConfig, SensorConfig } from '@/utils/sensorUtils';

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
  const [sensorConfig, setSensorConfig] = useState<SensorConfig>(loadSensorConfig());

  const { sensorConnected, lastSensorError, fetchSensorData } = useSensorConnection();

  const updateCurrentData = async (): Promise<void> => {
    try {
      let sensorData: SensorData | null = null;
      
      if (!sensorConfig.useMockData) {
        sensorData = await fetchSensorData(
          sensorConfig.sensorIP, 
          sensorConfig.sensorPort, 
          sensorConfig.apiTimeout
        );
      }
      
      if (sensorData) {
        console.log('Real sensor data received:', sensorData);
        setCurrentData(sensorData);
      } else {
        const mockData = generateMockCurrentData();
        console.log('Using mock data:', mockData);
        setCurrentData(mockData);
      }
    } catch (error) {
      console.error('Error updating current data:', error);
      setCurrentData(generateMockCurrentData());
    }
  };

  const refreshData = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      await updateCurrentData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getChartData = (timeRange: '24h' | '7d'): ChartData[] => {
    return generateMockHistoricalData(timeRange);
  };

  const updateSensorConfig = (ip: string, port: string, useMock: boolean): void => {
    const newConfig = { ...sensorConfig, sensorIP: ip, sensorPort: port, useMockData: useMock };
    setSensorConfig(newConfig);
    saveSensorConfig(newConfig);
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
  }, [isOnline, sensorConfig]);

  // Initialize data
  useEffect(() => {
    updateCurrentData();
    setChartData(generateMockHistoricalData('24h'));
  }, []);

  return {
    currentData,
    chartData,
    isOnline,
    isRefreshing,
    sensorConnected,
    lastSensorError,
    refreshData,
    getChartData,
    updateSensorConfig,
    sensorConfig,
  };
};
