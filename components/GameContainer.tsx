import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';

import { backendUrl } from '@/runtime';
import { RootState } from '@/reducer';
import { User, Game as GameType } from '@/reducer/types';
import { errorFromServer } from '@/thunkActions/errorHandling';
import { noDuplications } from '@/reducer/duplicatedWords';
import Game from './Game';

/**
 * extract added letters from whole new hand
 */
const arrayDifference = (subArray: string[], array: string[]): string[] => {
  const sortedSubArray = [...subArray].sort();
  const sortedArray = [...array].sort();
  return sortedArray.reduce(
    (acc: { i: number; letters: string[] }, letter) => {
      if (acc.i === sortedSubArray.length) {
        acc.letters.push(letter);
        return acc;
      }
      if (letter === sortedSubArray[acc.i]) {
        acc.i++;
        return acc;
      }
      acc.letters.push(letter);
      return acc;
    },
    { i: 0, letters: [] }
  ).letters;
};

export type WildCardOnBoard = { [key: number]: { [key: number]: string } };

const getPreviousLetters = (
  userBoard: string[][],
  wildCardOnBoard: WildCardOnBoard,
  userLetters: string[]
): string[] => {
  const putLetters = userBoard.reduce((acc: string[], row) => {
    return acc
      .concat(row.filter((letter) => letter !== ''))
      .map((letter) => letter[0]);
  }, []);
  const changedLetters = Object.keys(wildCardOnBoard).reduce((acc, y) => {
    return acc.concat(
      Object.keys(wildCardOnBoard[parseInt(y)]).reduce((a, x) => {
        a.push(wildCardOnBoard[parseInt(y)][parseInt(x)]);
        return a;
      }, [] as string[])
    );
  }, [] as string[]);
  let prevLetters = userLetters.concat(putLetters).concat(changedLetters);
  if (changedLetters.length > 0) {
    prevLetters = arrayDifference(
      Array(changedLetters.length).fill('*'),
      prevLetters
    );
  }
  return prevLetters;
};

interface Props {
  gameId: number;
}

