import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import RoomContainer from '@/components/RoomContainer';
import GameContainer from '@/components/GameContainer';
import { RootState } from '@/reducer';
import { fetchGame } from '@/thunkActions/game';
import { addGameToSocket, removeGameFromSocket, enterLobby } from "@/reducer/outgoingMessages";
import TranslationContainer from '@/components/Translation/TranslationContainer';

export default function GameScreen() {
  const [loading, setLoading] = useState(true);
  
  const { id } = useLocalSearchParams<{ id: string }>();
  // Ensure gameId is a valid number
  const gameId = id ? parseInt(id as string, 10) : 0;
  const isValidGameId = !isNaN(gameId) && gameId > 0;
  const dispatch = useDispatch();
  
  // Get game state to determine which container to use
  const games = useSelector((state: RootState) => state.games);
  const lobby = useSelector((state: RootState) => state.lobby);
  const user = useSelector((state: RootState) => state.user);
  const socketConnected = useSelector((state: RootState) => state.socketConnectionState);
  
  // Get the game from state - either from lobby or games reducer
  const game = games[gameId] || (Array.isArray(lobby) ? lobby.find(g => g.id === gameId) : null);
  
  // Fetch game data and handle socket subscription
  useEffect(() => {
    // Only proceed if gameId is valid
    if (!isValidGameId) {
      setLoading(false);
      return;
    }

    // Fetch game data
    const jwt = user ? user.jwt : null;
    dispatch(fetchGame(gameId, jwt));
    
    // Add game to socket monitoring
    if (socketConnected) {
      console.log('Adding game to socket:', gameId);
      dispatch(addGameToSocket(gameId));
    } else {
      // If not connected yet, we'll rely on the socketConnected dependency
      // to trigger this effect again when connection is established
      console.log('Socket not connected yet, will add game later');
    }
    
    // Clean up when unmounting
    return () => {
      if (isValidGameId) {
        dispatch(removeGameFromSocket(gameId));
      }
      dispatch(enterLobby()); // Update lobby data when leaving game screen
    };
  }, [gameId, user, socketConnected, dispatch, isValidGameId]);
  
  // Separate effect to update loading state
  useEffect(() => {
    if (game) {
      setLoading(false);
    }
  }, [game]);
  
  // Determine which container to render based on game phase
  const shouldRenderGameContainer = 
    game && 
    (game.phase === 'turn' || 
     game.phase === 'validation' || 
     game.phase === 'finished');
  
  // Invalid game ID check
  if (!isValidGameId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, styles.center]}>
          <Text>
            <TranslationContainer translationKey="invalid_game_id" fallback="Invalid game ID" />
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Show loading state if we're still fetching data
  if (loading && !game) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, styles.center]}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={{ marginTop: 10 }}>
            <TranslationContainer translationKey="loading" />
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Show not found if there's no game after loading
  if (!loading && !game) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, styles.center]}>
          <Text>
            <TranslationContainer translationKey="game_not_found" />
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});