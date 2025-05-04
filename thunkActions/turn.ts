import { backendUrl } from '../runtime';
import { WildCardOnBoard } from '../components/GameContainer';
import { errorFromServer } from './errorHandling';
import { AppDispatch } from '@/store';
import { GameUpdatedAction } from "@/reducer/games";
import { MyThunkAction } from "@/reducer/types";

/**
 * Sends the user's turn to the server
 */
export const sendTurn = (
  gameId: number,
  jwt: string,
  userBoard: (string | null)[][],
  wildCardOnBoard: WildCardOnBoard
): MyThunkAction<GameUpdatedAction> =>
  async (dispatch) => {
    try {
      console.log('Sending turn for game:', gameId);
      
      const response = await fetch(`${backendUrl}/game/${gameId}/turn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
          userBoard,
          wildCardOnBoard,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response and dispatch the action
      const action: GameUpdatedAction = await response.json();
      console.log('Turn sent successfully, updating game state', action.type);
      
      // This dispatched action will update the game state
      // But actual game updates should also come through socket for all players
      dispatch(action);
      
      // Make sure we're still subscribed to this game
      dispatch({ type: 'ADD_GAME_TO_SOCKET', payload: gameId });
    } catch (error) {
      console.error('Error sending turn:', error);
      dispatch(errorFromServer(error, 'turn'));
    }
  };
