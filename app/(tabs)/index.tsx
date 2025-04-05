import { StyleSheet, SafeAreaView } from "react-native";
import LobbyContainer from "@/components/LobbyContainer";

export default function LobbyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LobbyContainer/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});