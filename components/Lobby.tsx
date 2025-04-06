import React from 'react';
import { Text, View, StyleSheet, ScrollView } from "react-native";

import { User, Game } from "@/reducer/types";
import RoomTile from './RoomTile';
import TranslationContainer from './Translation/TranslationContainer';
import { NewGameForm } from "@/components/NewGameForm";

type OwnProps = {
  onChange: (name: string, value: string) => void;
  onSubmit: () => Promise<void>;
  values: { maxPlayers: number; language: string };
  userTurnGames: Game[];
  otherTurnGames: Game[];
  userWaitingGames: Game[];
  otherWaitingGames: Game[];
  otherGames: Game[];
  user: User | null;
  sendingFormEnabled: boolean;
};

function Lobby(props: OwnProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          <TranslationContainer translationKey="create_room" />
        </Text>
      </View>

      {props.user && (
        <NewGameForm values={props.values} onChange={props.onChange}
                     onSubmit={props.onSubmit} disabled={!props.sendingFormEnabled} />
      )}

      {props.userTurnGames.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            <TranslationContainer translationKey="your_turn_games" />
          </Text>
          <View style={styles.rooms}>
            {props.userTurnGames.map((game) => (
              <View key={game.id}>
                <RoomTile room={game} user={props.user} />
              </View>
            ))}
          </View>
        </View>
      )}

      {props.otherTurnGames.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            <TranslationContainer translationKey="your_other_games" />
          </Text>
          <View style={styles.rooms}>
            {props.otherTurnGames.map((game) => (
              <View key={game.id}>
                <RoomTile room={game} user={props.user} />
              </View>
            ))}
          </View>
        </View>
      )}

      {props.userWaitingGames.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            <TranslationContainer translationKey="your_rooms" />
          </Text>
          <View style={styles.rooms}>
            {props.userWaitingGames.map((game) => (
              <View key={game.id}>
                <RoomTile room={game} user={props.user} />
              </View>
            ))}
          </View>
        </View>
      )}

      {props.otherWaitingGames.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            <TranslationContainer translationKey="available_rooms" />
          </Text>
          <View style={styles.rooms}>
            {props.otherWaitingGames.map((game) => (
              <View key={game.id}>
                <RoomTile room={game} user={props.user} />
              </View>
            ))}
          </View>
        </View>
      )}

      {props.otherGames.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            <TranslationContainer translationKey="other_rooms" />
          </Text>
          <View style={styles.rooms}>
            {props.otherGames.map((game) => (
              <View key={game.id}>
                <RoomTile room={game} user={props.user} />
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    lineHeight: 22,
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  rooms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center', // Center tiles vertically
    width: '100%',
  }
});

export default Lobby;