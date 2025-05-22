import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getProfile } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (e: any) {
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
    await AsyncStorage.setItem('accessToken', 'FAUX_TOKEN');
    fetchProfile();
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
}); 