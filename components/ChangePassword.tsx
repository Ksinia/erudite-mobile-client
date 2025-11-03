import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import config from '@/config';
import { RootState } from '@/reducer';
import { useAppDispatch } from '@/hooks/redux';
import TranslationContainer from './Translation/TranslationContainer';
import { errorFromServer } from '@/thunkActions/errorHandling';
import { clearError } from '@/reducer/error';

const backendUrl = config.backendUrl;

interface OwnProps {
  jwtFromUrl?: string;
}

export default function ChangePassword({ jwtFromUrl }: OwnProps) {
  const [password, setPassword] = useState('');
  const [changed, setChanged] = useState(false);

  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const error = useSelector((state: RootState) => state.error);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async () => {
    dispatch(clearError());

    if (!user && !jwtFromUrl) {
      dispatch(
        errorFromServer(
          'Only logged in user can change password',
          'new password onSubmit'
        )
      );
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

      const data = await response.json();

      if (response.ok) {
        setPassword('');
        setChanged(true);
      } else {
        dispatch(
          errorFromServer(
            data.message || 'Failed to change password',
            'new password onSubmit'
          )
        );
      }
    } catch (error) {
      dispatch(errorFromServer(error, 'new password onSubmit'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <TranslationContainer translationKey="change_password" />
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>
          <TranslationContainer translationKey="enter_new_password" />
        </Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
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

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
    backgroundColor: '#4CAF50',
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
    color: '#4CAF50',
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