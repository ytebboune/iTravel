import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getProfile } from '../../services/api';
import { setTokens, getAccessToken, getRefreshToken, refreshToken } from '../../services/authService';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokens, setTokensState] = useState({ access: '', refresh: '' });

  const fetchProfile = async () => {
    setError('');
    setLoading(true);
    try {
      // Vérifier les tokens avant la requête
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();
      setTokensState({ access: accessToken || '', refresh: refreshToken || '' });
      
      console.log('Fetching profile with tokens:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });

      const data = await getProfile();
      setProfile(data);
    } catch (e: any) {
      console.error('Profile fetch error:', e);
      setError(e.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Pour tester le refresh : on corrompt le accessToken
  const breakAccessToken = async () => {
    console.log('Breaking access token...');
    try {
      // On garde le refresh token valide mais on corrompt l'access token
      const currentRefreshToken = await getRefreshToken();
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }
      await setTokens('FAUX_TOKEN', currentRefreshToken);
      console.log('Access token set to invalid value, keeping refresh token');
      fetchProfile();
    } catch (error) {
      console.error('Error breaking access token:', error);
      setError('Failed to test refresh token');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil utilisateur</Text>
      {loading && <Text>Chargement...</Text>}
      {error ? <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text> : null}
      {profile && !loading && (
        <View style={styles.card}>
          <Text style={styles.label}>Nom d'utilisateur :</Text>
          <Text style={styles.value}>{profile.username}</Text>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>
      )}
      <View style={styles.debugInfo}>
        <Text style={styles.debugTitle}>Debug Info:</Text>
        <Text>Access Token: {tokens.access ? 'Present' : 'Missing'}</Text>
        <Text>Refresh Token: {tokens.refresh ? 'Present' : 'Missing'}</Text>
      </View>
      <Button title="Forcer 401 (tester refresh)" onPress={breakAccessToken} color="#E53935" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#1976D2',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    width: 280,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#222E3A',
    marginTop: 8,
  },
  value: {
    color: '#1976D2',
    marginBottom: 4,
  },
  debugInfo: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: 280,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
}); 