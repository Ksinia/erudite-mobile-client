import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootState } from "@/reducer";
import { getProfileFetch } from "@/thunkActions/authorization";
import { 
  addUserToSocket, 
  removeUserFromSocket 
} from "@/reducer/outgoingMessages";
import { useAppDispatch } from "@/hooks/redux";

// This component does not render anything, it just manages socket connections
const SocketInitializer: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const socketConnectionState = useSelector((state: RootState) => state.socketConnectionState);
  const appState = useRef(AppState.currentState);

  // Initialize the user from stored JWT when app starts
  useEffect(() => {
    const initializeFromStorage = async () => {
      try {
        const jwt = await AsyncStorage.getItem('jwt');
        if (jwt) {
          dispatch(getProfileFetch(jwt));
        }
      } catch (error) {
        console.error('Error retrieving JWT from AsyncStorage:', error);
      }
    };

    initializeFromStorage();
  }, [dispatch]);

  // Handle user changes - connect or disconnect from socket
  useEffect(() => {
    if (user && user.jwt) {
      console.log('User logged in, authenticating socket');
      dispatch(addUserToSocket(user.jwt));
    } else if (socketConnectionState) {
      console.log('User logged out, removing from socket');
      dispatch(removeUserFromSocket());
    }
  }, [user, socketConnectionState, dispatch]);

  // Handle app state changes - disconnect socket when backgrounded, reconnect when foregrounded
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('App state changing from', appState.current, 'to', nextAppState);
      
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground - reconnect user to socket
        console.log('App foregrounded, reconnecting user to socket');
        if (user && user.jwt) {
          dispatch(addUserToSocket(user.jwt));
        }
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App has gone to the background - disconnect user from socket
        console.log('App backgrounded, disconnecting user from socket');
        if (socketConnectionState) {
          dispatch(removeUserFromSocket());
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [user, socketConnectionState, dispatch]);

  // This component doesn't render anything
  return null;
};

export default SocketInitializer;