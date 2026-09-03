import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator, Text, ScrollView, AppState, AppStateStatus, Dimensions } from 'react-native';
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
import { clearNotificationNavigation } from '@/reducer/notificationNavigation';
import { setActiveGameScreen, clearActiveGameScreen, setChatVisible } from '@/reducer/activeGameScreen';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = id ? parseInt(id as string, 10) : 0;
  const dispatch = useAppDispatch();
  const appState = useRef(AppState.currentState);
  const prevSocketConnected = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const chatYRef = useRef(0);
  const scrollViewHeightRef = useRef(0);
  const [chatResetScroll, setChatResetScroll] = useState(0);

  const games = useSelector((state: RootState) => state.games);
  const user = useSelector((state: RootState) => state.user);
  const socketConnected = useSelector((state: RootState) => state.socketConnectionState);
  const notificationNav = useSelector((state: RootState) => state.notificationNavigation);

  // the callbacks below deliberately leave socketConnected out of their
  // dependencies, so they would otherwise read whatever it was when they were
  // created: a screen opened before the socket connected would keep leaving
  // the room on blur and never rejoin. This is the ref those comments mean
  const socketConnectedRef = useRef(socketConnected);
  useLayoutEffect(() => {
    socketConnectedRef.current = socketConnected;
  }, [socketConnected]);

  // Handle screen focus/blur: join room on focus, leave on blur
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchGame(gameId, user?.jwt ?? null));
      if (socketConnectedRef.current && user) {
        dispatch(addGameToSocket(gameId));
      }
      dispatch(setActiveGameScreen({ gameId, chatVisible: false }));

      return () => {
        dispatch(removeGameFromSocket(gameId));
        dispatch(clearActiveGameScreen());
      };
    }, [gameId, dispatch, user?.jwt]) // socketConnected intentionally excluded
  )

  // When socket reconnects (false→true), rejoin room without removing first
  // This matches the web client's componentDidUpdate behavior
  useEffect(() => {
    if (!prevSocketConnected.current && socketConnected && user) {
      dispatch(addGameToSocket(gameId));
    }
    prevSocketConnected.current = socketConnected;
  }, [socketConnected, gameId, dispatch]);

  // Handle app state changes for game socket subscription
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground - refetch game and reconnect
        dispatch(fetchGame(gameId, user?.jwt ?? null));
        if (socketConnectedRef.current) {
          dispatch(addGameToSocket(gameId));
        }
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        dispatch(removeGameFromSocket(gameId));
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [gameId, dispatch, user?.jwt]); // socketConnected intentionally excluded, use ref

  const game = games[gameId]

  // Scroll based on notification type: top for game updates, bottom for chat
  useEffect(() => {
    if (notificationNav && notificationNav.gameId === gameId && game) {
      dispatch(clearNotificationNavigation());
      setChatResetScroll((c) => c + 1);
      setTimeout(() => {
        if (notificationNav.scrollToChat) {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        } else {
          scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }
      }, 500);
    }
  }, [notificationNav, gameId, game, dispatch]);

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
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        onLayout={(e) => { scrollViewHeightRef.current = e.nativeEvent.layout.height; }}
        onScroll={(e) => {
          const scrollY = e.nativeEvent.contentOffset.y;
          const isChatVisible = chatYRef.current > 0 && scrollY + scrollViewHeightRef.current >= chatYRef.current;
          dispatch(setChatVisible(isChatVisible));
        }}
        scrollEventThrottle={200}
      >
        <View style={styles.gameArea}>
          {shouldRenderGameContainer ? (
            <GameContainer game={game} />
          ) : (
            <RoomContainer game={game} />
          )}
        </View>
        {shouldShowChat && (
          <View
            style={styles.chatArea}
            onLayout={(e) => { chatYRef.current = e.nativeEvent.layout.y; }}
          >
            <Chat
              players={game.users}
              gamePhase={game.phase}
              gameId={game.id}
              resetScroll={chatResetScroll}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get('window').width;
const isSmallScreen = screenWidth <= 400;
const isTablet = screenWidth > 600;
const maxBoardWidth = isTablet ? 700 : 504;
const boardWidth = Math.min(isSmallScreen ? screenWidth - 4 : screenWidth * 0.9, maxBoardWidth);

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
    width: boardWidth,
    alignSelf: 'center',
  },
});
