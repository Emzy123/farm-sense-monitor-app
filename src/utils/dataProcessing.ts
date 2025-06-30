
export const getDataStatus = (type: 'temperature' | 'humidity' | 'soilMoisture', value: number): 'normal' | 'warning' | 'critical' => {
  switch (type) {
    case 'temperature':
      if (value < 15 || value > 35) return 'critical';
      if (value < 18 || value > 32) return 'warning';
      return 'normal';
    case 'humidity':
      if (value < 40 || value > 80) return 'critical';
      if (value < 45 || value > 75) return 'warning';
      return 'normal';
    case 'soilMoisture':
      if (value < 20) return 'critical';
      if (value < 30) return 'warning';
      return 'normal';
    default:
      return 'normal';
  }
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString();
};

export const formatDateForChart = (date: Date, timeRange: '24h' | '7d'): string => {
  return timeRange === '24h' 
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};
