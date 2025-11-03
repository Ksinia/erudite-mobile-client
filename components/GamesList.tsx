import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Game, User } from '@/reducer/types';
import RoomTile from './RoomTile';
import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  gamesList: Game[];
  user: User | null;
  category: string;
};

function GamesList(props: OwnProps) {
  const router = useRouter();

  const handleGamePress = (gameId: number) => {
    router.push(`/(tabs)/game/${gameId}`);
  };

  return (
    <View style={styles.container}>
      {props.gamesList ? (
        props.gamesList.length > 0 && (
          <View>
            <Text style={styles.title}>
              <TranslationContainer translationKey={props.category} />
            </Text>
            <View style={styles.gamesList}>
              {props.gamesList.map((game) => (
                <RoomTile
                  key={game.id}
                  room={game}
                  user={props.user}
                  onPress={handleGamePress}
                />
              ))}
            </View>
          </View>
        )
      ) : (
        <Text style={styles.loadingText}>
          <TranslationContainer translationKey="loading" />
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  gamesList: {
    gap: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default GamesList;