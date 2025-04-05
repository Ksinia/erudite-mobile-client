import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity } from 'react-native';

import { User, Game } from "@/reducer/types";
import { RootState } from "@/reducer";
import { Colors } from "@/constants/Colors";
import TranslationContainer from './Translation/TranslationContainer';
import styles from './RoomTileStyles';

type OwnProps = {
  room: Game;
  user: User | null;
  onPress?: (id: number) => void; // Added for navigation
};
interface StateProps {
  messagesCount: { [key: number]: number };
}

type Props = StateProps & OwnProps;

function getActiveUserName(game: Game): string {
  const user = game.users.find((user) => user.id === game.activeUserId);
  if (user) {
    return user.name;
  }
  return '';
}

function getWinnerName(game: Game): string {
  return game.users
    .filter((user) => game.result.winner.includes(user.id.toString()))
    .map((user) => user.name)
    .join(', ');
}

function getTileColor(props: Props): string {
  const propsUser = props.user;
  if (props.room.phase === 'finished' && propsUser) {
    return props.room.users
      .filter((user) => props.room.result.winner.includes(user.id.toString()))
      .map((user) => user.id)
      .includes(propsUser.id)
      ? Colors.green
      : Colors.red;
  }
  if (propsUser && props.room.users.some((user) => user.id === propsUser.id)) {
    return props.room.activeUserId === propsUser.id
      ? Colors.red
      : Colors.orange;
  }
  return props.room.phase === 'waiting' ? Colors.green : Colors.blue;
}

class RoomTile extends Component<Props> {
  handlePress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.room.id);
    }
  };

  render() {
    const { id, maxPlayers, users, phase, language, turnOrder } =
      this.props.room;
    const messagesCount = {108: 0}  // temp change to constant

    return (
      <TouchableOpacity onPress={this.handlePress} activeOpacity={0.7}>
        <View style={styles.roomTile}>
          <View
            style={[styles.tileHeader, { backgroundColor: getTileColor(this.props) }]}
          >
            <Text style={styles.number}>{id}</Text>
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
              this.props.user &&
              this.props.room.activeUserId === this.props.user.id ? (
                <TranslationContainer translationKey="your_turn" />
              ) : (
                getActiveUserName(this.props.room)
              )}
              {phase === 'finished' &&
                getWinnerName(this.props.room) &&
                '\uD83C\uDFC6 ' + getWinnerName(this.props.room)}
            </Text>
            <Text style={styles.language}>
              {language.toUpperCase()}
              {"\n"}
              <Text>{maxPlayers}</Text>
            </Text>
          </View>
          <View style={styles.tileBody}>
            <Text numberOfLines={2} ellipsizeMode="tail">
              {turnOrder
                ? turnOrder
                  .map((userId) =>
                    users
                      .find((user) => user.id === userId)
                      ?.name.replace(' ', '\u00A0')
                  )
                  .join(' • ')
                : // replace space with U+00A0, non-breaking space
                users.map((user) => user.name.replace(' ', '\u00A0')).join(' • ')}
            </Text>
          </View>
          {messagesCount[id] > 0 && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>{messagesCount[id]}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

function MapStateToProps(state: RootState): StateProps {
  return {
    messagesCount: state.messagesCount,
  };
}

export default connect(MapStateToProps)(RoomTile);