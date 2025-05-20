import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '../../../components/ui/button/button';

export default function Trips() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-3xl font-bold text-text mb-4">My Trips</Text>
        
        <Button variant="primary" className="mb-6">
          Create New Trip
        </Button>

        <View className="space-y-4">
          {/* Example trip card */}
          <View className="bg-white rounded-lg p-4">
            <Text className="text-xl font-semibold mb-2">Paris, France</Text>
            <Text className="text-gray-600 mb-2">June 15 - June 22, 2024</Text>
            <View className="flex-row justify-between items-center mt-4">
              <TouchableOpacity>
                <Text className="text-primary">View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-primary">Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add more trip cards here */}
        </View>
      </View>
    </ScrollView>
  );
} 