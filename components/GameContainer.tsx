import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect, useRouter } from "expo-router";

import { RootState } from '@/reducer';
import { User, Game as GameType } from '@/reducer/types';
import { errorFromServer } from '@/thunkActions/errorHandling';
import { noDuplications } from '@/reducer/duplicatedWords';
import { sendTurn } from '@/thunkActions/turn';
import Game from './Game';
import { useAppDispatch } from "@/hooks/redux";
import config from "@/config"

const backendUrl = config.backendUrl;

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
  game: GameType;
}

// Empty board constant - defined outside component to avoid recreating on each render
const EMPTY_USER_BOARD: string[][] = Array(15)
  .fill(null)
  .map(() => Array(15).fill(''));

const GameContainer: React.FC<Props> = ({ game }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);
  const duplicatedWords = useSelector((state: RootState) => state.duplicatedWords);

  // State management
  const [chosenLetterIndex, setChosenLetterIndex] = useState<number | null>(null);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [userBoard, setUserBoard] = useState<string[][]>(EMPTY_USER_BOARD.map((row) => row.slice()));
  const [wildCardLetters, setWildCardLetters] = useState<{ letter: string; x: number; y: number }[]>([]);
  const [wildCardOnBoard, setWildCardOnBoard] = useState<WildCardOnBoard>({});

  // Board click handler
  const clickBoard = useCallback((x: number, y: number) => {
    let updatedUserBoard = userBoard.map((row) => row.slice());
    let updUserLetters = userLetters.slice();
    let updatedWildCardLetters = wildCardLetters.slice();
    const userLetterOnBoard = userBoard[y][x];
    const letterOnBoard = game.board[y][x] || null;
    const updatedWildCardOnBoard = { ...wildCardOnBoard };

    // if the cell is occupied by * and it is your turn you can exchange it
    // for the same letter and *  should be used on the same turn
    if (
      letterOnBoard &&
      letterOnBoard[0] === '*' &&
      game.phase === 'turn' &&
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
    setUserBoard(EMPTY_USER_BOARD.map((row) => row.slice()));
    setUserLetters(getPreviousLetters(
      userBoard,
      wildCardOnBoard,
      userLetters
    ));
    setWildCardLetters([]);
    setWildCardOnBoard({});
  }, [userBoard, wildCardOnBoard, userLetters]);

  // Confirm turn handler
  const confirmTurn = async () => {
    console.log("confirming turn")
    if (!user) return;
    
    // Convert empty strings to null for API
    const userBoardToSend = userBoard.map((row) =>
      row.map((cell) => cell === '' ? null : cell)
    );
    
    // Use the thunk action which handles the API call and dispatching to Redux
    dispatch(sendTurn(
      game.id,
      user.jwt,
      userBoardToSend,
      wildCardOnBoard
    ));
    
  };

  // Validate turn handler
  // TODO: check if I really need callback here
  const validateTurn = useCallback(async (validation: 'yes' | 'no') => {
    if (!user) return;
    
    try {
      const response = await fetch(`${backendUrl}/game/${game.id}/approve`, {
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
  }, [user, game, dispatch]);

  // Get next turn
  const getNextTurn = useCallback((game: GameType) => {
    return (game.turn + 1) % game.turnOrder.length;
  }, []);

  // Undo handler
  const undo = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${backendUrl}/game/${game.id}/undo`, {
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
  }, [user, game, dispatch]);

  // Change letters handler
  const change = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${backendUrl}/game/${game.id}/change`, {
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
    } catch (error) {
      dispatch(errorFromServer(error, 'change'));
    }
  }, [user, game, dispatch]);

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
    if (!user) return;
    
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

  useFocusEffect(
    // To avoid running the effect too often, it's important to wrap the callback in useCallback before passing it to useFocusEffect
    useCallback(() => {
      if (
        user && game.turnOrder.includes(user.id)
      ) {
        // Get user's letters from server
        const serverLetters = game.letters[user.id];

        // Get letters that user currently has (including those placed on board)
        const prevLetters = getPreviousLetters(
          userBoard,
          wildCardOnBoard,
          userLetters
        );

        // CASE 1: User has fewer letters than on server - add the missing ones
        if (prevLetters.length < serverLetters.length) {
          const addedLetters = arrayDifference(
            prevLetters,
            serverLetters
          );
          const updatedUserLetters = userLetters.concat(addedLetters);

          setUserLetters(updatedUserLetters);
        }
        // CASE 2: User has the same letters - check for collisions
        else if (
          JSON.stringify([...prevLetters].sort()) ===
          JSON.stringify([...serverLetters].sort())
        ) {
          // Handle collisions - letters on board that the server has placed
          let wildCardLettersUpdated = [...wildCardLetters];
          let updatedLetters = [...userLetters];
          let boardChanged = false;

          const updatedUserBoard = userBoard.map((line, yIndex) =>
            line.map((cell, xIndex) => {
              // If user has a letter on a cell that now has a server letter
              if (cell && game.board[yIndex][xIndex] !== null) {
                // Return that letter to the user's hand
                updatedLetters.push(cell[0]);
                boardChanged = true;

                // Handle wildcards specially
                if (cell[0] === '*') {
                  wildCardLettersUpdated = wildCardLetters.filter(
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

          // Only update if we actually had board collisions
          if (boardChanged) {
            setUserLetters(updatedLetters);
            setUserBoard(updatedUserBoard);
            setWildCardLetters(wildCardLettersUpdated);
          }
        }
        // CASE 3: User's letters don't match server - reset completely
        else if (
          JSON.stringify([...prevLetters].sort()) !==
          JSON.stringify([...serverLetters].sort())
        ) {
          // Complete reset of everything
          setUserLetters([...serverLetters]);
          setUserBoard(EMPTY_USER_BOARD.map((row) => row.slice()));
          setWildCardLetters([]);
          setWildCardOnBoard({});
        }
      }
      return () => {
        dispatch(noDuplications());
      };
    }, [user, userBoard, userLetters, wildCardLetters, wildCardOnBoard,game.board, game.letters,  game.turnOrder, dispatch])
  )

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