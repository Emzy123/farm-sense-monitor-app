import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const seamApiKey = Deno.env.get('SEAM_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, deviceId, sensorData } = await req.json();
    
    if (!seamApiKey) {
      throw new Error('Seam API key not configured');
    }

    console.log('Seam IoT operation:', action, 'for device:', deviceId);

    const seamHeaders = {
      'Authorization': `Bearer ${seamApiKey}`,
      'Content-Type': 'application/json',
    };

    let result;

    switch (action) {
      case 'discover_devices':
        // Discover available IoT devices
        const devicesResponse = await fetch('https://connect.getseam.com/devices/list', {
          method: 'POST',
          headers: seamHeaders,
          body: JSON.stringify({})
        });
        
        if (!devicesResponse.ok) {
          throw new Error(`Seam API error: ${devicesResponse.status}`);
        }
        
        const devicesData = await devicesResponse.json();
        result = {
          devices: devicesData.devices?.map((device: any) => ({
            id: device.device_id,
            name: device.display_name || device.device_type,
            type: device.device_type,
            connected: device.is_managed,
            capabilities: device.capabilities_supported || []
          })) || []
        };
        break;

      case 'control_irrigation':
        // Control irrigation system
        if (!deviceId) {
          throw new Error('Device ID required for irrigation control');
        }

        const irrigationCommand = sensorData?.soilMoisture < 30 ? 'on' : 'off';
        
        const controlResponse = await fetch('https://connect.getseam.com/thermostats/cool', {
          method: 'POST',
          headers: seamHeaders,
          body: JSON.stringify({
            device_id: deviceId,
            cooling_set_point_celsius: irrigationCommand === 'on' ? 20 : 25
          })
        });

        result = {
          action: 'irrigation_control',
          device_id: deviceId,
          command: irrigationCommand,
          status: controlResponse.ok ? 'success' : 'failed',
          reason: `Soil moisture: ${sensorData?.soilMoisture}%`
        };
        break;

      case 'get_device_status':
        // Get device status
        if (!deviceId) {
          throw new Error('Device ID required for status check');
        }

        const statusResponse = await fetch('https://connect.getseam.com/devices/get', {
          method: 'POST',
          headers: seamHeaders,
          body: JSON.stringify({
            device_id: deviceId
          })
        });

        if (!statusResponse.ok) {
          throw new Error(`Failed to get device status: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        result = {
          device_id: deviceId,
          status: statusData.device?.is_managed ? 'online' : 'offline',
          properties: statusData.device?.properties || {},
          last_seen: statusData.device?.last_seen_at || null
        };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log('Seam IoT operation completed successfully');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Seam IoT error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Seam IoT operation failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});