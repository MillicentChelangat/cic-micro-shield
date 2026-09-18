import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';


function RootLayoutNav() {
  const colors = useColors();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style= "light" />
      <Stack screenOptions={{ headerShown: false, headerBackTitle: 'Back' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cover" />
        <Stack.Screen name="policy/[id]" />
        <Stack.Screen name="claim/new" />
        <Stack.Screen name="claim/[id]" />
      </Stack>
    </View>
  );
}

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  useEffect(() => { if (fontsLoaded || fontError) SplashScreen.hideAsync(); }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) return null;
  return <SafeAreaProvider><ErrorBoundary><QueryClientProvider client={queryClient}><GestureHandlerRootView style={{ flex: 1 }}><KeyboardProvider><AppProvider><RootLayoutNav /></AppProvider></KeyboardProvider></GestureHandlerRootView></QueryClientProvider></ErrorBoundary></SafeAreaProvider>;
}
