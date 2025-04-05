import { StyleSheet, SafeAreaView } from "react-native";
import { useState } from 'react';
import Lobby from "@/components/Lobby";

export default function LobbyScreen() {
  // Sample data - later this would come from your API
  const [values, setValues] = useState({
    maxPlayers: 2,
    language: "ru"
  });

  // Sample game data - later this would come from your state/API
  const sampleGame = {
    "id": 108,
    "phase": "turn",
    "turnOrder": [1, 4],
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
  };

  // Form handlers
  const onChange = (name: string, value: string | number): void => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = async (): Promise<void> => {
    // This will be implemented when you connect to the backend
    console.log("Form submitted with values:", values);
    // Here you would call your API to create a new game
  };

  return (
    <SafeAreaView style={styles.container}>
      <Lobby
        onChange={onChange}
        onSubmit={onSubmit}
        values={values}
        userTurnGames={[sampleGame]}
        otherTurnGames={[]}
        userWaitingGames={[]}
        otherWaitingGames={[]}
        otherGames={[]}
        user={null}
        sendingFormEnabled={true}
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