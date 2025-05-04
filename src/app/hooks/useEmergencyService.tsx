import { useState } from 'react';

interface EmergencyResponse {
  success: boolean;
  ambulanceLocation: {
    lat: number;
    lng: number;
  };
  estimatedTime: number; // in minutes
  ambulanceId: string;
  requestId: string;
}

export function useEmergencyService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulates sending an emergency request and getting ambulance coordinates
  const sendEmergencyRequest = async (formData: FormData): Promise<EmergencyResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get the user's coordinates from the form data
      const userLat = parseFloat(formData.get('latitude') as string);
      const userLng = parseFloat(formData.get('longitude') as string);
      
      // In a real implementation, we'd make an actual API call to the server
      // For now, we'll just simulate a response
      
      // Simulate API response - using the ambulance ID from our example
      const response: EmergencyResponse = {
        success: true,
        ambulanceLocation: {
          // These would normally come from the server
          lat: 12.9716, // From the API response
          lng: 77.5946  // From the API response
        },
        estimatedTime: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
        ambulanceId: "68161ba466578384f4b229d1", // The ID from our example
        requestId: `ER-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };
      
      return response;
    } catch (err) {
      setError('Failed to process emergency request');
      throw new Error('Emergency request failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    sendEmergencyRequest,
    loading,
    error
  };
}
