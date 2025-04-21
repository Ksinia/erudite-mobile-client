/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  // Board bonus cell colors (matching client CSS)
  red: 'rgba(250, 128, 114, 0.5)',     // w3 (word triple)
  orange: 'rgba(255, 165, 0, 0.5)',    // l3 (letter triple)
  green: 'rgba(154, 205, 50, 0.5)',    // l2 (letter double)
  blue: 'rgba(70, 130, 180, 0.5)',     // w2 (word double)
  lightPurple: 'rgba(230, 230, 250, 1)',
  lightGoldenrod: 'lightgoldenrodyellow', // For new letters
  buttonPrimary: '#3f51b5',
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
