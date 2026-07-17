import { Dimensions, StyleSheet, Text, Pressable, View } from "react-native";
import TranslationContainer from "@/components/Translation/TranslationContainer";
import React from "react";
import { Colors } from "@/constants/Colors";

interface Props {
  values: { maxPlayers: number; language: string };
  onChange: (name: string, value: string) => void;
  onSubmit: () => Promise<void>;
  disabled: boolean;
}

const PLAYER_OPTIONS = [2, 3, 4, 5, 6, 7, 8];

export function NewGameForm(props: Props) {
  return <View style={styles.formContainer}>
    <View style={styles.formCard}>

      <View style={styles.formRow}>
        <Text style={styles.label}>
          <TranslationContainer translationKey="qty" />
        </Text>
        <View style={styles.playerButtonGroup}>
          {PLAYER_OPTIONS.map((n) => (
            <Pressable
              key={n}
              style={[
                styles.playerButton,
                Number(props.values.maxPlayers) === n && styles.activePlayerButton
              ]}
              onPress={() => props.onChange("maxPlayers", String(n))}
            >
              <Text style={[
                styles.playerButtonText,
                Number(props.values.maxPlayers) === n && styles.activePlayerText
              ]}>
                {n}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.formRow, styles.formRowBottom]}>

        <View style={styles.halfRow}>
          <Text style={styles.label}>
            <TranslationContainer translationKey="language" />
          </Text>
          <View style={styles.languageButtonGroup}>
            <Pressable
              style={[
                styles.languageButton,
                props.values.language === 'en' && styles.activeLanguageButton
              ]}
              onPress={() => props.onChange('language', 'en')}
            >
              <Text style={[
                styles.languageButtonText,
                props.values.language === 'en' && styles.activeLanguageText
              ]}>
                EN
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.languageButton,
                props.values.language === 'ru' && styles.activeLanguageButton
              ]}
              onPress={() => props.onChange('language', 'ru')}
            >
              <Text style={[
                styles.languageButtonText,
                props.values.language === 'ru' && styles.activeLanguageText
              ]}>
                RU
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[styles.inlineButton, props.disabled && styles.buttonDisabled]}
          onPress={props.onSubmit}
          disabled={props.disabled}
        >
          <Text style={styles.buttonText}>
            <TranslationContainer translationKey="submit" />
          </Text>
        </Pressable>
      </View>
    </View>
  </View>
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  formContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  formCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    width: width * 0.9,
    maxWidth: 500,
    borderWidth: 1,
    borderColor: 'lightgrey',
    flexDirection: 'column',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 20,
    flexWrap: 'wrap',
    rowGap: 8,
  },
  formRowBottom: {
    alignItems: 'flex-end',
  },
  halfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    rowGap: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
    flexShrink: 1,
    marginRight: 8,
  },
  playerButtonGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    minHeight: 36,
    overflow: 'hidden',
  },
  playerButton: {
    minWidth: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activePlayerButton: {
    backgroundColor: Colors.buttonPrimary,
  },
  playerButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    includeFontPadding: false,
  },
  activePlayerText: {
    color: '#fff',
  },
  languageButtonGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    minWidth: 80,
    minHeight: 36,
    overflow: 'hidden',
  },
  languageButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  activeLanguageButton: {
    backgroundColor: Colors.buttonPrimary,
  },
  languageButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    includeFontPadding: false,
  },
  activeLanguageText: {
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
  },
  inlineButton: {
    backgroundColor: Colors.buttonPrimary,
    padding: 8,
    borderRadius: 5,
    flex: 1/2,
    minWidth: 100,
    minHeight: 36,
    justifyContent: 'center',
  },
});
