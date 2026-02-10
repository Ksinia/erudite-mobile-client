import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import TranslationContainer from './Translation/TranslationContainer';
import { Colors } from '@/constants/Colors';
import { TRANSLATIONS } from '@/constants/translations';
import { RootState } from '@/reducer';
import config from '@/config';

const ForgotPassword: React.FC = () => {
  const [name, setName] = useState('');
  const [result, setResult] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const locale = useSelector((state: RootState) => state.translation?.locale ?? 'en_US');

  useFocusEffect(
    useCallback(() => {
      setName('');
      setResult('');
      setErrorKey('');
    }, [])
  );

  const handleSubmit = async () => {
    setResult('');
    setErrorKey('');
    try {
      const response = await fetch(`${config.backendUrl}/generate-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        try {
          const body = await response.json();
          const key = body?.message || 'send_failed';
          setErrorKey(key);
        } catch {
          setErrorKey('send_failed');
        }
        return;
      }
      const text = await response.text();
      setResult(text);
      setName('');
    } catch {
      setErrorKey('send_failed');
    }
  };

  const errorMessage = errorKey ? (TRANSLATIONS[locale]?.[errorKey] ?? errorKey) : '';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
          <TranslationContainer translationKey="change_password" />
        </Text>

        <Text style={styles.instruction}>
          <TranslationContainer translationKey="enter_login_or_email" />
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <TranslationContainer translationKey="login_or_email" />
          </Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            textContentType="username"
            value={name}
            onChangeText={setName}
          />
        </View>

        {result === 'Link generated' && (
          <Text style={styles.successMessage}>
            <TranslationContainer translationKey="link_generated" />
          </Text>
        )}
        {result === 'Link sent' && (
          <Text style={styles.successMessage}>
            <TranslationContainer translationKey="link_sent" />
          </Text>
        )}
        {errorMessage !== '' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            <TranslationContainer translationKey="confirm" />
          </Text>
        </Pressable>

        <View style={styles.links}>
          <Link href="/login" asChild>
            <Pressable>
              <Text style={styles.linkText}>
                <TranslationContainer translationKey="log_in" />
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  instruction: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  successMessage: {
    color: 'green',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: Colors.buttonPrimary,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: Colors.buttonPrimary,
  },
});

export default ForgotPassword;
