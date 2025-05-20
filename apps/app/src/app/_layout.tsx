import { Stack } from 'expo-router'
import { ThemeProvider } from '../providers/theme-provider'
import { QueryProvider } from '../providers/query-provider'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '$background',
            },
          }}
        />
      </QueryProvider>
    </ThemeProvider>
  )
} 