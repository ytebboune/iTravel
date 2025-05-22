import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '../../../components/ui/button/button';

export default function Profile() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-3xl font-bold text-text mb-4">Profile</Text>
        
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">Personal Information</Text>
          <Text className="text-gray-600 mb-4">John Doe</Text>
          <Text className="text-gray-600 mb-4">john.doe@example.com</Text>
        </View>

        <View className="space-y-4">
          <Button variant="secondary">
            Edit Profile
          </Button>
          <Button variant="secondary">
            Change Password
          </Button>
          <Button variant="secondary">
            Notification Settings
          </Button>
          <Button variant="secondary" className="mt-4">
            Sign Out
          </Button>
        </View>
      </View>
    </ScrollView>
  );
} 