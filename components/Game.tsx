import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';

import { letterValues } from '@/constants/letterValues';
import { Game as GameType, User } from '@/reducer/types';
import Board from './Board';
import TranslationContainer from './Translation/TranslationContainer';
import ShareButton from './ShareButton';
import { WildCardOnBoard } from './GameContainer';
import WildCardForm from './WildCardForm';
import Results from './Results';

type Props = {
  game: GameType;
  userLetters: string[];
  chosenLetterIndex: number | null;
  userBoard: string[][];
  userBoardEmpty: boolean;
  user: User | null;
  clickBoard: (x: number, y: number) => void;
  clickLetter: (index: number | null) => void;
  confirmTurn: () => Promise<void>;
  validateTurn: (validation: 'yes' | 'no') => Promise<void>;
  getNextTurn: (game: GameType) => number;
  returnLetters: () => void;
  playAgainWithSamePlayers: () => Promise<void>;
  undo: () => Promise<void>;
  change: () => void;
  findTurnUser: (game: GameType, id: number) => User;
  onChangeWildCard: (index: number, letter: string, x: number, y: number) => void;
  wildCardLetters: { letter: string; x: number; y: number }[];
  wildCardOnBoard: WildCardOnBoard;
  duplicatedWords: string[];
  shuffleLetters: () => void;
};

