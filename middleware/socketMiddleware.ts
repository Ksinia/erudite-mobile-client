import { Middleware, UnknownAction } from '@reduxjs/toolkit';

// Type for Redux actions with payload
interface SocketAction extends UnknownAction {
  payload?: unknown;
}

// Type for incoming socket messages
interface IncomingMessage {
  type: string;
  payload?: unknown;
}

// Minimal socket interface - compatible with socket.io-client
interface SocketLike {
  on(event: string, callback: (data: unknown) => void): void;
  emit(event: string, data: unknown): void;
}

interface CreateSocketMiddlewareOptions {
  /** The socket.io event name to use for messages (default: 'action') */
  eventName?: string;
  /** Function to get extra data to enhance specific actions */
  enhanceAction?: (action: SocketAction, getState: () => unknown) => SocketAction;
}

/**
 * Creates a Redux middleware that bridges Redux actions with Socket.io
 *
 * - Outgoing: Actions matching the criteria are emitted to the server
 * - Incoming: Messages from the server are dispatched as Redux actions
 */
export function createSocketMiddleware(
  socket: SocketLike,
  outgoingActionTypes: string[],
  options: CreateSocketMiddlewareOptions = {}
): Middleware {
  const { eventName = 'action', enhanceAction } = options;

  // Convert to Set for O(1) lookup
  const outgoingTypes = new Set(outgoingActionTypes);

  return (store) => {
    // Handle incoming messages from server - dispatch them as Redux actions
    socket.on(eventName, (data: unknown) => {
      const message = data as IncomingMessage;
      if (message && message.type) {
        store.dispatch(message as UnknownAction);
      }
    });

    return (next) => (action) => {
      const socketAction = action as SocketAction;

      // Check if this action should be sent to the server
      if (socketAction.type && outgoingTypes.has(socketAction.type)) {
        // Log outgoing message
        console.log('🔴 OUTGOING SOCKET MESSAGE:', {
          type: socketAction.type,
          payload: socketAction.payload,
          timestamp: new Date().toISOString()
        });

        // Optionally enhance the action before sending
        const actionToSend = enhanceAction
          ? enhanceAction(socketAction, store.getState)
          : socketAction;

        // Emit to server
        socket.emit(eventName, actionToSend);
      }

      // Always pass action to next middleware / reducers
      return next(action);
    };
  };
}
