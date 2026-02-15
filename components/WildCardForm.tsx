import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  wildCardLetters: { letter: string; x: number; y: number }[];
  onChange: (letter: string, index: number, x: number, y: number) => void;
  alphabet: string[];
};

function WildCardForm(props: OwnProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  // Reset expanded state when wildcard count changes
  useEffect(() => {
    // If there's only one wildcard, expand it by default
    if (props.wildCardLetters.length === 1) {
      setExpandedIndex(0);
    } else {
      setExpandedIndex(null);
    }
  }, [props.wildCardLetters.length]);
  
  if (props.wildCardLetters.length === 0) {
    return null;
  }

  const handleLetterPress = (letter: string, index: number, x: number, y: number) => {
    props.onChange(letter, index, x, y);
    // Always collapse after selection
    setExpandedIndex(null);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const multipleWildcards = props.wildCardLetters.length > 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TranslationContainer translationKey="select" />
      </View>
      
      {props.wildCardLetters.map((wildCard, index) => (
        <View key={index} style={styles.wildcardItem}>
          <TouchableOpacity 
            style={styles.wildcardHeader}
            onPress={() => toggleExpand(index)}
          >
            <View style={styles.headerLeftContent}>
              <Text style={styles.dropdownIndicator}>
                {expandedIndex === index ? '▼' : '>'}
              </Text>
              {multipleWildcards && (
                <View style={styles.positionContainer}>
                  <TranslationContainer translationKey="position" />
                  <Text style={styles.positionText}>
                    : ({wildCard.x + 1}, {wildCard.y + 1})
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.headerRightContent}>
              <Text style={styles.selectedLetterLabel}>
                {wildCard.letter ? wildCard.letter : '-'}
              </Text>
            </View>

          </TouchableOpacity>

          {expandedIndex === index && (
            <View style={styles.letterGrid}>
              {props.alphabet.map((letter) => (
                letter !== '*' && (
                  <TouchableOpacity
                    key={letter}
                    style={[
                      styles.letterButton,
                      wildCard.letter === letter && styles.selectedLetter
                    ]}
                    onPress={() => handleLetterPress(letter, index, wildCard.x, wildCard.y)}
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
                )
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const sw = Dimensions.get('window').width;
const s = sw > 600 ? 1.4 : 1;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  wildcardItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  wildcardHeader: {
    padding: 10,
    backgroundColor: '#e6e6e6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
    justifyContent: 'flex-end',
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  positionText: {
    fontSize: 12,
    color: '#666',
  },
  selectedLetterLabel: {
    fontWeight: 'bold',
    color: '#3f51b5',
    fontSize: 18,
  },
  dropdownIndicator: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    marginRight: 4,
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'white',
  },
  letterButton: {
    width: 30 * s,
    height: 30 * s,
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
    fontSize: 16 * s,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedLetterText: {
    color: 'white',
  }
});

export default WildCardForm;