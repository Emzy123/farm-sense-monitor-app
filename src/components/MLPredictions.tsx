
import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Brain } from 'lucide-react';
import { SensorData } from '@/hooks/useFarmData';

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
}

const MLPredictions: React.FC<MLPredictionsProps> = ({ currentData, historicalData }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  const generatePredictions = () => {
    setLoading(true);
    
    // Simulate ML predictions based on current conditions
    const newPredictions: Prediction[] = [];
    
    // Soil moisture prediction
    if (currentData.soilMoisture < 30) {
      newPredictions.push({
        type: 'irrigation',
        confidence: 0.85,
        recommendation: 'Irrigation recommended within 24 hours. Soil moisture is below optimal range.',
        timeframe: '24 hours',
        priority: 'high'
      });
    }
    
    // Temperature-based predictions
    if (currentData.temperature > 32) {
      newPredictions.push({
        type: 'pest_control',
        confidence: 0.72,
        recommendation: 'High temperature may increase pest activity. Monitor for aphids and spider mites.',
        timeframe: '3-5 days',
        priority: 'medium'
      });
    }
    
    // Humidity-based predictions
    if (currentData.humidity > 80) {
      newPredictions.push({
        type: 'pest_control',
        confidence: 0.68,
        recommendation: 'High humidity increases fungal disease risk. Improve ventilation if possible.',
        timeframe: '2-3 days',
        priority: 'medium'
      });
    }
    
    // Growth optimization
    if (currentData.temperature >= 20 && currentData.temperature <= 25 && 
        currentData.humidity >= 50 && currentData.humidity <= 70 &&
        currentData.soilMoisture >= 40) {
      newPredictions.push({
        type: 'fertilization',
        confidence: 0.79,
        recommendation: 'Optimal conditions for nutrient uptake. Consider applying fertilizer for maximum growth.',
        timeframe: '1-2 days',
        priority: 'low'
      });
    }
    
    setPredictions(newPredictions);
    setLoading(false);
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
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">AI Predictions & Recommendations</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Analyzing data...</p>
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
      
      <button
        onClick={generatePredictions}
        className="w-full mt-4 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
      >
        Refresh Predictions
      </button>
    </div>
  );
};

export default MLPredictions;
