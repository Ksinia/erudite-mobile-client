import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View, Pressable } from 'react-native';

import { User, Game } from "@/reducer/types";
import { RootState } from "@/reducer";
import { Colors } from "@/constants/Colors";
import TranslationContainer from './Translation/TranslationContainer';
import styles from './RoomTileStyles';

type Props = {
  room: Game;
  user: User | null;
  onPress?: (id: number) => void;
};

function getActiveUserName(game: Game): string {
  const user = game.users.find((user) => user.id === game.activeUserId);
  return user ? user.name : '';
}

function getWinnerName(game: Game): string {
  return game.users
    .filter((user) => game.result.winner.includes(user.id.toString()))
    .map((user) => user.name)
    .join(', ');
}

function getTileColor(room: Game, user: User | null): string {
  if (room.phase === 'finished' && user) {
    return room.result.winner.includes(user.id.toString()) ? Colors.green : Colors.red;
  }
  if (user && room.users.some((u) => u.id === user.id)) {
    return room.activeUserId === user.id ? Colors.red : Colors.orange;
  }
  return room.phase === 'waiting' ? Colors.green : Colors.blue;
}

const RoomTile: React.FC<Props> = ({ room, user, onPress }) => {
  const messagesCount = useSelector((state: RootState) => state.messagesCount);
  const { id, maxPlayers, users, phase, language, turnOrder } = room;

  return (
    <Pressable onPress={() => onPress?.(id)}>
      <View style={styles.roomTile}>
        <View
          style={[styles.tileHeader, { backgroundColor: getTileColor(room, user) }]}
        >
          <Text style={styles.number} numberOfLines={1}>
            {phase === 'waiting' || phase === 'ready'
              ? id
              : room.centerWord || id}
          </Text>
          <Text style={styles.status}>
            {phase === 'waiting' && (
              <TranslationContainer
                translationKey="waiting_for"
                args={[String(maxPlayers - users.length)]}
              />
            )}
            {phase === 'ready' && (
              <TranslationContainer translationKey="ready" />
            )}
            {phase !== 'finished' &&
            user &&
            room.activeUserId === user.id ? (
              <TranslationContainer translationKey="your_turn" />
            ) : (
              getActiveUserName(room)
            )}
            {phase === 'finished' &&
              getWinnerName(room) &&
              '\uD83C\uDFC6 ' + getWinnerName(room)}
          </Text>
          <Text style={styles.language}>
            {language.toUpperCase()} {maxPlayers}
          </Text>
        </View>
        <View style={styles.tileBody}>
          <Text numberOfLines={2} ellipsizeMode="tail">
            {turnOrder
              ? turnOrder
                  .map((userId) =>
                    users
                      .find((u) => u.id === userId)
                      ?.name.replace(' ', '\u00A0')
                  )
                  .join(' • ')
              : users.map((u) => u.name.replace(' ', '\u00A0')).join(' • ')}
          </Text>
        </View>
        {messagesCount[id] > 0 && (
          <View style={styles.counter}>
            <Text style={styles.counterText}>{messagesCount[id]}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default RoomTile;
