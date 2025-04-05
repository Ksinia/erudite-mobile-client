import React from 'react';
import { Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import TranslationContainer from "@/components/Translation/TranslationContainer";

const Rules = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.rulesText}>
          <TranslationContainer translationKey="rules" />
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
  },
  rulesText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  }
});

export default Rules;