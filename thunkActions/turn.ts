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

      const action: GameUpdatedAction = await response.json();
      dispatch(action);
    } catch (error) {
      dispatch(errorFromServer(error, 'turn'));
    }
  };
