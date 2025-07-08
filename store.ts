import { configureStore } from '@reduxjs/toolkit';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

import rootReducer from './reducer';
import { outgoingSocketActions } from './constants/outgoingMessageTypes';
import { IncomingMessageTypes } from './constants/incomingMessageTypes';
import {
  socketConnected,
  socketDisconnected,
} from './reducer/socketConnectionState';
import {
  addGameToSocket,
  addUserToSocket,
  enterLobby,
} from './reducer/outgoingMessages';
import config from "@/config"

const backendUrl = config.backendUrl;

// Define the shape of socket messages
interface SocketMessage {
  type: IncomingMessageTypes | string;
  payload?: unknown;
}

// Create the socket connection
const socket = io(backendUrl, {
  path: '/socket',
  transports: ['websocket'] // Use WebSocket-only for better mobile performance
});

// Create the Redux-Socket.io middleware with logging
const socketIoMiddleware = () => {
  const middleware = createSocketIoMiddleware(
    socket,
    outgoingSocketActions.map(type => type.toString()),
    {
      eventName: 'message',
      execute: (action, emit, next, dispatch) => {
        // Log outgoing socket messages
        console.log('🔴 OUTGOING SOCKET MESSAGE:', {
          type: action.type,
          payload: action.payload,
          timestamp: new Date().toISOString()
        });
        
        // Send the message
        emit('message', action);
        
        // Continue with Redux dispatch
        next(action);
      }
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
  
  // Get current state
  const state = store.getState();
  
  // Re-subscribe to any active games
  // Look through the games reducer for any active games
  const gameIds = Object.keys(state.games);
  
  console.log('Reconnecting to games:', gameIds);
  gameIds.forEach(id => {
    store.dispatch(addGameToSocket(parseInt(id, 10)));
  });
  
  // Refresh lobby data
  store.dispatch(enterLobby());
  store.dispatch(socketConnected());
});

// Add comprehensive logging for incoming socket messages
socket.on('message', (message: SocketMessage) => {
  console.log('🟢 INCOMING SOCKET MESSAGE:', {
    type: message?.type,
    payload: message?.payload,
    timestamp: new Date().toISOString()
  });
});

// Log socket errors
socket.on('error', (error: unknown) => {
  console.error('🔥 SOCKET ERROR:', {
    error: error,
    timestamp: new Date().toISOString()
  });
});

// Log connection state changes
socket.on('connect_error', (error: any) => {
  console.error('🔥 SOCKET CONNECTION ERROR:', {
    error: error.message,
    timestamp: new Date().toISOString()
  });
});

// Log when socket is connecting
socket.on('connecting', () => {
  console.log('🔵 SOCKET CONNECTING...', {
    timestamp: new Date().toISOString()
  });
});

// Log reconnection attempts
socket.on('reconnect_attempt', (attemptNumber: number) => {
  console.log('🔵 SOCKET RECONNECT ATTEMPT:', {
    attempt: attemptNumber,
    timestamp: new Date().toISOString()
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
