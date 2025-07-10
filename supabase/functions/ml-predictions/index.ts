import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sensorData, weatherData, historicalData } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating ML predictions for farm data');

    const prompt = `
    As an AI agricultural expert, analyze the following data and provide farming recommendations:

    Current Sensor Data:
    - Temperature: ${sensorData.temperature}°C
    - Humidity: ${sensorData.humidity}%
    - Soil Moisture: ${sensorData.soilMoisture}%

    Current Weather:
    - Condition: ${weatherData?.current?.condition || 'Unknown'}
    - Temperature: ${weatherData?.current?.temperature || 'N/A'}°C
    - Humidity: ${weatherData?.current?.humidity || 'N/A'}%
    - UV Index: ${weatherData?.current?.uvIndex || 'N/A'}

    Please provide:
    1. Irrigation recommendations (scale 1-10, 10 being urgent)
    2. Plant health assessment
    3. Risk factors and alerts
    4. Optimal growing conditions advice
    5. 3-day forecast impact on farming

    Respond in JSON format with specific, actionable insights.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert agricultural AI that provides precise, actionable farming recommendations based on sensor and weather data. Always respond in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;

    // Try to parse as JSON, fallback to structured format if needed
    let predictions;
    try {
      predictions = JSON.parse(aiResponse);
    } catch {
      // Fallback structured predictions if AI doesn't return valid JSON
      predictions = {
        irrigationScore: Math.max(1, Math.min(10, Math.round((100 - sensorData.soilMoisture) / 10))),
        plantHealth: sensorData.soilMoisture > 30 ? 'Good' : 'Needs Attention',
        riskFactors: sensorData.soilMoisture < 20 ? ['Low soil moisture', 'Drought stress risk'] : [],
        recommendations: [
          sensorData.soilMoisture < 30 ? 'Increase irrigation frequency' : 'Maintain current irrigation',
          sensorData.temperature > 30 ? 'Provide shade during peak hours' : 'Monitor temperature',
          'Check soil pH levels'
        ],
        forecastImpact: weatherData?.forecast?.[0] ? `${weatherData.forecast[0].condition} expected` : 'Monitor weather changes',
        aiInsight: aiResponse
      };
    }

    console.log('ML predictions generated successfully');

    return new Response(JSON.stringify(predictions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('ML predictions error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate predictions' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});