import { View } from 'react-native';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1">
      {children}
    </View>
  );
} 