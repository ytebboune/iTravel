import { Image } from 'expo-image';
import { Platform, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          className="h-[178px] w-[290px] absolute bottom-0 left-0"
        />
      }>
      <View className="flex-row items-center gap-2">
        <Text className="text-2xl font-bold text-text">Welcome!</Text>
        <HelloWave />
      </View>
      <View className="gap-2 mb-2">
        <Text className="text-xl font-semibold text-text">Step 1: Try it</Text>
        <Text className="text-text">
          Edit <Text className="font-semibold">app/(tabs)/index.tsx</Text> to see changes.
          Press{' '}
          <Text className="font-semibold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </Text>{' '}
          to open developer tools.
        </Text>
      </View>
      <View className="gap-2 mb-2">
        <Text className="text-xl font-semibold text-text">Step 2: Explore</Text>
        <Text className="text-text">
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </Text>
      </View>
      <View className="gap-2 mb-2">
        <Text className="text-xl font-semibold text-text">Step 3: Get a fresh start</Text>
        <Text className="text-text">
          {`When you're ready, run `}
          <Text className="font-semibold">npm run reset-project</Text> to get a fresh{' '}
          <Text className="font-semibold">app</Text> directory. This will move the current{' '}
          <Text className="font-semibold">app</Text> to{' '}
          <Text className="font-semibold">app-example</Text>.
        </Text>
      </View>
    </ParallaxScrollView>
  );
}
