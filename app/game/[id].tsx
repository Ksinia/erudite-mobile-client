import { Redirect, useLocalSearchParams } from 'expo-router';

export default function GameRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/(tabs)/game/${id}`} />;
}
