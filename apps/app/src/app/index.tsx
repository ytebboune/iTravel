import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAccessToken } from '../services/authService';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await getAccessToken();
        setIsAuthenticated(!!accessToken);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return null;
  }

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/login"} />;
} 