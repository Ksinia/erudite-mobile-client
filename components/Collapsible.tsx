import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import TranslationContainer from './Translation/TranslationContainer';

type Props = {
  component: JSX.Element;
  translationKeyExpand: string;
  translationKeyCollapse: string;
};

export function Collapsible({ component, translationKeyExpand, translationKeyCollapse }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={toggle}>
        <Text style={styles.buttonText}>
          <TranslationContainer
            translationKey={isOpen ? translationKeyCollapse : translationKeyExpand}
          />
          {' '}{isOpen ? '\u25B2' : '\u25BC'}
        </Text>
      </Pressable>
      {isOpen && <View style={styles.content}>{component}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 10,
  },
});

export default Collapsible;