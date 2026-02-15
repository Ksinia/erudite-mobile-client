import React from 'react';
import { Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import TranslationContainer from "@/components/Translation/TranslationContainer";

const sw = Dimensions.get('window').width;
const s = sw > 600 ? 1.4 : 1;

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
    padding: 16 * s,
  },
  rulesText: {
    fontSize: 16 * s,
    lineHeight: 24 * s,
    color: '#333',
  }
});

export default Rules;