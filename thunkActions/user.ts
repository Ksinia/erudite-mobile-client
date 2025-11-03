import config from '@/config';
import { MyThunkAction } from '../reducer/types';
import {
  archivedGamesLoaded,
  ArchivedGamesLoadedAction,
} from '../reducer/archivedGames';
import {
  finishedGamesLoaded,
  FinishedGamesLoadedAction,
} from '../reducer/finishedGames';
import { errorFromServer } from './errorHandling';

const backendUrl = config.backendUrl;

export const loadFinishGames =
  (jwt: string): MyThunkAction<FinishedGamesLoadedAction> =>
  async (dispatch) => {
    try {
      const response = await fetch(`${backendUrl}/my/finished-games`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const action = finishedGamesLoaded(data);
      dispatch(action);
    } catch (error) {
      dispatch(errorFromServer(error, 'my finished games'));
    }
  };

export const loadArchivedGames =
  (jwt: string): MyThunkAction<ArchivedGamesLoadedAction> =>
  async (dispatch) => {
    try {
      const response = await fetch(`${backendUrl}/my/archived-games`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(archivedGamesLoaded(data));
    } catch (error) {
      dispatch(errorFromServer(error, 'my archived games'));
    }
  };