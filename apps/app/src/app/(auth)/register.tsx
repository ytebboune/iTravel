import { View, Text, TouchableOpacity } from 'react-native';
import { Input } from '../../../components/ui/input/input';
import { Button } from '../../../components/ui/button/button';

export default function Register() {
  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-text mb-4">Create Account</Text>
        <Text className="text-base text-gray-600 mb-6">
          Join us and start planning your next adventure
        </Text>
        
        <View className="space-y-4">
          <Input
            placeholder="Full Name"
            autoCapitalize="words"
          />
          <Input
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Password"
            secureTextEntry
          />
          <Input
            placeholder="Confirm Password"
            secureTextEntry
          />
          
          <Button variant="primary" className="mt-6">
            Create Account
          </Button>
          
          <TouchableOpacity className="mt-4">
            <Text className="text-primary text-center">
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 