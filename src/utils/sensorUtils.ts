
export interface SensorConfig {
  sensorIP: string;
  sensorPort: string;
  useMockData: boolean;
  apiTimeout: number;
}

export const DEFAULT_SENSOR_CONFIG: SensorConfig = {
  sensorIP: '192.168.1.100',
  sensorPort: '80',
  useMockData: true,
  apiTimeout: 5000,
};

export const loadSensorConfig = (): SensorConfig => ({
  sensorIP: localStorage.getItem('sensorIP') || DEFAULT_SENSOR_CONFIG.sensorIP,
  sensorPort: localStorage.getItem('sensorPort') || DEFAULT_SENSOR_CONFIG.sensorPort,
  useMockData: localStorage.getItem('useMockData') !== 'false',
  apiTimeout: DEFAULT_SENSOR_CONFIG.apiTimeout,
});

export const saveSensorConfig = (config: Partial<SensorConfig>): void => {
  if (config.sensorIP) localStorage.setItem('sensorIP', config.sensorIP);
  if (config.sensorPort) localStorage.setItem('sensorPort', config.sensorPort);
  if (config.useMockData !== undefined) localStorage.setItem('useMockData', config.useMockData.toString());
};

export const buildSensorUrl = (ip: string, port: string): string => {
  return `http://${ip}:${port}/api/sensors/current`;
};
