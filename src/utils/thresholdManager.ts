
export interface ThresholdSettings {
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  soilMoistureMin: number;
  soilMoistureMax: number;
}

export const DEFAULT_THRESHOLDS: ThresholdSettings = {
  tempMin: 15,
  tempMax: 35,
  humidityMin: 40,
  humidityMax: 80,
  soilMoistureMin: 20,
  soilMoistureMax: 80,
};

export const loadThresholds = (): ThresholdSettings => ({
  tempMin: Number(localStorage.getItem('tempMin') || DEFAULT_THRESHOLDS.tempMin),
  tempMax: Number(localStorage.getItem('tempMax') || DEFAULT_THRESHOLDS.tempMax),
  humidityMin: Number(localStorage.getItem('humidityMin') || DEFAULT_THRESHOLDS.humidityMin),
  humidityMax: Number(localStorage.getItem('humidityMax') || DEFAULT_THRESHOLDS.humidityMax),
  soilMoistureMin: Number(localStorage.getItem('soilMoistureMin') || DEFAULT_THRESHOLDS.soilMoistureMin),
  soilMoistureMax: Number(localStorage.getItem('soilMoistureMax') || DEFAULT_THRESHOLDS.soilMoistureMax),
});

export const saveThresholds = (thresholds: ThresholdSettings): void => {
  Object.entries(thresholds).forEach(([key, value]) => {
    localStorage.setItem(key, value.toString());
  });
};

export const updateThreshold = (key: keyof ThresholdSettings, value: string): Partial<ThresholdSettings> => {
  const numValue = Number(value);
  if (isNaN(numValue)) return {};
  return { [key]: numValue };
};
