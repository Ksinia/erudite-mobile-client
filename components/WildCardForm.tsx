import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  wildCardLetters: { letter: string; x: number; y: number }[];
  onChange: (letter: string, index: number, x: number, y: number) => void;
  alphabet: string[];
};

function WildCardForm(props: OwnProps) {
  if (props.wildCardLetters.length === 0) {
    return null;
  }

  // Only process the first wildcard selection for simplicity
  // (most games will only have one wildcard in play at a time)
  const wildCard = props.wildCardLetters[0];
  
  const handleLetterPress = (letter: string) => {
    props.onChange(letter, 0, wildCard.x, wildCard.y);
  };

  if (props.wildCardLetters.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TranslationContainer translationKey="select" />
      </View>
      
      <View style={styles.letterGrid}>
        {props.alphabet.map((letter) => (
          <TouchableOpacity
            key={letter}
            style={[
              styles.letterButton,
              wildCard.letter === letter && styles.selectedLetter
            ]}
            onPress={() => handleLetterPress(letter)}
          >
            <Text 
              style={[
                styles.letterText,
                wildCard.letter === letter && styles.selectedLetterText
              ]}
            >
              {letter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 15,
    elevation: 5, // Android elevation
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // marginVertical: 5,
  },
  letterButton: {
    width: 30,
    height: 30,
    margin: 3,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#3f51b5',
  },
  selectedLetter: {
    backgroundColor: '#3f51b5',
  },
  letterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedLetterText: {
    color: 'white',
  }
});

export default WildCardForm;