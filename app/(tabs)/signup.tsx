import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import SignupContainer from '../../components/SignupContainer';
import ThemedView from '../../components/ThemedView';

export default function SignupScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Sign Up', headerShown: false }} />
      <SignupContainer />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});