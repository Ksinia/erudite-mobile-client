import React, { useRef, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator, Text, ScrollView, AppState, AppStateStatus } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSelector } from 'react-redux';
import RoomContainer from '@/components/RoomContainer';
import GameContainer from '@/components/GameContainer';
import Chat from '@/components/Chat';
import { RootState } from '@/reducer';
import { fetchGame } from '@/thunkActions/game';
import { addGameToSocket, removeGameFromSocket } from "@/reducer/outgoingMessages";
import TranslationContainer from '@/components/Translation/TranslationContainer';
import { useAppDispatch } from "@/hooks/redux";

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = id ? parseInt(id as string, 10) : 0;
  const dispatch = useAppDispatch();
  const appState = useRef(AppState.currentState);

  const games = useSelector((state: RootState) => state.games);
  const user = useSelector((state: RootState) => state.user);
  const socketConnected = useSelector((state: RootState) => state.socketConnectionState);

  useFocusEffect(
    // To avoid running the effect too often, it's important to wrap the callback in useCallback before passing it to useFocusEffect
    React.useCallback(() => {
      console.log('useFocusEffect - gameId:', gameId);
      dispatch(fetchGame(gameId, user?.jwt ?? null));
      socketConnected && dispatch(addGameToSocket(gameId));

      return () => {
        console.log('GameScreen blurred - unsubscribing from game:', gameId);
        dispatch(removeGameFromSocket(gameId));
      };
    }, [gameId, dispatch, socketConnected, user?.jwt])
  )

  // Handle app state changes for game socket subscription
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('GameScreen - App state changing from', appState.current, 'to', nextAppState);
      
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground - reconnect to game socket
        console.log('GameScreen - App foregrounded, reconnecting to game:', gameId);
        if (socketConnected) {
          dispatch(addGameToSocket(gameId));
        }
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App has gone to the background - disconnect from game socket
        console.log('GameScreen - App backgrounded, disconnecting from game:', gameId);
        dispatch(removeGameFromSocket(gameId));
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [gameId, socketConnected, dispatch]);

  const game = games[gameId]

  if (!game) {
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

  const shouldRenderGameContainer =
    game.phase === 'turn' ||
    game.phase === 'validation' ||
    game.phase === 'finished';
  
  const isPlayerInGame = user && game.users.some(player => player.id === user.id);
  const shouldShowChat = game.phase === 'waiting' || game.phase === 'ready' || isPlayerInGame;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.gameArea}>
          {shouldRenderGameContainer ? (
            <GameContainer game={game} />
          ) : (
            <RoomContainer game={game} />
          )}
        </View>
        {shouldShowChat && (
          <View style={styles.chatArea}>
            <Chat 
              players={game.users}
              gamePhase={game.phase}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameArea: {
  },
  chatArea: {
    height: 400,
  },
});