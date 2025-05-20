import { View, Text, TouchableOpacity } from 'react-native';
import { Input } from '../../../components/ui/input/input';
import { Button } from '../../../components/ui/button/button';

export default function Login() {
  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-text mb-4">Login</Text>
        <Text className="text-base text-gray-600 mb-6">
          Welcome back! Please enter your details.
        </Text>
        
        <View className="space-y-4">
          <Input
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Password"
            secureTextEntry
          />
          
          <Button variant="primary" className="mt-6">
            Sign In
          </Button>
          
          <TouchableOpacity className="mt-4">
            <Text className="text-primary text-center">
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 