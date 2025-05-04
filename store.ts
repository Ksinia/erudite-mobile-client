import { configureStore } from '@reduxjs/toolkit';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

import rootReducer from './reducer';
import { backendUrl } from './runtime';
import { outgoingSocketActions } from './constants/outgoingMessageTypes';
import {
  socketConnected,
  socketDisconnected,
} from './reducer/socketConnectionState';
import {
  addGameToSocket,
  addUserToSocket,
  enterLobby,
} from './reducer/outgoingMessages';

// Create the socket connection
const socket = io(backendUrl, {
  path: '/socket',
  transports: ['websocket'] // Use WebSocket-only for better mobile performance
});

// Create the Redux-Socket.io middleware - wrap in a function for Redux Toolkit compatibility
const socketIoMiddleware = () => {
  const middleware = createSocketIoMiddleware(
    socket,
    outgoingSocketActions.map(type => type.toString()),
    {
      eventName: 'message',
    }
  );
  
  return middleware;
};

// Configure the store with middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    // Redux Toolkit already includes thunk by default
    return getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for socket.io
      immutableCheck: false, // Improve performance
    }).concat(socketIoMiddleware());
  }
});

// Setup socket event handlers
socket.on('connect', () => {
  console.log('Socket connected');
  store.dispatch(socketConnected());
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
  store.dispatch(socketDisconnected());
});

socket.on('reconnect', async () => {
  console.log('Socket reconnected');
  
  // Re-authenticate user if logged in
  const user = store.getState().user;
  if (user) {
    store.dispatch(addUserToSocket(user.jwt));
  }
  
  // Check current screen and dispatch appropriate actions
  store.dispatch(enterLobby());
  store.dispatch(socketConnected());
});

// Add logging for socket messages
socket.on('message', (message) => {
  console.log('Socket message received:', message?.type);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
