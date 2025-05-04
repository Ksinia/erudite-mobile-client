import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import RoomContainer from '@/components/RoomContainer';
import GameContainer from '@/components/GameContainer';
import { RootState } from '@/reducer';
import { fetchGame } from '@/thunkActions/game';
import { addGameToSocket, removeGameFromSocket } from "@/reducer/outgoingMessages";

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = parseInt(id as string, 10);
  const dispatch = useDispatch();
  
  // Get game state to determine which container to use
  const games = useSelector((state: RootState) => state.games);
  const lobby = useSelector((state: RootState) => state.lobby);
  const user = useSelector((state: RootState) => state.user);
  const socketConnected = useSelector((state: RootState) => state.socketConnectionState);
  
  // Get the game from state - either from lobby or games reducer
  const game = games[gameId] || (Array.isArray(lobby) ? lobby.find(g => g.id === gameId) : null);
  
  // Fetch game data when component mounts or parameters change
  useEffect(() => {
    // Fetch game data if we don't have it yet or if the user changes
    const jwt = user ? user.jwt : null;
    dispatch(fetchGame(gameId, jwt));
    
    // Add game to socket monitoring
    if (socketConnected) {
      dispatch(addGameToSocket(gameId));
    }
    
    // Clean up when unmounting
    return () => {
      dispatch(removeGameFromSocket(gameId));
    };
  }, [gameId, user, socketConnected, dispatch]);
  
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