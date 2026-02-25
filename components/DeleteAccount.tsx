import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import config from '@/config';
import { RootState } from '@/reducer';
import { logOutAndClearStorage } from '@/reducer/auth';
import { useAppDispatch } from '@/hooks/redux';
import TranslationContainer from './Translation/TranslationContainer';
import { TRANSLATIONS } from '@/constants/translations';

const backendUrl = config.backendUrl;

export default function DeleteAccount() {
  const [password, setPassword] = useState('');
  const [errorKey, setErrorKey] = useState('');

  const user = useSelector((state: RootState) => state.user);
  const locale = useSelector((state: RootState) => state.translation?.locale ?? 'en_US');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isAppleUser = user?.authMethod === 'apple';

  const onSubmit = () => {
    setErrorKey('');

    if (!user) return;

    if (!isAppleUser && !password) {
      setErrorKey('password_empty');
      return;
    }

    Alert.alert('', TRANSLATIONS[locale].confirm_delete_account, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', style: 'destructive', onPress: isAppleUser ? doAppleDelete : doDelete },
    ]);
  };

  const doAppleDelete = async () => {
    if (!user) return;

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [],
      });
      if (!credential.identityToken) {
        setErrorKey('apple_signin_failed');
        return;
      }

      const response = await fetch(`${backendUrl}/delete-account`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identityToken: credential.identityToken }),
      });

      if (response.ok) {
        dispatch(logOutAndClearStorage());
        router.replace('/');
      } else {
        try {
          const data = await response.json();
          setErrorKey(data.message || 'send_failed');
        } catch {
          setErrorKey('send_failed');
        }
      }
    } catch (error) {
      if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') return;
      setErrorKey('apple_signin_failed');
    }
  };

  const doDelete = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${backendUrl}/delete-account`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        dispatch(logOutAndClearStorage());
        router.replace('/');
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
        {isAppleUser ? (
          <Text style={styles.label}>
            <TranslationContainer translationKey="confirm_delete_apple" />
          </Text>
        ) : (
          <>
            <Text style={styles.label}>
              <TranslationContainer translationKey="enter_password_to_delete" />
            </Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </>
        )}

        <Pressable style={styles.deleteButton} onPress={onSubmit}>
          <Text style={styles.buttonText}>
            <TranslationContainer translationKey="expand_delete_account" />
          </Text>
        </Pressable>
      </View>

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
  deleteButton: {
    backgroundColor: '#f44336',
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
  errorText: {
    color: '#f44336',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});
