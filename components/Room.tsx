import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { User, Game as GameType } from '@/reducer/types';
import TranslationContainer from './Translation/TranslationContainer';
import { Colors } from '@/constants/Colors';

type Props = {
  room: GameType;
  user: User | null;
  onClickStart: () => Promise<void>;
  onClickJoin: () => Promise<void>;
};

function Room(props: Props) {
  const waitingFor = props.room.maxPlayers - props.room.users.length;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.roomHeader}>
        <Text style={styles.heading}>
          <TranslationContainer
            translationKey="room_for"
            args={[String(props.room.id), String(props.room.maxPlayers)]}
          />
        </Text>
        
        <View style={styles.languageBadge}>
          <Text style={styles.languageText}>{props.room.language.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      {props.room.users.length > 0 ? (
        <View style={styles.playersContainer}>
          <Text style={styles.subheading}>
            <TranslationContainer translationKey="players_in_room" />
          </Text>
          
          {props.room.users.map((user) => (
            <View key={user.id} style={styles.playerRow}>
              <Text style={styles.playerName}>{user.name}</Text>
              
              {props.room.activeUserId === user.id && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>
                    <TranslationContainer translationKey="active" />
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyMessage}>
          <TranslationContainer translationKey="no_players" />
        </Text>
      )}
      
      {waitingFor > 0 && (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingMessage}>
            <TranslationContainer
              translationKey="waiting_for"
              args={[String(waitingFor)]}
            />
          </Text>
        </View>
      )}
      
      {!props.user ? (
        <View style={styles.messageContainer}>
          <Text style={styles.loginMessage}>
            <TranslationContainer translationKey="please_log_in" />
          </Text>
        </View>
      ) : (
        <View style={styles.actionContainer}>
          {props.room.phase === 'waiting' &&
            !props.room.users.find((user) => user.id === props.user?.id) && (
              <TouchableOpacity 
                style={styles.button} 
                onPress={props.onClickJoin}
              >
                <Text style={styles.buttonText}>
                  <TranslationContainer translationKey="join" />
                </Text>
              </TouchableOpacity>
            )}
          {props.room.users.find((user) => user.id === props.user?.id) &&
            props.room.phase === 'ready' && (
              <TouchableOpacity 
                style={styles.button} 
                onPress={props.onClickStart}
              >
                <Text style={styles.buttonText}>
                  <TranslationContainer translationKey="start" />
                </Text>
              </TouchableOpacity>
            )}
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
  contentContainer: {
    padding: 16,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  languageBadge: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  languageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  playersContainer: {
    marginBottom: 20,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  playerName: {
    fontSize: 16,
    flex: 1,
  },
  activeBadge: {
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyMessage: {
    fontSize: 16,
    marginVertical: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  waitingContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  waitingMessage: {
    fontSize: 16,
    color: '#666',
  },
  messageContainer: {
    marginTop: 20,
  },
  loginMessage: {
    fontSize: 16,
    color: Colors.red,
    textAlign: 'center',
    marginVertical: 16,
  },
  actionContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Room;