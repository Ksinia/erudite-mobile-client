// Theming disabled - just re-export Text
// TODO: Implement theming later
import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ type, ...rest }: ThemedTextProps) {
  return <Text {...rest} />;
}
