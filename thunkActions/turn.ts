import { WildCardOnBoard } from "@/components/GameContainer";
import { errorFromServer } from './errorHandling';
import { GameUpdatedAction } from "@/reducer/games";
import { MyThunkAction } from "@/reducer/types";
import { fetchGame } from './game';
import config from "@/config"

const backendUrl = config.backendUrl;

/**
 * Sends the user's turn to the server.
 * The server returns NO_DUPLICATIONS or DUPLICATED_WORDS (not GAME_UPDATED).
 * The actual game update comes via socket, but we also fetchGame as a fallback.
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

      const action = await response.json();
      dispatch(action);

      // Server returns NO_DUPLICATIONS (not GAME_UPDATED), so fetch the
      // updated game state explicitly. For DUPLICATED_WORDS the game hasn't
      // changed, but fetching is harmless.
      dispatch(fetchGame(gameId, jwt));
    } catch (error) {
      dispatch(errorFromServer(error, 'turn'));
    }
  };
