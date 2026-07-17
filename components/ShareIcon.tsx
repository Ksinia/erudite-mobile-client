import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  size?: number;
  color?: string;
};

// Share icon (tray with an upward arrow) drawn with plain views, so it needs
// no icon font or asset loading and renders identically on both platforms.
const ShareIcon: React.FC<Props> = ({ size = 18, color = 'rgba(0,0,0,0.5)' }) => {
  const stroke = Math.max(1.5, size / 12);
  const trayHeight = size * 0.48;
  const trayWidth = size * 0.78;
  const shaftHeight = size * 0.62;
  const headSize = size * 0.34;

  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View
        style={[
          styles.arrowHead,
          {
            width: headSize,
            height: headSize,
            borderColor: color,
            borderTopWidth: stroke,
            borderLeftWidth: stroke,
            top: stroke / 2,
          },
        ]}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: stroke,
          height: shaftHeight,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: trayWidth,
          height: trayHeight,
          borderColor: color,
          borderLeftWidth: stroke,
          borderRightWidth: stroke,
          borderBottomWidth: stroke,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  arrowHead: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
});

export default ShareIcon;
