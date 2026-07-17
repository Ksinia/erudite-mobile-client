import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

const VersionInfo = () => {
  const appVersion = Constants.expoConfig?.version ?? '?';
  const update = Updates.isEmbeddedLaunch
    ? 'embedded'
    : `update ${Updates.updateId?.slice(0, 8) ?? '?'}${
        Updates.createdAt ? ` · ${Updates.createdAt.toISOString().slice(0, 10)}` : ''
      }`;

  return (
    <Text style={styles.text}>
      v{appVersion} · {update}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default VersionInfo;
