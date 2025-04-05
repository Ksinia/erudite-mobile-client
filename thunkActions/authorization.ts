import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendUrl } from '../runtime';
import { MyThunkAction } from '../reducer/types';
import { LoginSuccessAction, loginSuccess } from '../reducer/auth';
import { errorFromServer, loginSignupFunctionErrorCtx } from './errorHandling';

export const loginSignupFunction =
  (
    type: string,
    name: string,
    password: string,
    navigation: any,
    email?: string
  ): MyThunkAction<LoginSuccessAction> =>
  async (dispatch) => {
    const url = `${backendUrl}/${type}`;
    try {
      const body = type === 'login'
        ? JSON.stringify({ name, password })
        : JSON.stringify({ name, password, email });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      const action = data;

      // Store JWT token in AsyncStorage
      await AsyncStorage.setItem('jwt', action.payload.jwt);
      
      dispatch(action);
      
      // Navigate to home screen
      navigation.replace('/');
    } catch (error) {
      dispatch(errorFromServer(error, loginSignupFunctionErrorCtx));
    }
  };

export const getProfileFetch =
  (jwt: string): MyThunkAction<LoginSuccessAction> =>
  async (dispatch) => {
    const url = `${backendUrl}/profile`;
    if (jwt) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw response;
        }

        const data = await response.json();
        const action = data;
        dispatch(action);
      } catch (error) {
        dispatch(errorFromServer(error, 'getProfileFetch'));
        // Remove JWT from AsyncStorage if expired
        await AsyncStorage.removeItem('jwt');
      }
    }
  };