const GameContainer: React.FC<Props> = ({ gameId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const user = useSelector((state: RootState) => state.user);
  const games = useSelector((state: RootState) => state.games);
  const duplicatedWords = useSelector((state: RootState) => state.duplicatedWords);
  
  const game = games[gameId];
  
  const emptyUserBoard = Array(15)
    .fill(null)
    .map((_) => Array(15).fill(''));

  // State management
  const [chosenLetterIndex, setChosenLetterIndex] = useState<number | null>(null);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [userBoard, setUserBoard] = useState<string[][]>(emptyUserBoard.map((row) => row.slice()));
  const [wildCardLetters, setWildCardLetters] = useState<{ letter: string; x: number; y: number }[]>([]);
  const [wildCardOnBoard, setWildCardOnBoard] = useState<WildCardOnBoard>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Board click handler
  const clickBoard = useCallback((x: number, y: number) => {
    let updatedUserBoard = userBoard.map((row) => row.slice());
    let updUserLetters = userLetters.slice();
    let updatedWildCardLetters = wildCardLetters.slice();
    const userLetterOnBoard = userBoard[y][x];
    const letterOnBoard = game?.board[y][x] || null;
    const updatedWildCardOnBoard = { ...wildCardOnBoard };

    // if the cell is occupied by * and it is your turn you can exchange it
    // for the same letter and *  should be used on the same turn
    if (
      letterOnBoard &&
      letterOnBoard[0] === '*' &&
      game?.phase === 'turn' &&
      user &&
      user.id === game.turnOrder[game.turn] &&
      chosenLetterIndex !== null &&
      updUserLetters[chosenLetterIndex] === letterOnBoard[1]
    ) {
      const putLetter = updUserLetters.splice(
        chosenLetterIndex,
        1
      )[0];
      updUserLetters.push('*');
      updatedWildCardOnBoard[y] = updatedWildCardOnBoard[y] || {};
      updatedWildCardOnBoard[y][x] = putLetter;
      setChosenLetterIndex(null);
      setUserLetters(updUserLetters);
      setWildCardOnBoard(updatedWildCardOnBoard);
    }
    // if cell is empty (no letter from server) and chosenLetterIndex is not null
    // put letter into userBoard and remove letter from userLetters.
    else if (letterOnBoard === null && chosenLetterIndex !== null) {
      const putLetter = updUserLetters.splice(
        chosenLetterIndex,
        1
      )[0];
      // if user put * on the board, increase the qty of *
      if (putLetter === '*') {
        updatedWildCardLetters.push({ letter: '', y, x });
      }

      // If there is userLetter in that cell, put it back into userLetters
      if (userLetterOnBoard !== '') {
        updUserLetters.push(userLetterOnBoard[0]);
        if (userLetterOnBoard[0] === '*') {
          updatedWildCardLetters = wildCardLetters.filter(
            (letterObject) => letterObject.x !== x || letterObject.y !== y
          );
        }
      }
      updatedUserBoard[y][x] = putLetter;
      setChosenLetterIndex(null);
      setUserLetters(updUserLetters);
      setUserBoard(updatedUserBoard);
      setWildCardLetters(updatedWildCardLetters);
    } else if (
      // if cell has user letter and there is no chosen letter, return letter from board to userLetters
      letterOnBoard === null &&
      chosenLetterIndex === null
    ) {
      if (userLetterOnBoard !== '') {
        updUserLetters.push(userLetterOnBoard[0]);
        updatedUserBoard[y][x] = '';
        if (userLetterOnBoard[0] === '*') {
          updatedWildCardLetters = wildCardLetters.filter(
            (letterObject) => letterObject.x !== x || letterObject.y !== y
          );
        }
        setUserLetters(updUserLetters);
        setUserBoard(updatedUserBoard);
        setWildCardLetters(updatedWildCardLetters);
      }
    }
  }, [chosenLetterIndex, userBoard, userLetters, wildCardLetters, wildCardOnBoard, game, user]);

  // Letter click handler
  const clickLetter = useCallback((index: number | null) => {
    if (index === null) {
      setChosenLetterIndex(null);
      return;
    }

    if (chosenLetterIndex === null) {
      setChosenLetterIndex(index);
    } else {
      const updatedUserLetters = [...userLetters];
      const oldIndex = chosenLetterIndex;
      const newIndex = index;
      [updatedUserLetters[oldIndex], updatedUserLetters[newIndex]] = [
        updatedUserLetters[newIndex],
        updatedUserLetters[oldIndex],
      ];
      setChosenLetterIndex(null);
      setUserLetters(updatedUserLetters);
    }
  }, [chosenLetterIndex, userLetters]);

  // Return letters handler
  const returnLetters = useCallback(() => {
    setUserBoard(emptyUserBoard.map((row) => row.slice()));
    setUserLetters(getPreviousLetters(
      userBoard,
      wildCardOnBoard,
      userLetters
    ));
    setWildCardLetters([]);
    setWildCardOnBoard({});
  }, [userBoard, wildCardOnBoard, userLetters, emptyUserBoard]);

  // Confirm turn handler
  const confirmTurn = useCallback(async () => {
    if (!user || !game) return;
    
    const userBoardToSend = userBoard.map((row) =>
      row.map((cell) => {
        if (cell === '') {
          return null;
        } else {
          return cell;
        }
      })
    );
    
    try {
      const response = await fetch(`${backendUrl}/game/${gameId}/turn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({
          userBoard: userBoardToSend,
          wildCardOnBoard,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // The socket middleware will update the game state
    } catch (error) {
      dispatch(errorFromServer(error, 'confirmTurn'));
    }
  }, [user, game, userBoard, wildCardOnBoard, gameId, dispatch]);

  // Validate turn handler
  const validateTurn = useCallback(async (validation: 'yes' | 'no') => {
    if (!user || !game) return;
    
    try {
      const response = await fetch(`${backendUrl}/game/${gameId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({ validation }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // The socket middleware will update the game state
    } catch (error) {
      dispatch(errorFromServer(error, 'validateTurn'));
    }
  }, [user, game, gameId, dispatch]);

  // Get next turn
  const getNextTurn = useCallback((game: GameType) => {
    return (game.turn + 1) % game.turnOrder.length;
  }, []);

  // Undo handler
  const undo = useCallback(async () => {
    if (!user || !game) return;
    
    try {
      const response = await fetch(`${backendUrl}/game/${gameId}/undo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwt}`,
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // The socket middleware will update the game state
    } catch (error) {
      dispatch(errorFromServer(error, 'undo'));
    }
  }, [user, game, gameId, dispatch]);

  // Change letters handler
  const change = useCallback(async () => {
    if (!user || !game) return;
    
    try {
      const response = await fetch(`${backendUrl}/game/${gameId}/change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({
          letters: game.letters[user.id],
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // The socket middleware will update the game state
    } catch (error) {
      dispatch(errorFromServer(error, 'change'));
    }
  }, [user, game, gameId, dispatch]);

  // Find turn user
  const findTurnUser = useCallback((game: GameType, id: number): User => {
    const user = game.users.find((user) => user.id === id);
    if (user !== undefined) {
      return user;
    }
    console.warn("findTurnUser did not find a user. This shouldn't happen");
    return { id: -1, name: '', jwt: '' };
  }, []);

  // Wildcard change handler
  const onChangeWildCard = useCallback((index: number, letter: string, x: number, y: number) => {
    let updatedWildCardLetters = wildCardLetters.slice();
    updatedWildCardLetters[index].letter = letter;
    let updatedUserBoard = userBoard.map((row) => row.slice());
    updatedUserBoard[y][x] = `*${letter}`;
    setWildCardLetters(updatedWildCardLetters);
    setUserBoard(updatedUserBoard);
  }, [wildCardLetters, userBoard]);

  // Play again with same players
  const playAgainWithSamePlayers = useCallback(async () => {
    if (!user || !game) return;
    
    try {
      const response = await fetch(`${backendUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({
          maxPlayers: game.maxPlayers,
          language: game.language,
          players: game.turnOrder,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      router.push(`/game/${data.id}`);
    } catch (error) {
      dispatch(errorFromServer(error, 'playAgainWithSamePlayers'));
    }
  }, [user, game, router, dispatch]);

  // Initialize letters when game first loads or changes
  useEffect(() => {
    // Only initialize on first load or when game ID changes
    if (!game) {
      return;
    }
    
    if (user && game.turnOrder.includes(user.id)) {
      // Only update if we're in a game phase that needs letters
      if (game.phase === 'turn' || game.phase === 'validation' || game.phase === 'finished') {
        setUserLetters([...game.letters[user.id]]);
        setUserBoard(emptyUserBoard.map((row) => row.slice()));
        setWildCardLetters([]);
        setWildCardOnBoard({});
      }
      setLoading(false);
    }
  }, [game?.id, user?.id]); // Only re-run when game ID or user ID changes

  // Update component state when game updates
  useEffect(() => {
    if (!user || !game || !game.turnOrder.includes(user.id)) {
      return;
    }
    
    // Skip updates for certain game phases to prevent infinite loops
    if (game.phase === 'waiting' || game.phase === 'ready') {
      return;
    }
    
    // Use a ref to track previous game state to avoid unnecessary updates
    const gameStateKey = JSON.stringify({
      userLetters: game.letters[user.id],
      board: game.board,
      turn: game.turn,
      phase: game.phase
    });
    
    // Store the current game state for processing
    const serverLetters = game.letters[user.id];
    const prevLetters = getPreviousLetters(
      userBoard,
      wildCardOnBoard,
      userLetters
    );
    
    // Only update when we detect a change in the user's letters or board
    // if player has fewer letters than on server, just add letters from server
    if (prevLetters.length < serverLetters.length) {
      const addedLetters = arrayDifference(
        prevLetters,
        serverLetters
      );
      setUserLetters(serverLetters);
    }
    // if player's letters are same as on server, adjust for collisions
    else if (
      JSON.stringify([...prevLetters].sort()) ===
      JSON.stringify([...serverLetters].sort())
    ) {
      let boardChanged = false;
      let updatedWildCardLetters = [...wildCardLetters];
      let updatedUserLetters = [...userLetters];
      
      const updatedUserBoard = userBoard.map((line, yIndex) =>
        line.map((cell, xIndex) => {
          if (cell && game.board[yIndex][xIndex] !== null) {
            updatedUserLetters.push(cell[0]);
            boardChanged = true;
            if (cell[0] === '*') {
              updatedWildCardLetters = updatedWildCardLetters.filter(
                (letterObject) =>
                  letterObject.x !== xIndex || letterObject.y !== yIndex
              );
            }
            return '';
          } else {
            return cell;
          }
        })
      );
      
      if (boardChanged) {
        setUserLetters(serverLetters);
        setUserBoard(updatedUserBoard);
        setWildCardLetters(updatedWildCardLetters);
      }
    }
    // if player's letters are different than on server, reset completely
    else if (JSON.stringify([...prevLetters].sort()) !==
             JSON.stringify([...serverLetters].sort())) {
      setUserLetters([...serverLetters]);
      setUserBoard(emptyUserBoard.map((row) => row.slice()));
      setWildCardLetters([]);
      setWildCardOnBoard({});
    }
  }, [game?.id, game?.turn, game?.phase, 
      JSON.stringify(game?.letters), JSON.stringify(game?.board)]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(noDuplications());
    };
  }, [dispatch]);

  if (!game || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading game...</Text>
      </View>
    );
  }

  const userBoardEmpty = !userBoard.some((row: string[]) => !!row.join(''));

  return (
    <View style={styles.container}>
      <Game
        game={game}
        userLetters={userLetters}
        chosenLetterIndex={chosenLetterIndex}
        userBoard={userBoard}
        user={user}
        clickBoard={clickBoard}
        clickLetter={clickLetter}
        confirmTurn={confirmTurn}
        validateTurn={validateTurn}
        getNextTurn={getNextTurn}
        returnLetters={returnLetters}
        playAgainWithSamePlayers={playAgainWithSamePlayers}
        undo={undo}
        change={change}
        findTurnUser={findTurnUser}
        onChangeWildCard={onChangeWildCard}
        wildCardLetters={wildCardLetters}
        wildCardOnBoard={wildCardOnBoard}
        duplicatedWords={duplicatedWords}
        userBoardEmpty={userBoardEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameContainer;