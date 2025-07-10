import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const weatherApiKey = Deno.env.get('WEATHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    
    if (!weatherApiKey) {
      throw new Error('Weather API key not configured');
    }

    console.log('Fetching weather data for location:', location);

    // Get current weather
    const currentResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}&aqi=yes`
    );

    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();

    // Get forecast
    const forecastResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${location}&days=7&aqi=yes`
    );

    const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;

    const weatherData = {
      current: {
        temperature: currentData.current.temp_c,
        humidity: currentData.current.humidity,
        condition: currentData.current.condition.text,
        windSpeed: currentData.current.wind_kph,
        pressure: currentData.current.pressure_mb,
        uvIndex: currentData.current.uv,
        feelLike: currentData.current.feelslike_c,
        visibility: currentData.current.vis_km,
        precipMm: currentData.current.precip_mm,
        cloudCover: currentData.current.cloud,
        airQuality: currentData.current.air_quality ? {
          co: currentData.current.air_quality.co,
          no2: currentData.current.air_quality.no2,
          o3: currentData.current.air_quality.o3,
          pm2_5: currentData.current.air_quality.pm2_5,
          pm10: currentData.current.air_quality.pm10
        } : null
      },
      location: {
        name: currentData.location.name,
        region: currentData.location.region,
        country: currentData.location.country,
        lat: currentData.location.lat,
        lon: currentData.location.lon
      },
      forecast: forecastData ? forecastData.forecast.forecastday.map((day: any) => ({
        date: day.date,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        condition: day.day.condition.text,
        chanceOfRain: day.day.daily_chance_of_rain,
        humidity: day.day.avghumidity,
        windSpeed: day.day.maxwind_kph
      })) : []
    };

    console.log('Weather data fetched successfully');

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Weather API error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch weather data' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});