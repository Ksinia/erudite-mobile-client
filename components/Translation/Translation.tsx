import React, { Component } from 'react';
import { Text } from 'react-native';

type Props = {
  translation: string;
};

export default class Translation extends Component<Props> {
  render() {
    return <Text>{this.props.translation}</Text>;
  }
}
