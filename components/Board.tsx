import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import TranslationContainer from './Translation/TranslationContainer';
import { WildCardOnBoard } from './GameContainer';
import { Colors } from '@/constants/Colors';

type Props = {
  clickBoard: (x: number, y: number) => void;
  board: (string | null)[][];
  previousBoard: (string | null)[][];
  userBoard: string[][];
  values: { [key: string]: number };
  wildCardOnBoard: WildCardOnBoard;
};

// Board bonuses definition
const boardBonuses: {
  [key: number]: { [key: number]: [string, string, string] };
} = {
  0: {
    0: ['w3', 'x3', 'word'],
    3: ['l2', 'x2', 'letter'],
    7: ['w3', 'x3', 'word'],
  },
  1: {
    1: ['w2', 'x2', 'word'],
    5: ['l3', 'x3', 'letter'],
  },
  2: {
    2: ['w2', 'x2', 'word'],
    6: ['l2', 'x2', 'letter'],
  },
  3: {
    0: ['l2', 'x2', 'letter'],
    3: ['w2', 'x2', 'word'],
    7: ['l2', 'x2', 'letter'],
  },
  4: {
    4: ['w2', 'x2', 'word'],
  },
  5: {
    1: ['l3', 'x3', 'letter'],
  },
  6: {
    2: ['l2', 'x2', 'letter'],
    6: ['l2', 'x2', 'letter'],
  },
  7: {
    0: ['w3', 'x3', 'word'],
    3: ['l2', 'x2', 'letter'],
  },
};

const Board: React.FC<Props> = ({ 
  clickBoard, 
  board, 
  previousBoard, 
  userBoard, 
  values, 
  wildCardOnBoard 
}) => {
  // Calculate board cell size based on screen width
  const screenWidth = Dimensions.get('window').width;
  const cellSize = Math.floor((screenWidth - 30) / 15); // 15 cells per row with some margin
  
  // Create an empty 15x15 board
  const boardWithBonuses = Array(15).fill(null).map((_, y) => {
    return Array(15).fill(null).map((_, x) => {
      let cellClass = 'ordinary';
      let multiply = '';
      let unit = '';
      
      // Handle regular positions
      if (y in boardBonuses && x in boardBonuses[y]) {
        [cellClass, multiply, unit] = boardBonuses[y][x];
      } 
      // Handle symmetric positions (right side)
      else if (y in boardBonuses && (14 - x) in boardBonuses[y]) {
        [cellClass, multiply, unit] = boardBonuses[y][14 - x];
      }
      // Handle symmetric positions (bottom side)
      else if ((14 - y) in boardBonuses && x in boardBonuses[14 - y]) {
        [cellClass, multiply, unit] = boardBonuses[14 - y][x];
      }
      // Handle symmetric positions (bottom-right)
      else if ((14 - y) in boardBonuses && (14 - x) in boardBonuses[14 - y]) {
        [cellClass, multiply, unit] = boardBonuses[14 - y][14 - x];
      }

      return {
        x,
        y,
        cellClass,
        multiply,
        unit,
      };
    });
  });

  // Check if both board and previousBoard are available
  if (!board || !previousBoard) {
    return (
      <View style={styles.loadingContainer}>
        <Text><TranslationContainer translationKey="loading" /></Text>
      </View>
    );
  }

  return (
    <View style={styles.boardContainer}>
      {boardWithBonuses.map((row, y) => (
        <View key={`row-${y}`} style={styles.row}>
          {row.map((cell, x) => {
            // Get letter from board or wildcard
            const letter = wildCardOnBoard[y] && wildCardOnBoard[y][x]
              ? wildCardOnBoard[y][x]
              : board[y][x];

            // Determine cell style based on various conditions
            const isCenter = y === 7 && x === 7;
            const hasUserLetter = userBoard[y][x] !== '';
            const isNewLetter = !!board[y][x] && !previousBoard[y][x];

            return (
              <Pressable
                key={`cell-${x}-${y}`}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  getBonusStyle(cell.cellClass),
                  isCenter && styles.centerCell,
                  hasUserLetter && styles.userLetterCell,
                  isNewLetter && styles.newLetterCell,
                ]}
                onPress={() => clickBoard(x, y)}
              >
                {!letter && !userBoard[y][x] && (
                  <>
                    <Text style={styles.multiply}>{cell.multiply}</Text>
                    <Text style={styles.unit}>
                      <TranslationContainer translationKey={cell.unit} />
                    </Text>
                  </>
                )}

                {/* Show letter value */}
                {(letter || userBoard[y][x]) && (
                  <Text style={styles.letterValue}>
                    {letter && values[letter[0]]}
                    {userBoard[y][x] && values[userBoard[y][x][0]]}
                  </Text>
                )}

                {/* Show letter */}
                {letter && (
                  <Text style={styles.letter}>{letter}</Text>
                )}

                {/* Show user letter */}
                {userBoard[y][x] && (
                  <Text style={styles.userLetter}>{userBoard[y][x]}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};

// Helper function to get styles for different bonus types
const getBonusStyle = (bonusType: string) => {
  switch (bonusType) {
    case 'w3':
      return styles.wordTriple;
    case 'w2':
      return styles.wordDouble;
    case 'l3':
      return styles.letterTriple;
    case 'l2':
      return styles.letterDouble;
    default:
      return styles.ordinary;
  }
};

const styles = StyleSheet.create({
  boardContainer: {
    // padding: 2,
    // backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerCell: {
    backgroundColor: '#f0f0f0', // Light gray for center cell
  },
  ordinary: {
    backgroundColor: '#fff',
  },
  wordTriple: {
    backgroundColor: Colors.red, // w3 - word triple
  },
  wordDouble: {
    backgroundColor: Colors.blue, // w2 - word double
  },
  letterTriple: {
    backgroundColor: Colors.orange, // l3 - letter triple
  },
  letterDouble: {
    backgroundColor: Colors.green, // l2 - letter double
  },
  userLetterCell: {
    backgroundColor: Colors.lightPurple, // Light purple for user letters
  },
  newLetterCell: {
    backgroundColor: Colors.lightGoldenrod, // Light goldenrod for new letters
  },
  multiply: {
    fontSize: 10,
    position: 'absolute',
    top: 2,
    right: 2,
  },
  unit: {
    fontSize: 9,
    textAlign: 'center',
  },
  letterValue: {
    fontSize: 9,
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  letter: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  userLetter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196f3',
  },
});

export default Board;