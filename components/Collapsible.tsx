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
    backgroundColor: '#3f51b5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 10,
  },
});

export default Collapsible;