import { errorFromServer } from './errorHandling';
import { AppDispatch } from '@/store';
import config from "@/config"

const backendUrl = config.backendUrl;

// Fetch game data from the server
export const fetchGame = (gameId: number, jwt: string | null) => {
  return async (dispatch: AppDispatch) => {
    try {
      let response;
      
      // Make the API request with appropriate headers
      if (jwt) {
        response = await fetch(`${backendUrl}/game/${gameId}`, {
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        });
      } else {
        response = await fetch(`${backendUrl}/game/${gameId}`);
      }
      
      // Handle errors
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parse the response
      const data = await response.json();
      
      // Dispatch the game data to Redux
      if (data && data.payload && data.payload.game) {
        dispatch({
          type: 'GAME_UPDATED',
          payload: {
            gameId: gameId,
            game: data.payload.game
          }
        });
      } else {
        // Dispatch the whole response as the action
        dispatch(data);
      }
    } catch (error) {
      dispatch(errorFromServer(error, 'fetch game'));
    }
  };
};
