import { configureStore } from '@reduxjs/toolkit';
import io from 'socket.io-client';

import rootReducer from './reducer';
import { createSocketMiddleware } from './middleware/socketMiddleware';
import { outgoingSocketActions, OutgoingMessageTypes } from './constants/outgoingMessageTypes';
import { IncomingMessageTypes } from './constants/incomingMessageTypes';
import {
  socketConnected,
  socketDisconnected,
} from './reducer/socketConnectionState';
import { enterLobby } from './reducer/outgoingMessages';
import config from "@/config"

const backendUrl = config.backendUrl;

// Define the shape of socket messages (for logging)
interface SocketMessage {
  type: IncomingMessageTypes | string;
  payload?: unknown;
}

// Create the socket connection
const socket = io(backendUrl, {
  path: '/socket',
  transports: ['websocket'] // Use WebSocket-only for better mobile performance
});

// Create the socket middleware with action enhancement for push tokens
const socketMiddleware = createSocketMiddleware(
  socket,
  outgoingSocketActions,
  {
    eventName: 'message',
    enhanceAction: (action, getState) => {
      // Enhance ADD_USER_TO_SOCKET action with push token
      if (action.type === OutgoingMessageTypes.ADD_USER_TO_SOCKET) {
        const state = getState() as RootState;
        const pushSubscription = state.subscription;

        const enhancedAction = {
          ...action,
          payload: {
            jwt: action.payload,
            pushToken: pushSubscription?.data || null
          }
        };

        console.log('🔴 Enhanced user socket action with push token:', enhancedAction);
        return enhancedAction;
      }

      return action;
    }
  }
);

// Configure the store with middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for socket.io
      immutableCheck: false, // Improve performance
    }).concat(socketMiddleware);
  }
});

// Track if this is the first connection or a reconnection
let hasConnectedBefore = false;

// Setup socket event handlers
socket.on('connect', () => {
  console.log('Socket connected, hasConnectedBefore:', hasConnectedBefore);
  store.dispatch(socketConnected());

  if (hasConnectedBefore) {
    console.log('Socket reconnected - re-establishing subscriptions');

    const state = store.getState();
    if (!state.activeGameScreen) {
      store.dispatch(enterLobby());
    }
  }

  hasConnectedBefore = true;
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected, reason:', reason);
  store.dispatch(socketDisconnected());
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
socket.on('connect_error', (error: Error) => {
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

export { socket };
export default store;
