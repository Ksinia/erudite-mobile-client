import React from 'react';
import { Text } from 'react-native';

type Props = {
  translation: string;
};

const Translation: React.FC<Props> = ({ translation }) => {
  return <Text>{translation}</Text>;
};

export default Translation;
