// Theming disabled - just re-export View
// TODO: Implement theming later
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps;

export function ThemedView(props: ThemedViewProps) {
  return <View {...props} />;
}
