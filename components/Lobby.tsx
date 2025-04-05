import React from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { User, Game } from "@/reducer/types";
import RoomTile from './RoomTile';
import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  onChange: (name: string, value: string | number) => void;
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
        <View style={styles.formContainer}>
          <View style={styles.formRow}>
            <Text style={styles.label}>
              <TranslationContainer translationKey="qty" />
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={props.values.maxPlayers.toString()}
              onChangeText={(text) => props.onChange('maxPlayers', parseInt(text) || 2)}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>
              <TranslationContainer translationKey="language" />
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={props.values.language}
                style={styles.picker}
                onValueChange={(value) => props.onChange('language', value)}
              >
                <Picker.Item label="ru" value="ru" />
                <Picker.Item label="en" value="en" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, !props.sendingFormEnabled && styles.buttonDisabled]}
            onPress={props.onSubmit}
            disabled={!props.sendingFormEnabled}
          >
            <Text style={styles.buttonText}>
              <TranslationContainer translationKey="submit" />
            </Text>
          </TouchableOpacity>
        </View>
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
    fontWeight: '400',
    color: '#333',
    lineHeight: 22,
  },
  formContainer: {
    padding: 16,
    alignItems: 'center',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 40,
    height: 40,
    textAlign: 'center',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 100,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    width: 100,
    height: 40,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
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