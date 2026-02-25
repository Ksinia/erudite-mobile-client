import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import store from "@/store";
import { Provider } from "react-redux";
import SocketInitializer from '@/components/SocketInitializer';
import NotificationHandler from '@/components/NotificationHandler';
import NotificationPermissionModal from '@/components/NotificationPermissionModal';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {/* Initialize socket connections and notifications */}
            <SocketInitializer />
            <NotificationHandler />
            <NotificationPermissionModal />
            <SafeAreaView style={styles.safeArea}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </SafeAreaView>
          </ThemeProvider>
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}
