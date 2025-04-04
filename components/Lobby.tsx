import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { User, Game } from '../reducer/types';
import RoomTile from './RoomTile';
import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  onChange: (
    event:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSubmit: (event: React.SyntheticEvent) => Promise<void>;
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
    <View>
      <Text>
        <TranslationContainer translationKey="create_room" />
      </Text>
      {props.user && (
        <form onSubmit={props.onSubmit}>
          <label htmlFor="maxPlayers">
            {' '}
            <TranslationContainer translationKey="qty" />
          </label>
          <input
            id="maxPlayers"
            type="number"
            min="2"
            max="8"
            name="maxPlayers"
            onChange={props.onChange}
            value={props.values.maxPlayers}
          ></input>
          <label htmlFor="language">
            {' '}
            <TranslationContainer translationKey="language" />
          </label>
          <select
            name="language"
            onChange={props.onChange}
            value={props.values.language}
          >
            <option value="ru">ru</option>
            <option value="en">en</option>
          </select>

          <button
            style={{ margin: '20px' }}
            disabled={!props.sendingFormEnabled}
          >
            <TranslationContainer translationKey="submit" />
          </button>
        </form>
      )}
      {props.userTurnGames.length > 0 && [
        <Text key="userTurnRoomsTitle">
          <TranslationContainer translationKey="your_turn_games" />
        </Text>,
        <View key="userTurnRooms" style={styles.rooms}>
          {props.userTurnGames.map((game) => (
            <View style={styles.room} key={game.id}>
              <RoomTile room={game} user={props.user} />
            </View>
          ))}
        </View>,
      ]}
      {props.otherTurnGames.length > 0 && [
        <Text key="otherTurnRoomsTitle">
          <TranslationContainer translationKey="your_other_games" />
        </Text>,
        <View key="otherTurnRooms" style={styles.rooms}>
          {props.otherTurnGames.map((game) => (
            <View style={styles.room} key={game.id}>
              <RoomTile room={game} user={props.user} />
            </View>
          ))}
        </View>,
      ]}
      {props.userWaitingGames.length > 0 && [
        <Text key="userWaitingRoomsTitle">
          <TranslationContainer translationKey="your_rooms" />
        </Text>,
        <View key="userWaitingRooms" style={styles.rooms}>
          {props.userWaitingGames.map((game) => (
            <View style={styles.room} key={game.id}>
              <RoomTile room={game} user={props.user} />
            </View>
          ))}
        </View>,
      ]}
      {props.otherWaitingGames.length > 0 && [
        <Text key="otherWaitingRoomsTitle">
          <TranslationContainer translationKey="available_rooms" />
        </Text>,
        <View key="otherWaitingRooms" style={styles.rooms}>
          {props.otherWaitingGames.map((game) => (
            <View style={styles.room} key={game.id}>
              <RoomTile room={game} user={props.user} />
            </View>
          ))}
        </View>,
      ]}
      {props.otherGames.length > 0 && [
        <Text key="otherRoomsTitle">
          <TranslationContainer translationKey="other_rooms" />
        </Text>,
        <View key="otherRooms" style={styles.rooms}>
          {props.otherGames.map((game) => (
            <View style={styles.room} key={game.id}>
              <RoomTile room={game} user={props.user} />
            </View>
          ))}
        </View>,
      ]}
    </View>
  );
}

export default Lobby;

const styles = StyleSheet.create({
  rooms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  room: {
    // was it not used?
  }
});
