import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LANG_NAMES } from "@/constants/translations";

type Props = {
  locale: string;
  setLanguage: (params: { locale: string }) => void;
};

const LangSwitch: React.FC<Props> = ({ locale, setLanguage }) => {
  const nextLang = LANG_NAMES.find((l) => l.locale !== locale);

  return (
    <View style={styles.langContainer}>
      <Pressable
        style={styles.langButton}
        onPress={() => {
          if (nextLang) {
            setLanguage({ locale: nextLang.locale });
          }
        }}
      >
        <Text style={styles.langText}>{nextLang?.name}</Text>
      </Pressable>
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
    paddingHorizontal: 2,
    height: '100%',
    justifyContent: 'center',
  },
  langText: {
    fontSize: 12,
    color: '#333',
  },
});

export default LangSwitch;
