import { errorFromServer } from './errorHandling';
import { GameUpdatedAction } from '@/reducer/games';
import { MyThunkAction } from '@/reducer/types';
import config from "@/config"

const backendUrl = config.backendUrl;

// Fetch game data from the server
export const fetchGame = (
  gameId: number,
  jwt: string | null
): MyThunkAction<GameUpdatedAction> =>
  async (dispatch) => {
    try {
      const headers: Record<string, string> = {};
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
      }

      const response = await fetch(`${backendUrl}/game/${gameId}`, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const action: GameUpdatedAction = await response.json();
      dispatch(action);
    } catch (error) {
      dispatch(errorFromServer(error, 'fetch game'));
    }
  };
