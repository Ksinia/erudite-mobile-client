import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyGamesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My games</Text>
      <Text>This screen is under development</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});