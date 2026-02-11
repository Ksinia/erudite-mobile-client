import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import config from '@/config';
import { RootState } from '@/reducer';
import TranslationContainer from './Translation/TranslationContainer';
import { TRANSLATIONS } from '@/constants/translations';

const backendUrl = config.backendUrl;

interface OwnProps {
  jwtFromUrl?: string;
}

export default function ChangePassword({ jwtFromUrl }: OwnProps) {
  const [password, setPassword] = useState('');
  const [changed, setChanged] = useState(false);
  const [errorKey, setErrorKey] = useState('');

  const user = useSelector((state: RootState) => state.user);
  const locale = useSelector((state: RootState) => state.translation?.locale ?? 'en_US');

  const onSubmit = async () => {
    setErrorKey('');

    if (!user && !jwtFromUrl) {
      return;
    }

    const jwt = jwtFromUrl || (user && user.jwt);
    setChanged(false);

    const url = `${backendUrl}/change-password`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setPassword('');
        setChanged(true);
        setErrorKey('');
      } else {
        try {
          const data = await response.json();
          setErrorKey(data.message || 'send_failed');
        } catch {
          setErrorKey('send_failed');
        }
      }
    } catch {
      setErrorKey('send_failed');
    }
  };

  const errorMessage = errorKey ? (TRANSLATIONS[locale]?.[errorKey] ?? errorKey) : '';

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>
          <TranslationContainer translationKey="enter_new_password" />
        </Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>
            <TranslationContainer translationKey="confirm" />
          </Text>
        </Pressable>
      </View>

      {changed && (
        <Text style={styles.successText}>
          <TranslationContainer translationKey="password_changed" />
        </Text>
      )}

      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  form: {
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3f51b5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});