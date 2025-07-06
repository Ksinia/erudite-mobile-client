import React from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSelector } from 'react-redux';
import RoomContainer from '@/components/RoomContainer';
import GameContainer from '@/components/GameContainer';
import { RootState } from '@/reducer';
import { fetchGame } from '@/thunkActions/game';
import { addGameToSocket, removeGameFromSocket } from "@/reducer/outgoingMessages";
import TranslationContainer from '@/components/Translation/TranslationContainer';
import { useAppDispatch } from "@/hooks/redux";

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = id ? parseInt(id as string, 10) : 0;
  const dispatch = useAppDispatch();

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {shouldRenderGameContainer ? (
          <GameContainer game={game} />
        ) : (
          <RoomContainer game={game} />
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