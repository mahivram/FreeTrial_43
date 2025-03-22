import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';
import { StatusBar } from 'react-native';
import { semantic } from './theme/colors';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar
        backgroundColor={semantic.background.paper}
        barStyle="dark-content"
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
} 