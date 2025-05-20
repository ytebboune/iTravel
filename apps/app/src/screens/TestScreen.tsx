import { View, Text, TouchableOpacity } from 'react-native';

export function TestScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-text">Test Screen</Text>
      <TouchableOpacity className="mt-4 bg-primary px-4 py-2 rounded-lg">
        <Text className="text-white font-semibold">Test Button</Text>
      </TouchableOpacity>
    </View>
  );
} 