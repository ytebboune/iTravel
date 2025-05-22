import { Stack } from 'expo-router'
import { ThemeProvider } from '../providers/theme-provider'
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import { Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope'
import { SplashScreen } from 'expo-router'
import { MontserratAlternates_700Bold } from '@expo-google-fonts/montserrat-alternates'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Manrope-Bold': Manrope_700Bold,
    'Manrope-ExtraBold': Manrope_800ExtraBold,
    'MontserratAlternates-Bold': MontserratAlternates_700Bold,
  })
  if (!fontsLoaded) {
    SplashScreen.preventAutoHideAsync()
    return null
  } else {
    SplashScreen.hideAsync()
  }
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
} 