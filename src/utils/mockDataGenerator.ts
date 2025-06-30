
import { SensorData, ChartData } from '@/hooks/useFarmData';
import { formatDateForChart } from './dataProcessing';

export const generateMockCurrentData = (): SensorData => {
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

export const generateMockHistoricalData = (timeRange: '24h' | '7d'): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  const points = timeRange === '24h' ? 24 : 7;
  const interval = timeRange === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  const baseTemp = 28;
  const baseHumidity = 65;
  const baseSoilMoisture = 40;

  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * interval));
    const timeStr = formatDateForChart(time, timeRange);

    data.push({
      time: timeStr,
      temperature: baseTemp + (Math.random() - 0.5) * 10,
      humidity: baseHumidity + (Math.random() - 0.5) * 20,
      soilMoisture: baseSoilMoisture + (Math.random() - 0.5) * 30,
    });
  }

  return data;
};
