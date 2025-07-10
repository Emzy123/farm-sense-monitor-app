import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const nasaApiKey = Deno.env.get('NASA_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, startDate, endDate } = await req.json();
    
    if (!nasaApiKey) {
      throw new Error('NASA API key not configured');
    }

    console.log('Fetching NASA soil data for coordinates:', latitude, longitude);

    // NASA POWER API for agricultural data
    const powerResponse = await fetch(
      `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M_MAX,T2M_MIN,RH2M,PRECTOTCORR,WS2M,ALLSKY_SFC_SW_DWN&community=AG&longitude=${longitude}&latitude=${latitude}&start=${startDate}&end=${endDate}&format=JSON&api_key=${nasaApiKey}`
    );

    if (!powerResponse.ok) {
      console.log('NASA POWER API unavailable, using alternative approach');
    }

    let powerData = null;
    if (powerResponse.ok) {
      powerData = await powerResponse.json();
    }

    // NASA Earth Imagery API for satellite data
    const earthResponse = await fetch(
      `https://api.nasa.gov/planetary/earth/imagery?lon=${longitude}&lat=${latitude}&date=${endDate}&dim=0.1&api_key=${nasaApiKey}`
    );

    let satelliteImage = null;
    if (earthResponse.ok) {
      satelliteImage = earthResponse.url;
    }

    // Compile soil and environmental data
    const soilData = {
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      climate: powerData ? {
        maxTemperature: powerData.properties?.parameter?.T2M_MAX || {},
        minTemperature: powerData.properties?.parameter?.T2M_MIN || {},
        humidity: powerData.properties?.parameter?.RH2M || {},
        precipitation: powerData.properties?.parameter?.PRECTOTCORR || {},
        windSpeed: powerData.properties?.parameter?.WS2M || {},
        solarRadiation: powerData.properties?.parameter?.ALLSKY_SFC_SW_DWN || {}
      } : null,
      satellite: {
        imageUrl: satelliteImage,
        date: endDate
      },
      analysis: {
        growingSeason: this.analyzeGrowingSeason(powerData),
        soilConditions: this.analyzeSoilConditions(powerData),
        recommendations: this.generateRecommendations(powerData)
      }
    };

    console.log('NASA soil data fetched successfully');

    return new Response(JSON.stringify(soilData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('NASA soil data error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch NASA soil data' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions
function analyzeGrowingSeason(powerData: any) {
  if (!powerData?.properties?.parameter?.T2M_MAX) {
    return 'Data unavailable - check coordinates and date range';
  }
  
  const temps = Object.values(powerData.properties.parameter.T2M_MAX);
  const avgTemp = temps.reduce((a: any, b: any) => a + b, 0) / temps.length;
  
  if (avgTemp > 25) return 'Excellent growing conditions';
  if (avgTemp > 15) return 'Good growing conditions';
  return 'Limited growing season';
}

function analyzeSoilConditions(powerData: any) {
  if (!powerData?.properties?.parameter) {
    return 'Unable to analyze - insufficient data';
  }
  
  const precipitation = Object.values(powerData.properties.parameter.PRECTOTCORR || {});
  const avgPrecip = precipitation.length > 0 ? 
    precipitation.reduce((a: any, b: any) => a + b, 0) / precipitation.length : 0;
  
  if (avgPrecip > 5) return 'Well-watered soil conditions';
  if (avgPrecip > 2) return 'Moderate soil moisture';
  return 'Dry soil conditions - irrigation recommended';
}

function generateRecommendations(powerData: any) {
  const recommendations = [];
  
  if (!powerData?.properties?.parameter) {
    return ['Install local weather monitoring', 'Consider soil testing', 'Implement irrigation system'];
  }
  
  const temps = Object.values(powerData.properties.parameter.T2M_MAX || {});
  const precipitation = Object.values(powerData.properties.parameter.PRECTOTCORR || {});
  
  const avgTemp = temps.length > 0 ? temps.reduce((a: any, b: any) => a + b, 0) / temps.length : 0;
  const avgPrecip = precipitation.length > 0 ? precipitation.reduce((a: any, b: any) => a + b, 0) / precipitation.length : 0;
  
  if (avgTemp > 30) recommendations.push('Consider heat-resistant crops');
  if (avgTemp < 10) recommendations.push('Use cold-season crops');
  if (avgPrecip < 2) recommendations.push('Increase irrigation frequency');
  if (avgPrecip > 8) recommendations.push('Ensure proper drainage');
  
  recommendations.push('Monitor soil pH levels');
  recommendations.push('Implement crop rotation');
  
  return recommendations;
}