import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';

import TranslationContainer from './Translation/TranslationContainer';
import ThemedView from './ThemedView';
import ThemedText from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';

type Props = {
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  values: { name: string; password: string; email?: string };
  error: string | null;
  isSignUp: boolean;
};

const LoginSignup: React.FC<Props> = ({ onChange, onSubmit, values, error, isSignUp }) => {
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#151718' }, 'background');
  const textColor = useThemeColor({ light: '#333', dark: '#eee' }, 'text');
  const primaryColor = useThemeColor({ light: '#3f51b5', dark: '#5c6bc0' }, 'tint');
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.title}>
          <TranslationContainer
            translationKey={isSignUp ? 'sign_up' : 'log_in'}
          />
        </ThemedText>
        
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>
            <TranslationContainer translationKey="name" />
          </ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
            placeholder=""
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            value={values.name}
            onChangeText={(text) => onChange('name', text)}
          />
        </View>
        
        {isSignUp && (
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>
              <TranslationContainer translationKey="email" />
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
              placeholder=""
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={values.email}
              onChangeText={(text) => onChange('email', text)}
            />
          </View>
        )}
        
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>
            <TranslationContainer translationKey="password" />
          </ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, backgroundColor: backgroundColor }]}
            placeholder=""
            placeholderTextColor="#999"
            secureTextEntry
            value={values.password}
            onChangeText={(text) => onChange('password', text)}
          />
        </View>
        
        {error && (
          <ThemedText style={styles.errorMessage}>{error}</ThemedText>
        )}
        
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: primaryColor }]}
          onPress={onSubmit}
        >
          <Text style={styles.buttonText}>
            <TranslationContainer
              translationKey={isSignUp ? 'sign_up' : 'log_in'}
            />
          </Text>
        </TouchableOpacity>
        
        <View style={styles.links}>
          {isSignUp ? (
            <Link href="/login" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.linkText}>
                  <TranslationContainer translationKey="already_signed_up" />
                </ThemedText>
              </TouchableOpacity>
            </Link>
          ) : (
            <>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <ThemedText style={styles.linkText}>
                    <TranslationContainer translationKey="no_account" />
                  </ThemedText>
                </TouchableOpacity>
              </Link>
              
              <Link href="/forgot-password" asChild>
                <TouchableOpacity>
                  <ThemedText style={styles.linkText}>
                    <TranslationContainer translationKey="forgot" />
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            </>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});

export default LoginSignup;