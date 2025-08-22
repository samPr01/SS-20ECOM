import { useAuth } from './useAuth';
import { API_BASE_URL } from '../src/config/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

export const useAuthApi = () => {
  const { token, logout } = useAuth();

  const apiCall = async (url: string, options: ApiOptions = {}) => {
    const { method = 'GET', headers = {}, body } = options;

    // Ensure URL starts with API_BASE_URL if it's a relative path
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    // Add authorization header if token exists
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(fullUrl, config);

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        logout();
        throw new Error('Authentication required. Please log in again.');
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  return {
    get: (url: string, headers?: Record<string, string>) => 
      apiCall(url, { method: 'GET', headers }),
    
    post: (url: string, body: any, headers?: Record<string, string>) => 
      apiCall(url, { method: 'POST', body, headers }),
    
    put: (url: string, body: any, headers?: Record<string, string>) => 
      apiCall(url, { method: 'PUT', body, headers }),
    
    delete: (url: string, headers?: Record<string, string>) => 
      apiCall(url, { method: 'DELETE', headers }),
    
    patch: (url: string, body: any, headers?: Record<string, string>) => 
      apiCall(url, { method: 'PATCH', body, headers }),
  };
};
