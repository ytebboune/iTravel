import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import './global.css';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Poppins': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-text-primary">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Hero Section avec dégradé */}
      <View className="bg-primary/90 p-8 rounded-b-3xl">
        <View className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/40" />
        <View className="relative z-10">
          <Text className="text-4xl font-heading font-bold text-white mb-2">iTravel</Text>
          <Text className="text-lg text-white/90">Votre compagnon de voyage intelligent</Text>
        </View>
      </View>

      <View className="p-6 space-y-8">
        {/* Section Découverte */}
        <View className="space-y-4">
          <Text className="text-2xl font-heading font-bold text-text-primary">Découvrez</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
            {['Paris', 'Tokyo', 'New York', 'Bali'].map((city) => (
              <TouchableOpacity key={city} className="w-64 h-40 rounded-2xl overflow-hidden">
                <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <View className="absolute inset-0 bg-primary/20" />
                <View className="h-full justify-end p-4">
                  <Text className="text-xl font-heading font-bold text-white">{city}</Text>
                  <Text className="text-white/80">Explorez cette destination</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section Activités */}
        <View className="space-y-4">
          <Text className="text-2xl font-heading font-bold text-text-primary">Activités populaires</Text>
          <View className="space-y-4">
            {[
              { title: 'Visite guidée', location: 'Paris, France', price: '45€' },
              { title: 'Cours de cuisine', location: 'Tokyo, Japon', price: '65€' },
              { title: 'Randonnée', location: 'Bali, Indonésie', price: '35€' },
            ].map((activity, index) => (
              <View key={index} className="bg-surface p-4 rounded-2xl shadow-sm">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-heading text-text-primary">{activity.title}</Text>
                    <Text className="text-text-secondary">{activity.location}</Text>
                  </View>
                  <View className="bg-primary/10 px-3 py-1 rounded-lg">
                    <Text className="text-primary font-semibold">{activity.price}</Text>
                  </View>
                </View>
                <TouchableOpacity className="mt-4 bg-primary px-4 py-2 rounded-lg self-start">
                  <Text className="text-white font-semibold">Réserver</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Section Statistiques */}
        <View className="bg-surface p-6 rounded-2xl shadow-sm">
          <Text className="text-xl font-heading text-text-primary mb-4">Votre voyage en chiffres</Text>
          <View className="flex-row justify-between">
            {[
              { label: 'Destinations', value: '12' },
              { label: 'Activités', value: '45' },
              { label: 'Photos', value: '234' },
            ].map((stat, index) => (
              <View key={index} className="items-center">
                <Text className="text-3xl font-heading text-primary">{stat.value}</Text>
                <Text className="text-text-secondary">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section Prochain voyage */}
        <View className="space-y-4">
          <Text className="text-2xl font-heading font-bold text-text-primary">Prochain voyage</Text>
          <View className="bg-surface p-6 rounded-2xl shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-lg font-heading text-text-primary">Paris, France</Text>
                <Text className="text-text-secondary">15 - 22 Juin 2024</Text>
              </View>
              <View className="bg-accent/10 px-3 py-1 rounded-lg">
                <Text className="text-accent font-semibold">7 jours</Text>
              </View>
            </View>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-primary rounded-full" />
                <View className="h-0.5 flex-1 bg-primary/20 mx-2" />
                <View className="w-2 h-2 bg-primary rounded-full" />
                <View className="h-0.5 flex-1 bg-primary/20 mx-2" />
                <View className="w-2 h-2 bg-primary rounded-full" />
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Départ</Text>
                <Text className="text-text-secondary">En cours</Text>
                <Text className="text-text-secondary">Arrivée</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section Actions rapides */}
        <View className="space-y-4">
          <Text className="text-2xl font-heading font-bold text-text-primary">Actions rapides</Text>
          <View className="flex-row flex-wrap gap-4">
            <TouchableOpacity className="flex-1 bg-primary/10 p-4 rounded-xl items-center">
              <Text className="text-primary font-semibold">Nouveau voyage</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-secondary/10 p-4 rounded-xl items-center">
              <Text className="text-secondary font-semibold">Mes réservations</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-accent/10 p-4 rounded-xl items-center">
              <Text className="text-accent font-semibold">Explorer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 