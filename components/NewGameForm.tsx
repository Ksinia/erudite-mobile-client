import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import TranslationContainer from "@/components/Translation/TranslationContainer";
import React from "react";
import { Colors } from "@/constants/Colors";

interface Props {
  values: { maxPlayers: number; language: string };
  onChange: (name: string, value: string) => void;
  onSubmit: () => Promise<void>;
  disabled: boolean;
}

export function NewGameForm(props: Props) {
  return <View style={styles.formContainer}>
    <View style={styles.formCard}>

      <View style={styles.formRow}>
        <Text style={styles.label}>
          <TranslationContainer translationKey="qty" />
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={props.values.maxPlayers.toString()}
          onChangeText={(maxPlayers) => props.onChange("maxPlayers", maxPlayers)}
        />
      </View>

      <View style={styles.formRow}>

        <View style={styles.halfRow}>
          <Text style={styles.label}>
            <TranslationContainer translationKey="language" />
          </Text>
          <View style={styles.languageButtonGroup}>
            <TouchableOpacity
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
            </TouchableOpacity>

            <TouchableOpacity
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
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.inlineButton, props.disabled && styles.buttonDisabled]}
          onPress={props.onSubmit}
          disabled={props.disabled}
        >
          <Text style={styles.buttonText}>
            <TranslationContainer translationKey="submit" />
          </Text>
        </TouchableOpacity>
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
    width: width < 420 ? width * 0.9 : 250,
    height: 120,
    borderWidth: 1,
    borderColor: 'lightgrey',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 20
  },
  halfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#fff',
    minWidth: 40,
  },
  languageButtonGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 80,
    height: 36,
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
  },
  inlineButton: {
    backgroundColor: Colors.buttonPrimary,
    padding: 8,
    borderRadius: 5,
    flex: 1/2,
    height: 36,
  },
});