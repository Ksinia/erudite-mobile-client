import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootState } from '../reducer';
import { getProfileFetch } from '../thunkActions/authorization';
import { 
  addUserToSocket, 
  removeUserFromSocket 
} from '../reducer/outgoingMessages';

// This component does not render anything, it just manages socket connections
const SocketInitializer: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const socketConnectionState = useSelector((state: RootState) => state.socketConnectionState);

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

  // This component doesn't render anything
  return null;
};

export default SocketInitializer;