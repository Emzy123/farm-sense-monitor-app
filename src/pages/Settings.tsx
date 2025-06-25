
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useFarmData } from '@/hooks/useFarmData';
import { User, LogOut, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { isOnline, refreshData, isRefreshing } = useFarmData();
  const { toast } = useToast();

  // Threshold settings
  const [tempMin, setTempMin] = useState('15');
  const [tempMax, setTempMax] = useState('35');
  const [humidityMin, setHumidityMin] = useState('40');
  const [humidityMax, setHumidityMax] = useState('80');
  const [soilMin, setSoilMin] = useState('20');
  const [soilMax, setSoilMax] = useState('80');

  const handleSaveThresholds = () => {
    const thresholds = {
      temperature: { min: parseFloat(tempMin), max: parseFloat(tempMax) },
      humidity: { min: parseFloat(humidityMin), max: parseFloat(humidityMax) },
      soilMoisture: { min: parseFloat(soilMin), max: parseFloat(soilMax) },
    };
    
    localStorage.setItem('farmMonitorThresholds', JSON.stringify(thresholds));
    toast({
      title: "Settings Saved",
      description: "Your alert thresholds have been updated.",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isOnline={isOnline} onRefresh={refreshData} isRefreshing={isRefreshing} />
      
      <main className="p-4 pb-20 space-y-6">
        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Name</Label>
                <p className="text-lg font-semibold">{user?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Farm Name</Label>
                <p className="text-lg font-semibold">{user?.farmName}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Email</Label>
              <p className="text-lg font-semibold">{user?.email}</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="w-full mt-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </CardContent>
        </Card>

        {/* Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Temperature */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Temperature (°C)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tempMin" className="text-sm">Minimum</Label>
                  <Input
                    id="tempMin"
                    type="number"
                    value={tempMin}
                    onChange={(e) => setTempMin(e.target.value)}
                    placeholder="15"
                  />
                </div>
                <div>
                  <Label htmlFor="tempMax" className="text-sm">Maximum</Label>
                  <Input
                    id="tempMax"
                    type="number"
                    value={tempMax}
                    onChange={(e) => setTempMax(e.target.value)}
                    placeholder="35"
                  />
                </div>
              </div>
            </div>

            {/* Humidity */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Humidity (%)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="humidityMin" className="text-sm">Minimum</Label>
                  <Input
                    id="humidityMin"
                    type="number"
                    value={humidityMin}
                    onChange={(e) => setHumidityMin(e.target.value)}
                    placeholder="40"
                  />
                </div>
                <div>
                  <Label htmlFor="humidityMax" className="text-sm">Maximum</Label>
                  <Input
                    id="humidityMax"
                    type="number"
                    value={humidityMax}
                    onChange={(e) => setHumidityMax(e.target.value)}
                    placeholder="80"
                  />
                </div>
              </div>
            </div>

            {/* Soil Moisture */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Soil Moisture (%)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="soilMin" className="text-sm">Minimum</Label>
                  <Input
                    id="soilMin"
                    type="number"
                    value={soilMin}
                    onChange={(e) => setSoilMin(e.target.value)}
                    placeholder="20"
                  />
                </div>
                <div>
                  <Label htmlFor="soilMax" className="text-sm">Maximum</Label>
                  <Input
                    id="soilMax"
                    type="number"
                    value={soilMax}
                    onChange={(e) => setSoilMax(e.target.value)}
                    placeholder="80"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSaveThresholds} className="w-full bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Thresholds
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
