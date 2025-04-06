import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import TranslationContainer from "@/components/Translation/TranslationContainer";
import { Picker } from "@react-native-picker/picker";
import React from "react";

interface Props {
  values: { maxPlayers: number; language: string };
  onChange: (name: string, value: string | number) => void;
  onSubmit: () => Promise<void>;
  disabled: boolean;
}

export function NewGameForm(props: Props) {
  return <View style={styles.formContainer}>
    <View style={styles.formCard}>

      <View style={styles.formRow} key={1}>
        <Text style={styles.label}>
          <TranslationContainer translationKey="qty" />
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
          value={props.values.maxPlayers.toString()}
          onChangeText={(text) => props.onChange('maxPlayers', parseInt(text) || 2)}
        />
      </View>

      <View style={styles.formRow} key={2}>

        <View style={styles.halfRow}>
          <Text style={styles.label}>
            <TranslationContainer translationKey="language" />
          </Text>
          <View style={styles.smallPickerContainer}>
            <Picker
              selectedValue={props.values.language}
              style={styles.smallPicker}
              onValueChange={(value) => props.onChange('language', value)}
            >
              <Picker.Item label="RU" value="ru" />
              <Picker.Item label="EN" value="en" />
            </Picker>
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
  smallPickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 80,
    height: 36,
    justifyContent: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  smallPicker: {
    height: 36,
  },
  inlineButton: {
    backgroundColor: '#3f51b5',
    padding: 8,
    borderRadius: 5,
    flex: 1/2,
    height: 36,
  },
});