const Game: React.FC<Props> = (props) => {
  const showPlayAgain = props.game.phase === 'finished' && props.user;
  const isUserTurn = props.user &&
    props.game.turnOrder[props.game.turn] === props.user.id &&
    props.game.phase === 'turn';
  const isPlayerInGame = props.user &&
    props.game.turnOrder.includes(props.user.id) &&
    props.game.phase !== 'finished';
  const showValidationButtons = props.user &&
    props.game.turnOrder.includes(props.user.id) &&
    props.user.id === props.game.turnOrder[props.getNextTurn(props.game)] &&
    props.game.phase === 'validation';
  const showUndoButton = props.game.phase === 'validation' &&
    props.game.validated === 'no' &&
    props.user &&
    props.user.id === props.game.turnOrder[props.game.turn];
    
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>{props.game.id}</Text>
        <ShareButton gameId={props.game.id} started />
      </View>
      <View style={styles.boardContainer}>
        <Board
          clickBoard={(x, y) => props.clickBoard(x, y)}
          board={props.game.board}
          previousBoard={props.game.previousBoard}
          userBoard={props.userBoard}
          values={letterValues[props.game.language]}
          wildCardOnBoard={props.wildCardOnBoard}
        />
      </View>
      
      <View>
        <WildCardForm
          wildCardLetters={props.wildCardLetters}
          onChange={(letter, index, x, y) => props.onChangeWildCard(index, letter, x, y)}
          alphabet={Object.keys(letterValues[props.game.language])}
        />

        {props.user && (
          <View style={styles.lettersContainer}>
            {props.userLetters.map((letter, index) => (
              <Pressable
                key={index}
                style={[
                  styles.letterTile,
                  index === props.chosenLetterIndex && styles.selectedLetterTile
                ]}
                onPress={() => props.clickLetter(index)}
              >
                <Text style={styles.letterText}>{letter}</Text>
                <Text style={styles.letterValue}>
                  {letterValues[props.game.language][letter]}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        {props.duplicatedWords.length > 0 && (
          <Text style={styles.errorText}>
            <TranslationContainer
              translationKey="duplicated"
              args={[props.duplicatedWords.join(', ')]}
            />
          </Text>
        )}

        {props.game.phase === 'validation' &&
          props.game.wordsForValidation.length > 0 && (
          <Text style={styles.infoText}>
            <TranslationContainer
              translationKey="to_validate"
              args={[props.game.wordsForValidation.join(', ')]}
            />
          </Text>
        )}

        {showValidationButtons && (
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.gridButton}
              onPress={() => props.validateTurn('yes')}
            >
              <Text style={styles.buttonText}>
                <TranslationContainer
                  translationKey="i_confirm"
                  args={[
                    props.findTurnUser(
                      props.game,
                      props.game.turnOrder[props.game.turn]
                    ).name,
                  ]}
                />
              </Text>
            </Pressable>
            <Pressable
              style={styles.gridButton}
              onPress={() => props.validateTurn('no')}
            >
              <Text style={styles.buttonText}>
                <TranslationContainer
                  translationKey="no"
                  args={[
                    props.findTurnUser(
                      props.game,
                      props.game.turnOrder[props.game.turn]
                    ).name,
                  ]}
                />
              </Text>
            </Pressable>
          </View>
        )}

        {isPlayerInGame && (
          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              <Pressable style={styles.gridButton} onPress={props.shuffleLetters}>
                <Text style={styles.buttonText}>
                  <TranslationContainer translationKey="shuffle" />
                </Text>
              </Pressable>
              <Pressable
                style={[styles.gridButton, props.userBoardEmpty && styles.disabledButton]}
                onPress={props.returnLetters}
                disabled={props.userBoardEmpty}
              >
                <Text style={[styles.buttonText, props.userBoardEmpty && styles.disabledButtonText]}>
                  <TranslationContainer translationKey="return" />
                </Text>
              </Pressable>
            </View>
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.gridButton, !isUserTurn && styles.disabledButton]}
                onPress={props.confirmTurn}
                disabled={
                  !isUserTurn ||
                  props.wildCardLetters.some(
                    (letterObject) => letterObject.letter === ''
                  )
                }
              >
                <Text style={[styles.buttonText, !isUserTurn && styles.disabledButtonText]}>
                  {props.userBoardEmpty ? (
                    <TranslationContainer translationKey="pass" />
                  ) : (
                    <TranslationContainer translationKey="confirm" />
                  )}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.gridButton,
                  (!isUserTurn || props.game.letters.pot.length === 0) && styles.disabledButton,
                ]}
                onPress={props.change}
                disabled={!isUserTurn || props.game.letters.pot.length === 0}
              >
                <Text style={[
                  styles.buttonText,
                  (!isUserTurn || props.game.letters.pot.length === 0) && styles.disabledButtonText,
                ]}>
                  <TranslationContainer translationKey="change" />
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {showPlayAgain && (
            <Pressable
              style={styles.button}
              onPress={props.playAgainWithSamePlayers}
            >
              <Text style={styles.buttonText}>
                <TranslationContainer translationKey="play_again" />
              </Text>
            </Pressable>
          )}
          
          {props.game.phase === 'validation' &&
            props.game.validated === 'no' && (
            <View>
              <Text style={styles.infoText}>
                <TranslationContainer
                  translationKey="disagree"
                  args={[
                    props.findTurnUser(
                      props.game,
                      props.game.turnOrder[props.getNextTurn(props.game)]
                    ).name,
                    props.findTurnUser(
                      props.game,
                      props.game.turnOrder[props.game.turn]
                    ).name,
                  ]}
                />
              </Text>
              
              {showUndoButton && (
                <Pressable
                  style={styles.button}
                  onPress={props.undo}
                >
                  <Text style={styles.buttonText}>
                    <TranslationContainer translationKey="undo" />
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.statusContainer}>
          {props.game.phase !== 'finished' ? (
            props.game.phase === 'validation' ? (
              <Text style={styles.statusText}>
                <TranslationContainer
                  translationKey="validation"
                  args={[
                    props.findTurnUser(
                      props.game,
                      props.game.turnOrder[props.game.turn]
                    ).name,
                  ]}
                />
              </Text>
            ) : (
              <Text style={styles.statusText}>
                <TranslationContainer
                  translationKey="turn_of"
                  args={[
                    props.findTurnUser(
                      props.game,
                      props.game.turnOrder[props.game.turn]
                    ).name,
                  ]}
                />
              </Text>
            )
          ) : (
            <Text style={styles.statusText}>
              <TranslationContainer translationKey="game_over" />
            </Text>
          )}
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.sectionTitle}>
            <TranslationContainer translationKey="score" />
          </Text>
          <View style={styles.scoreTable}>
            {props.game.turnOrder.map((id) => {
              const user = props.game.users.find((user) => user.id === id);
              return (
                <View key={id} style={styles.scoreRow}>
                  <Text style={styles.playerName}>{user?.name}</Text>
                  <Text style={styles.playerScore}>{props.game.score[id]}</Text>
                </View>
              );
            })}
          </View>
        </View>
        
        {props.game.phase === 'finished' && 'result' in props.game && (
          <Results game={props.game} />
        )}
        
        <Text style={styles.lettersRemaining}>
          <TranslationContainer translationKey="letters" />
          {props.game.letters.pot.length}
        </Text>
        
        {props.game.turns && props.game.turns.length > 0 && (
          <View style={styles.turnsContainer}>
            <Text style={styles.sectionTitle}>
              <TranslationContainer translationKey="turns" />
            </Text>
            <View style={styles.turnsTable}>
              {props.game.turns
                .slice()
                .reverse()
                .map((turn, index) => {
                  const player = props.game.users.find((user) => user.id === turn.user);
                  return (
                    <View key={index} style={styles.turnRow}>
                      <Text style={styles.playerName}>{player?.name}</Text>
                      <View style={styles.turnDetails}>
                        {turn.words.length > 0 ? (
                          <Text style={styles.turnText}>
                            {turn.score}: {turn.words
                              .map(
                                (word) =>
                                  `${Object.keys(word)[0]} ${
                                    word[Object.keys(word)[0]]
                                  }`
                              )
                              .join(', ')}
                          </Text>
                        ) : (
                          <Text style={styles.turnText}>
                            {turn.changedLetters ? (
                              <TranslationContainer translationKey="changed" />
                            ) : (
                              <TranslationContainer translationKey="passed" />
                            )}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        )}
      </View>
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;
const s = screenWidth > 600 ? 1.4 : 1;
const maxBoardWidth = screenWidth > 600 ? 700 : 504;
const boardWidth = Math.min(screenWidth * 0.9, maxBoardWidth);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    width: boardWidth,
    alignSelf: 'center',
  },
  boardContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  lettersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 4 * s,
  },
  letterTile: {
    flex: 1,
    maxWidth: 45 * s,
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedLetterTile: {
    backgroundColor: '#e0e0e0',
    borderColor: '#aaa',
  },
  letterText: {
    fontSize: 34 * s,
    lineHeight: 34 * s,
  },
  letterValue: {
    position: 'absolute',
    top: 1,
    right: 1,
    fontSize: 10 * s,
  },
  sectionTitle: {
    fontSize: 16 * s,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonGrid: {
    marginVertical: 10,
    gap: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
  },
  gridButton: {
    flex: 1,
    backgroundColor: '#3f51b5',
    padding: 12 * s,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#888',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#3f51b5',
    padding: 12 * s,
    borderRadius: 4,
    marginVertical: 5,
    display: 'flex',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14 * s,
  },
  validationButtons: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: 5,
    width: '100%',
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 14 * s,
  },
  infoText: {
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 14 * s,
  },
  statusContainer: {
    marginVertical: 10,
    padding: 8 * s,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 16 * s,
    textAlign: 'center',
  },
  scoreContainer: {
    marginVertical: 10,
  },
  scoreTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8 * s,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  playerName: {
    flex: 2,
    fontSize: 14 * s,
  },
  playerScore: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 14 * s,
  },
  lettersRemaining: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14 * s,
  },
  turnsContainer: {
    marginVertical: 10,
  },
  turnsTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  turnRow: {
    flexDirection: 'row',
    padding: 8 * s,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  turnDetails: {
    flex: 3,
  },
  turnText: {
    flexWrap: 'wrap',
    fontSize: 14 * s,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  titleText: {
    fontSize: 16 * s,
    fontWeight: 'bold',
  },
});

export default Game;