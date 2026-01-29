import { combineReducers } from 'redux';

import translation from '../components/Translation/reducer';
import user from './auth';
import error from './error';
import lobby from './lobby';
import games from './games';
import duplicatedWords from './duplicatedWords';
import finishedGames from './finishedGames';
import archivedGames from './archivedGames';
import chat from './chat';
import messagesCount from './messagesCount';
import socketConnectionState from './socketConnectionState';
import subscription from './subscription';
import notificationNavigation from './notificationNavigation';

const rootReducer = combineReducers({
  user,
  error,
  lobby,
  games,
  translation,
  duplicatedWords,
  finishedGames,
  archivedGames,
  chat,
  messagesCount,
  socketConnectionState,
  subscription,
  notificationNavigation,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
