import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import RoomContainer from '@/components/RoomContainer';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = parseInt(id as string, 10);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <RoomContainer gameId={gameId} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});