import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import RoomContainer from '@/components/RoomContainer';
import GameContainer from '@/components/GameContainer';
import { RootState } from '@/reducer';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = parseInt(id as string, 10);
  
  // Get game state to determine which container to use
  const games = useSelector((state: RootState) => state.games);
  const lobby = useSelector((state: RootState) => state.lobby);
  
  // Get the game from state - either from lobby or games reducer
  const game = games[gameId] || (Array.isArray(lobby) ? lobby.find(g => g.id === gameId) : null);
  
  // Determine which container to render based on game phase
  const shouldRenderGameContainer = 
    game && 
    (game.phase === 'turn' || 
     game.phase === 'validation' || 
     game.phase === 'finished');
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {shouldRenderGameContainer ? (
          <GameContainer gameId={gameId} />
        ) : (
          <RoomContainer gameId={gameId} />
        )}
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