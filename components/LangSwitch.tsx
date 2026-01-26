import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LANG_NAMES } from "@/constants/translations";

type Props = {
  locale: string;
  setLanguage: (params: { locale: string }) => void;
};

const LangSwitch: React.FC<Props> = ({ locale, setLanguage }) => {
  return (
    <View style={styles.langContainer}>
      {LANG_NAMES.map((language, i) => (
        <Pressable
          key={i}
          style={styles.langButton}
          onPress={() => {
            setLanguage({ locale: language.locale });
            // In React Native, use AsyncStorage instead of localStorage
            // But we'll handle this in the container component
          }}
        >
          <Text
            style={[
              styles.langText,
              locale === language.locale && styles.activeLang,
            ]}
          >
            {language.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  langContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  langButton: {
    paddingHorizontal: 2, // Reduced from 5 to 2
    height: '100%',
    justifyContent: 'center',
  },
  langText: {
    fontSize: 12,
    color: '#333',
  },
  activeLang: {
    fontWeight: 'bold',
  },
});

export default LangSwitch;