
import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

interface WeatherIntegrationProps {
  location: string;
  onWeatherUpdate: (weather: WeatherData) => void;
}

const WeatherIntegration: React.FC<WeatherIntegrationProps> = ({ location, onWeatherUpdate }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('weatherApiKey') || '');

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('weather-api', {
        body: { location }
      });

      if (error) throw error;

      const weatherData: WeatherData = {
        temperature: data.current.temperature,
        humidity: data.current.humidity,
        windSpeed: data.current.windSpeed,
        condition: data.current.condition.toLowerCase(),
        forecast: data.forecast.map((day: any) => ({
          day: new Date(day.date).toLocaleDateString([], { weekday: 'short' }),
          high: day.maxTemp,
          low: day.minTemp,
          condition: day.condition.toLowerCase()
        }))
      };
      
      setWeather(weatherData);
      onWeatherUpdate(weatherData);
    } catch (error) {
      console.error('Weather fetch error:', error);
      // Fallback data if API fails
      const fallbackWeather: WeatherData = {
        temperature: 25,
        humidity: 60,
        windSpeed: 10,
        condition: 'sunny',
        forecast: Array.from({ length: 5 }, (_, i) => ({
          day: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString([], { weekday: 'short' }),
          high: 25,
          low: 15,
          condition: 'sunny'
        }))
      };
      setWeather(fallbackWeather);
      onWeatherUpdate(fallbackWeather);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000); // Every 10 minutes
    return () => clearInterval(interval);
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
      default: return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Weather Integration</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      </div>
      
      {weather ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-red-500" />
              <span>{weather.temperature.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <span>{weather.humidity.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-gray-500" />
              <span>{weather.windSpeed.toFixed(1)} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              {getWeatherIcon(weather.condition)}
              <span className="capitalize">{weather.condition}</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">5-Day Forecast</h3>
            <div className="grid grid-cols-5 gap-2">
              {weather.forecast.map((day, index) => (
                <div key={index} className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs font-medium">{day.day}</div>
                  <div className="my-1">{getWeatherIcon(day.condition)}</div>
                  <div className="text-xs">
                    <div>{day.high.toFixed(0)}°</div>
                    <div className="text-gray-500">{day.low.toFixed(0)}°</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-4">Loading weather data...</div>
      ) : null}
    </div>
  );
};

export default WeatherIntegration;
