import { View, Text, ScrollView } from 'react-native';

export default function Calendar() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-3xl font-bold text-text mb-4">Calendar</Text>
        
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">Upcoming Events</Text>
          <Text className="text-gray-600">
            Your travel calendar will appear here
          </Text>
        </View>

        <View className="bg-white rounded-lg p-4">
          <Text className="text-lg font-semibold mb-2">Past Trips</Text>
          <Text className="text-gray-600">
            Your past trips will be listed here
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 