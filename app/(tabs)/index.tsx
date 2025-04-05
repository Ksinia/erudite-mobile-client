import { Image, StyleSheet, Platform, SafeAreaView } from "react-native";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Lobby from "@/components/Lobby";
import { ChangeEvent, SyntheticEvent } from 'react';

export default function HomeScreen() {

  const onChange=(name:string, value: string | number): void => {
    throw new Error("Function not implemented.");
  }

  const onSubmit=(): Promise<void> => {
    throw new Error("Function not implemented.");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Lobby onChange={onChange} onSubmit={onSubmit} values={{
        maxPlayers: 8,
        language: "en"
      }} userTurnGames={[
        {

              "id": 108,
              "phase": "turn",
              "turnOrder": [
                1,
                4
              ],
              "turn": 1,
              "validated": "yes",
              "language": "ru",
              "maxPlayers": 2,
              "activeUserId": 4,
              "users": [
                {
                  "id": 4,
                  "name": "dmitry",
                  "Game_User": {
                    "createdAt": "2024-11-01T14:50:39.202Z",
                    "updatedAt": "2024-11-06T23:55:18.516Z",
                    "visit": "2024-11-06T23:55:18.516Z",
                    "GameId": 108,
                    "UserId": 4
                  }
                },
                {
                  "id": 1,
                  "name": "k",
                  "Game_User": {
                    "createdAt": "2024-11-01T14:49:51.115Z",
                    "updatedAt": "2024-11-10T21:18:15.316Z",
                    "visit": "2024-11-10T21:18:15.316Z",
                    "GameId": 108,
                    "UserId": 1
                  }
                }
              ]
        }
      ]} otherTurnGames={[]} userWaitingGames={[]} otherWaitingGames={[]} otherGames={[]}
             user={null} sendingFormEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
