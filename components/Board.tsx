import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
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
  boardType?: 'classic' | 'infinite';
  boardOrigin?: { x: number; y: number };
};

const PATTERN_SIZE = 15;
// the pattern repeats every 14 cells: the outer x3 rows/columns are
// identical, so adjacent tiles share one border row instead of doubling it
const PATTERN_PERIOD = PATTERN_SIZE - 1;

const mod = (n: number): number => ((n % PATTERN_PERIOD) + PATTERN_PERIOD) % PATTERN_PERIOD;

// Board bonuses definition (top-left quadrant of the 15x15 pattern, mirrored)
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

const getBonus = (py: number, px: number): [string, string, string] => {
  const row = py in boardBonuses ? boardBonuses[py] : boardBonuses[PATTERN_SIZE - 1 - py];
  if (row) {
    const bonus = px in row ? row[px] : row[PATTERN_SIZE - 1 - px];
    if (bonus) return bonus;
  }
  return ['ordinary', '', ''];
};

const Board: React.FC<Props> = ({
  clickBoard,
  board,
  previousBoard,
  userBoard,
  values,
  wildCardOnBoard,
  boardType,
  boardOrigin,
}) => {
  const infinite = boardType === 'infinite';
  const originX = boardOrigin ? boardOrigin.x : 0;
  const originY = boardOrigin ? boardOrigin.y : 0;
  const origin = useMemo(() => ({ x: originX, y: originY }), [originX, originY]);
  const rows = board ? board.length : PATTERN_SIZE;
  const cols = board && board[0] ? board[0].length : PATTERN_SIZE;

  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth <= 400;
  const isTablet = screenWidth > 600;
  const maxBoardWidth = isTablet ? 700 : 504;
  const boardWidth = Math.min(isSmallScreen ? screenWidth - 4 : screenWidth * 0.9, maxBoardWidth);
  const cellSize = boardWidth / PATTERN_SIZE;

  const hScrollRef = useRef<ScrollView>(null);
  const vScrollRef = useRef<ScrollView>(null);
  const scrollOffset = useRef({ x: 0, y: 0 });
  const prevOriginRef = useRef(origin);
  const centeredRef = useRef(false);

  // keep the viewport stable: centre it once, then compensate the scroll
  // position whenever the board grows on the top/left (origin shift)
  useEffect(() => {
    if (!infinite || !board) return;
    if (!centeredRef.current) {
      centeredRef.current = true;
      prevOriginRef.current = origin;
      const x = Math.max(0, (cols * cellSize - boardWidth) / 2);
      const y = Math.max(0, (rows * cellSize - boardWidth) / 2);
      setTimeout(() => {
        hScrollRef.current?.scrollTo({ x, animated: false });
        vScrollRef.current?.scrollTo({ y, animated: false });
      }, 0);
      return;
    }
    const dx = origin.x - prevOriginRef.current.x;
    const dy = origin.y - prevOriginRef.current.y;
    prevOriginRef.current = origin;
    if (dx || dy) {
      hScrollRef.current?.scrollTo({ x: scrollOffset.current.x + dx * cellSize, animated: false });
      vScrollRef.current?.scrollTo({ y: scrollOffset.current.y + dy * cellSize, animated: false });
    }
  }, [infinite, board, origin, rows, cols, cellSize, boardWidth]);

  const dynamicStyles = {
    boardTableCell: {
      width: cellSize,
      height: cellSize,
    },
    multiply: {
      fontSize: cellSize * (isTablet ? 0.45 : 0.42),
    },
    unit: {
      fontSize: cellSize * (isTablet ? 0.3 : 0.28),
    },
    valueOnBoard: {
      top: -cellSize * 0.3,
      right: -cellSize * 0.02,
    },
    letter: {
      fontSize: cellSize * (isTablet ? 0.6 : 0.82),
    },
    letterValue: {
      fontSize: cellSize * (isTablet ? 0.24 : 0.3),
    },
  };

  // Check if both board and previousBoard are available
  if (!board || !previousBoard) {
    return (
      <View style={styles.loadingContainer}>
        <Text><TranslationContainer translationKey="loading" /></Text>
      </View>
    );
  }

  const grid = (
    <View
      style={[
        styles.boardContainer,
        infinite && {
          aspectRatio: undefined,
          width: cols * cellSize,
          height: rows * cellSize,
        },
      ]}
    >
      {board.map((boardRow, y) => (
        <View key={`row-${y}`} style={styles.row}>
          {boardRow.map((serverLetter, x) => {
            // position within the repeating bonus pattern
            const py = infinite ? mod(y - origin.y) : y;
            const px = infinite ? mod(x - origin.x) : x;
            const [cellClass, multiply, unit] = getBonus(py, px);

            // Get letter from board or wildcard
            const letter = wildCardOnBoard[y] && wildCardOnBoard[y][x]
              ? wildCardOnBoard[y][x]
              : serverLetter;
            const userLetter = (userBoard[y] && userBoard[y][x]) || '';

            // the start star marks only the centre of the original board,
            // it is not repeated on the tiled neighbours
            const isCenter = infinite
              ? y - origin.y === 7 && x - origin.x === 7
              : y === 7 && x === 7;
            const isNewLetter = !!serverLetter && !previousBoard[y][x];

            return (
              <Pressable
                key={`cell-${x}-${y}`}
                style={[
                  styles.cell,
                  dynamicStyles.boardTableCell,
                  { width: cellSize, height: cellSize },
                  getBonusStyle(cellClass),
                  isCenter && styles.centerCell,
                  isNewLetter && styles.newLetterBg,
                ]}
                onPress={() => clickBoard(x, y)}
              >
                {!letter && !userLetter ? (
                  <>
                    <Text style={[styles.multiply, dynamicStyles.multiply]}>{multiply}</Text>
                    <Text style={[styles.unit, dynamicStyles.unit]}>
                      {unit ? <TranslationContainer translationKey={unit} /> : null}
                    </Text>
                  </>
                ) : null}

                {/* Show letter value */}
                {(letter || userLetter) ? (
                  <Text style={[styles.letterValue, dynamicStyles.letterValue]}>
                    {letter && values[letter[0]]}
                    {userLetter && values[userLetter[0]]}
                  </Text>
                ) : null}

                {/* Show letter */}
                {letter ? (
                  <Text style={[styles.letter, dynamicStyles.letter, isNewLetter && styles.newLetter]}>{letter}</Text>
                ) : null}

                {/* Show user letter */}
                {userLetter ? (
                  <Text style={[styles.letter, dynamicStyles.letter, styles.userLetter]}>{userLetter}</Text>
                ): null}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );

  if (!infinite) {
    return grid;
  }

  return (
    <View style={[styles.viewport, { width: boardWidth, height: boardWidth }]}>
      <ScrollView
        ref={vScrollRef}
        nestedScrollEnabled
        onScroll={(event) => {
          scrollOffset.current.y = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <ScrollView
          ref={hScrollRef}
          horizontal
          nestedScrollEnabled
          onScroll={(event) => {
            scrollOffset.current.x = event.nativeEvent.contentOffset.x;
          }}
          scrollEventThrottle={16}
        >
          {grid}
        </ScrollView>
      </ScrollView>
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
    marginHorizontal: 'auto',
    aspectRatio: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  viewport: {
    alignSelf: 'center',
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
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 0,
    width: '100%',
    height: '100%',
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
  multiply: {
    fontSize: 10,
    color: 'whitesmoke',
  },
  unit: {
    fontSize: 7,
    textAlign: 'center',
    color: 'whitesmoke',
  },
  letterValue: {
    fontSize: 8,
    position: 'absolute',
    top: 0.5,
    right: 0.5,
  },
  letter: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  userLetter: {
    color: 'rgb(221, 43, 43)',
  },
  newLetter: {
    color: 'rgb(43, 160, 43)',
  },
  newLetterBg: {
    backgroundColor: 'lightgoldenrodyellow',
  }
});

export default Board;
