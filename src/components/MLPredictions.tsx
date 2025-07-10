
import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Brain, Droplets, Loader } from 'lucide-react';
import { SensorData } from '@/hooks/useFarmData';
import { supabase } from '@/integrations/supabase/client';

interface Prediction {
  type: 'irrigation' | 'fertilization' | 'harvest' | 'pest_control';
  confidence: number;
  recommendation: string;
  timeframe: string;
  priority: 'low' | 'medium' | 'high';
}

interface MLPredictionsProps {
  currentData: SensorData;
  historicalData: SensorData[];
  weatherData?: any;
}

const MLPredictions: React.FC<MLPredictionsProps> = ({ currentData, historicalData, weatherData }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generatePredictions = async () => {
    setLoading(true);
    
    try {
      // Get AI predictions from OpenAI
      const { data, error } = await supabase.functions.invoke('ml-predictions', {
        body: { 
          sensorData: currentData, 
          weatherData,
          historicalData
        }
      });

      if (error) throw error;

      // Process AI response and create structured predictions
      const newPredictions: Prediction[] = [];
      
      // Convert AI insights to structured predictions
      if (data.irrigationScore && data.irrigationScore > 7) {
        newPredictions.push({
          type: 'irrigation',
          confidence: 0.9,
          recommendation: `Irrigation urgently needed. Score: ${data.irrigationScore}/10`,
          timeframe: '6-12 hours',
          priority: 'high'
        });
      } else if (data.irrigationScore && data.irrigationScore > 4) {
        newPredictions.push({
          type: 'irrigation',
          confidence: 0.7,
          recommendation: `Consider irrigation soon. Score: ${data.irrigationScore}/10`,
          timeframe: '24-48 hours',
          priority: 'medium'
        });
      }

      // Add risk factor predictions
      if (data.riskFactors && data.riskFactors.length > 0) {
        data.riskFactors.forEach((risk: string) => {
          newPredictions.push({
            type: 'pest_control',
            confidence: 0.75,
            recommendation: risk,
            timeframe: '1-3 days',
            priority: 'medium'
          });
        });
      }

      // Add recommendations as predictions
      if (data.recommendations && data.recommendations.length > 0) {
        data.recommendations.forEach((rec: string) => {
          newPredictions.push({
            type: 'fertilization',
            confidence: 0.8,
            recommendation: rec,
            timeframe: '2-5 days',
            priority: 'low'
          });
        });
      }

      setPredictions(newPredictions);
      setAiInsights(data.aiInsight || '');
      
    } catch (error) {
      console.error('AI predictions error:', error);
      
      // Fallback to rule-based predictions
      const fallbackPredictions: Prediction[] = [];
      
      if (currentData.soilMoisture < 30) {
        fallbackPredictions.push({
          type: 'irrigation',
          confidence: 0.85,
          recommendation: 'Irrigation recommended within 24 hours. Soil moisture is below optimal range.',
          timeframe: '24 hours',
          priority: 'high'
        });
      }
      
      if (currentData.temperature > 32) {
        fallbackPredictions.push({
          type: 'pest_control',
          confidence: 0.72,
          recommendation: 'High temperature may increase pest activity. Monitor for aphids and spider mites.',
          timeframe: '3-5 days',
          priority: 'medium'
        });
      }
      
      setPredictions(fallbackPredictions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePredictions();
  }, [currentData]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'irrigation': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'fertilization': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'harvest': return <CheckCircle className="w-5 h-5 text-orange-500" />;
      case 'pest_control': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Brain className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">AI Predictions & Recommendations</h2>
        </div>
        {!loading && (
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Powered by OpenAI
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <Loader className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          <p className="text-gray-600 mt-2">AI analyzing farm conditions...</p>
        </div>
      ) : predictions.length > 0 ? (
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                {getTypeIcon(prediction.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium capitalize">{prediction.type.replace('_', ' ')}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(prediction.priority)}`}>
                      {prediction.priority} priority
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(prediction.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{prediction.recommendation}</p>
                  <p className="text-xs text-gray-500">Timeframe: {prediction.timeframe}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No predictions available. Continue monitoring for insights.</p>
        </div>
      )}
      
      {aiInsights && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">AI Expert Analysis</h4>
          <p className="text-sm text-blue-700">{aiInsights}</p>
        </div>
      )}
      
      <button
        onClick={generatePredictions}
        disabled={loading}
        className="w-full mt-4 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Generating AI Insights...' : 'Refresh AI Predictions'}
      </button>
    </div>
  );
};

export default MLPredictions;
