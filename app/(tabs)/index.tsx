import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Lobby from "@/components/Lobby";
import { ChangeEvent, SyntheticEvent } from 'react';

export default function HomeScreen() {
  return (
    <Lobby onChange={function (event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>): void {
      throw new Error("Function not implemented.");
    }} onSubmit={function (event: SyntheticEvent<Element, Event>): Promise<void> {
      throw new Error("Function not implemented.");
    }} values={{
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
  );
}

const styles = StyleSheet.create({

});
