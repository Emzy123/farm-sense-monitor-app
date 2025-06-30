
import { useState, useCallback } from 'react';
import { SensorData } from './useFarmData';
import { buildSensorUrl } from '@/utils/sensorUtils';

export const useSensorConnection = () => {
  const [sensorConnected, setSensorConnected] = useState(false);
  const [lastSensorError, setLastSensorError] = useState<string>('');

  const fetchSensorData = useCallback(async (ip: string, port: string, timeout: number): Promise<SensorData | null> => {
    try {
      const sensorUrl = buildSensorUrl(ip, port);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

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
  }, []);

  return {
    sensorConnected,
    lastSensorError,
    fetchSensorData,
  };
};
