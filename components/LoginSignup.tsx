import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';

import TranslationContainer from './Translation/TranslationContainer';

type Props = {
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  values: { name: string; password: string; email?: string };
  error: string | null;
  isSignUp: boolean;
};

const LoginSignup: React.FC<Props> = ({ onChange, onSubmit, values, error, isSignUp }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          <TranslationContainer
            translationKey={isSignUp ? 'sign_up' : 'log_in'}
          />
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            <TranslationContainer translationKey="name" />
          </Text>
          <TextInput
            style={styles.input}
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
            <Text style={styles.label}>
              <TranslationContainer translationKey="email" />
            </Text>
            <TextInput
              style={styles.input}
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
          <Text style={styles.label}>
            <TranslationContainer translationKey="password" />
          </Text>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#999"
            secureTextEntry
            value={values.password}
            onChangeText={(text) => onChange('password', text)}
          />
        </View>
        
        {error && (
          <Text style={styles.errorMessage}>{error}</Text>
        )}
        
        <TouchableOpacity 
          style={styles.submitButton}
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
                <Text style={styles.linkText}>
                  <TranslationContainer translationKey="already_signed_up" />
                </Text>
              </TouchableOpacity>
            </Link>
          ) : (
            <>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>
                    <TranslationContainer translationKey="no_account" />
                  </Text>
                </TouchableOpacity>
              </Link>
              
              <Link href="/forgot-password" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>
                    <TranslationContainer translationKey="forgot" />
                  </Text>
                </TouchableOpacity>
              </Link>
            </>
          )}
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
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
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
    backgroundColor: '#3f51b5',
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
    color: '#3f51b5',
  },
});

export default LoginSignup;