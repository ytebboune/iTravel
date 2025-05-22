import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-3xl font-bold text-text mb-4">Home</Text>
        <Text className="text-base text-gray-600 mb-6">
          Welcome to your travel dashboard
        </Text>
        <TouchableOpacity className="bg-primary px-6 py-3 rounded-lg mb-4">
          <Text className="text-white font-semibold text-center">Start Planning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 