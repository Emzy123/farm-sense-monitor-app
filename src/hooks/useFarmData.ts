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

// Configuration for sensor device
const SENSOR_CONFIG = {
  // Default to local network IP - user should configure this
  sensorIP: localStorage.getItem('sensorIP') || '192.168.1.100',
  sensorPort: localStorage.getItem('sensorPort') || '80',
  useMockData: localStorage.getItem('useMockData') !== 'false', // Default to mock data
  apiTimeout: 5000, // 5 second timeout
};

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
  const [sensorConnected, setSensorConnected] = useState(false);
  const [lastSensorError, setLastSensorError] = useState<string>('');

  // Function to fetch data from real sensor
  const fetchSensorData = async (): Promise<SensorData | null> => {
    if (SENSOR_CONFIG.useMockData) {
      return null; // Will use mock data
    }

    try {
      const sensorUrl = `http://${SENSOR_CONFIG.sensorIP}:${SENSOR_CONFIG.sensorPort}/api/sensors/current`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SENSOR_CONFIG.apiTimeout);

      const response = await fetch(sensorUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Sensor responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate sensor data format
      if (typeof data.temperature !== 'number' || 
          typeof data.humidity !== 'number' || 
          typeof data.soilMoisture !== 'number') {
        throw new Error('Invalid sensor data format');
      }

      setSensorConnected(true);
      setLastSensorError('');
      
      return {
        temperature: Number(data.temperature.toFixed(1)),
        humidity: Math.round(data.humidity),
        soilMoisture: Math.round(data.soilMoisture),
        timestamp: new Date().toLocaleTimeString(),
      };

    } catch (error) {
      console.error('Sensor fetch error:', error);
      setSensorConnected(false);
      
      let errorMessage = 'Unknown sensor error';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Sensor connection timeout';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot reach sensor device';
        } else {
          errorMessage = error.message;
        }
      }
      
      setLastSensorError(errorMessage);
      return null;
    }
  };

  // Generate mock historical data
  const generateMockData = (timeRange: '24h' | '7d'): ChartData[] => {
    const data: ChartData[] = [];
    const now = new Date();
    const points = timeRange === '24h' ? 24 : 7;
    const interval = timeRange === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * interval));
      const timeStr = timeRange === '24h' 
        ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : time.toLocaleDateString([], { month: 'short', day: 'numeric' });

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

  // Generate mock current data
  const generateMockCurrentData = (): SensorData => {
    const baseTemp = 28;
    const baseHumidity = 65;
    const baseSoilMoisture = 40;

    return {
      temperature: Math.round((baseTemp + (Math.random() - 0.5) * 6) * 10) / 10,
      humidity: Math.round(baseHumidity + (Math.random() - 0.5) * 15),
      soilMoisture: Math.round(baseSoilMoisture + (Math.random() - 0.5) * 25),
      timestamp: new Date().toLocaleTimeString(),
    };
  };

  // Update current data from sensor or mock
  const updateCurrentData = async () => {
    try {
      const sensorData = await fetchSensorData();
      
      if (sensorData) {
        console.log('Real sensor data received:', sensorData);
        setCurrentData(sensorData);
      } else {
        // Use mock data
        const mockData = generateMockCurrentData();
        console.log('Using mock data:', mockData);
        setCurrentData(mockData);
      }
    } catch (error) {
      console.error('Error updating current data:', error);
      // Fallback to mock data
      setCurrentData(generateMockCurrentData());
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await updateCurrentData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getChartData = (timeRange: '24h' | '7d') => {
    return generateMockData(timeRange);
  };

  // Configuration functions
  const updateSensorConfig = (ip: string, port: string, useMock: boolean) => {
    localStorage.setItem('sensorIP', ip);
    localStorage.setItem('sensorPort', port);
    localStorage.setItem('useMockData', useMock.toString());
    
    SENSOR_CONFIG.sensorIP = ip;
    SENSOR_CONFIG.sensorPort = port;
    SENSOR_CONFIG.useMockData = useMock;
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

  // Initialize data
  useEffect(() => {
    updateCurrentData();
    setChartData(generateMockData('24h'));
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
    sensorConfig: SENSOR_CONFIG,
  };
};
