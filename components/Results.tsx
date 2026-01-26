import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Game } from '@/reducer/types';
import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  game: Game;
};

type ResultRow = [string, string];

function transformResults(game: Game): ResultRow[] {
  const results: ResultRow[] = [];

  // Winner(s)
  if (game.result.winner.length > 0) {
    results.push([
      'winner',
      game.result.winner
        .map((w) => {
          // Handle both number and string types from server
          const odId = typeof w === 'string' ? parseInt(w, 10) : w;
          return game.users.find((user) => user.id === odId)?.name;
        })
        .filter(Boolean)
        .join(', '),
    ]);
  }

  // Longest word(s)
  if (game.result.longestWord.length > 0) {
    const longestWord = game.result.longestWord.reduce(
      (acc, el) => {
        if (el.user in acc) {
          acc[el.user].push(el.word);
        } else {
          acc[el.user] = [el.word];
        }
        return acc;
      },
      {} as { [id: number]: string[] }
    );
    results.push([
      'longest_word',
      Object.keys(longestWord)
        .map(
          (odId) =>
            `${game.users.find((user) => user.id === parseInt(odId, 10))?.name}: ${longestWord[parseInt(odId, 10)].join(', ')}`
        )
        .join('; '),
    ]);
  }

  // Most valuable word(s)
  if (game.result.maxScoreWord.length > 0) {
    const maxScoreWord = game.result.maxScoreWord.reduce(
      (acc, el) => {
        if (el.user in acc) {
          acc[el.user].push(el.word);
        } else {
          acc[el.user] = [el.word];
        }
        return acc;
      },
      {} as { [id: number]: string[] }
    );
    results.push([
      'valuable_word',
      Object.keys(maxScoreWord)
        .map(
          (odId) =>
            `${game.users.find((user) => user.id === parseInt(odId, 10))?.name}: ${maxScoreWord[parseInt(odId, 10)].join(', ')}`
        )
        .join('; ') + ` (${game.result.maxScoreWord[0].value})`,
    ]);
  }

  // Best turn by word count
  if (
    game.result.bestTurnByCount.length > 0 &&
    game.result.bestTurnByCount[0].qty > 0
  ) {
    const names = game.result.bestTurnByCount.reduce(
      (acc, el) => {
        const name = game.users.find((user) => user.id === el.user)?.name;
        if (name && !acc.includes(name)) {
          acc.push(name);
        }
        return acc;
      },
      [] as string[]
    );
    results.push([
      'max_words',
      `${names.join(', ')} (${game.result.bestTurnByCount[0].qty})`,
    ]);
  }

  // Best turn by value
  if (
    game.result.bestTurnByValue.length > 0 &&
    game.result.bestTurnByValue[0].score > 0
  ) {
    const names = game.result.bestTurnByValue.reduce(
      (acc, el) => {
        const name = game.users.find((user) => user.id === el.user)?.name;
        if (name && !acc.includes(name)) {
          acc.push(name);
        }
        return acc;
      },
      [] as string[]
    );
    results.push([
      'valuable_turn',
      `${names.join(', ')} (${game.result.bestTurnByValue[0].score})`,
    ]);
  }

  // Never changed letters
  if (game.result.neverChangedLetters.length > 0) {
    results.push([
      'never_changed',
      game.result.neverChangedLetters
        .map((el) => game.users.find((user) => user.id === el)?.name)
        .filter(Boolean)
        .join(', '),
    ]);
  }

  return results;
}

function Results({ game }: OwnProps) {
  const results = transformResults(game);

  if (results.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <TranslationContainer translationKey="results" />
      </Text>
      <View style={styles.table}>
        {results.map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>
              <TranslationContainer translationKey={key} />
            </Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  table: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
});

export default Results;
