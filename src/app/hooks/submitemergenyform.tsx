import { useState } from 'react';

// Define the response type from the API
interface SOSResponse {
  success: boolean;
  message: string;
  ambulanceId?: string;
  requestId?: string;
  estimatedTime?: number; // in minutes
  ambulanceLocation?: {
    lat: number;
    lng: number;
  };
}

// Define the hook return type
interface UseSOSSubmissionReturn {
  submitSOSRequest: (formData: FormData) => Promise<SOSResponse>;
  loading: boolean;
  error: string | null;
  resetError: () => void;
}

/**
 * Hook for submitting SOS emergency requests to the API
 * 
 * @returns {UseSOSSubmissionReturn} Functions and state for submitting SOS requests
 */
export function useSOSSubmission(): UseSOSSubmissionReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submit an SOS request to the API
   * 
   * @param {FormData} formData - The form data to submit (name, phone, condition, location, image)
   * @returns {Promise<SOSResponse>} The API response
   */
  const submitSOSRequest = async (formData: FormData): Promise<SOSResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("https://rapid8-backend.onrender.com/api/sos", {
        method: "POST",
        body: formData,
        // No need to set Content-Type header when using FormData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! Status: ${response.status}`);
      }
      
      const data: SOSResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Unknown error occurred');
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit SOS request';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Reset the error state
   */
  const resetError = () => {
    setError(null);
  };

  return {
    submitSOSRequest,
    loading,
    error,
    resetError
  };
}