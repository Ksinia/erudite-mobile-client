import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

import { RootState } from '@/reducer';
import { Game } from '@/reducer/types';
import { enterLobby } from '@/reducer/outgoingMessages';
import { useAppDispatch } from '@/hooks/redux';
import RoomTile from '@/components/RoomTile';
import TranslationContainer from '@/components/Translation/TranslationContainer';
import Collapsible from '@/components/Collapsible';
import FinishedGamesContainer from '@/components/FinishedGamesContainer';
import ArchivedGamesContainer from '@/components/ArchivedGamesContainer';

export default function MyGamesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.user);
  const lobby = useSelector((state: RootState) => state.lobby);
  const socketConnectionState = useSelector((state: RootState) => state.socketConnectionState);

  useEffect(() => {
    dispatch(enterLobby());
  }, [dispatch]);

  useEffect(() => {
    if (socketConnectionState) {
      dispatch(enterLobby());
    }
  }, [socketConnectionState, dispatch]);

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>
          <TranslationContainer translationKey="please_login" />
        </Text>
      </View>
    );
  }

  const processGames = () => {
    if (!Array.isArray(lobby)) return null;

    return lobby.reduce(
      (allGames: { userTurn: Game[]; otherTurn: Game[]; userWaiting: Game[] }, game) => {
        const isUserInGame = game.users.find((u) => u.id === user.id);

        if (isUserInGame) {
          if (game.phase === 'turn' || game.phase === 'validation') {
            if (user.id === game.activeUserId) {
              allGames.userTurn.push(game);
            } else {
              allGames.otherTurn.push(game);
            }
          } else if (game.phase === 'waiting' || game.phase === 'ready') {
            allGames.userWaiting.push(game);
          }
        }

        return allGames;
      },
      {
        userTurn: [],
        otherTurn: [],
        userWaiting: [],
      }
    );
  };

  const games = processGames();
  const jwt = user.jwt || '';

  const handleGamePress = (gameId: number) => {
    router.push(`/(tabs)/game/${gameId}`);
  };

  const hasActiveGames = games && (
    games.userTurn.length > 0 ||
    games.otherTurn.length > 0 ||
    games.userWaiting.length > 0
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        <TranslationContainer translationKey="my_games" />
      </Text>

      {!Array.isArray(lobby) || !games ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3f51b5" />
          <Text style={styles.loadingText}>
            <TranslationContainer translationKey="loading" />
          </Text>
        </View>
      ) : (
        <>
          {!hasActiveGames && (
            <Text style={styles.emptyText}>
              <TranslationContainer translationKey="no_active_games" />
            </Text>
          )}

          {games.userTurn.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                <TranslationContainer translationKey="your_turn_games" />
              </Text>
              <View style={styles.gamesList}>
                {games.userTurn.map((game) => (
                  <RoomTile
                    key={game.id}
                    room={game}
                    user={user}
                    onPress={handleGamePress}
                  />
                ))}
              </View>
            </View>
          )}

          {games.otherTurn.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                <TranslationContainer translationKey="your_other_games" />
              </Text>
              <View style={styles.gamesList}>
                {games.otherTurn.map((game) => (
                  <RoomTile
                    key={game.id}
                    room={game}
                    user={user}
                    onPress={handleGamePress}
                  />
                ))}
              </View>
            </View>
          )}

          {games.userWaiting.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                <TranslationContainer translationKey="your_rooms" />
              </Text>
              <View style={styles.gamesList}>
                {games.userWaiting.map((game) => (
                  <RoomTile
                    key={game.id}
                    room={game}
                    user={user}
                    onPress={handleGamePress}
                  />
                ))}
              </View>
            </View>
          )}

          {jwt && (
            <View style={styles.collapsibleSection}>
              <Collapsible
                translationKeyExpand="expand_finished"
                translationKeyCollapse="collapse_finished"
                component={<FinishedGamesContainer jwt={jwt} />}
              />
              <Collapsible
                translationKeyExpand="expand_archived"
                translationKeyCollapse="collapse_archived"
                component={<ArchivedGamesContainer jwt={jwt} />}
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  gamesList: {
    gap: 10,
  },
  collapsibleSection: {
    marginTop: 10,
    marginBottom: 30,
  },
});
