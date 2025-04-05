import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { setLanguage } from "@/components/Translation/reducer";
import { LANG_NAMES } from "@/constants/translations";

type Props = {
  locale: string;
  setLanguage: typeof setLanguage;
};

const LangSwitch: React.FC<Props> = ({ locale, setLanguage }) => {
  return (
    <View style={styles.langContainer}>
      {LANG_NAMES.map((language, i) => (
        <TouchableOpacity
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
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  langContainer: {
    flexDirection: 'row',
  },
  langButton: {
    paddingHorizontal: 5,
    paddingVertical: 2,
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