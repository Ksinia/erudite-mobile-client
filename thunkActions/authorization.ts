import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { MyThunkAction } from '../reducer/types';
import { LoginSuccessAction } from '../reducer/auth';
import { errorFromServer, loginSignupFunctionErrorCtx } from './errorHandling';
import { TRANSLATIONS } from '@/constants/translations';
import config from "@/config"

const backendUrl = config.backendUrl;

export const loginSignupFunction =
  (
    type: string,
    name: string,
    password: string,
    navigation: any,
    email?: string
  ): MyThunkAction<LoginSuccessAction> =>
  async (dispatch, getState) => {
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

      const data = await response.json();

      if (!response.ok) {
        if (data && data.message) {
          throw new Error(data.message);
        }
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const action = data;

      await AsyncStorage.setItem('jwt', action.payload.jwt);

      dispatch(action);

      if (type === 'signup') {
        const locale = getState().translation?.locale ?? 'en_US';
        const message = TRANSLATIONS[locale]?.signup_success ?? 'You have signed up successfully!';
        Alert.alert('', message);
      }

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

        // Parse the JSON response regardless of success or failure
        const data = await response.json();
        
        if (!response.ok) {
          // If server returns error with message field, use that
          if (data && data.message) {
            throw new Error(data.message);
          }
          // Otherwise use status text
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        // Ensure the JWT is included in the user object for socket authentication
        const action = {
          ...data,
          payload: {
            ...data.payload,
            jwt,
          },
        };
        
        dispatch(action);
      } catch (error) {
        dispatch(errorFromServer(error, 'getProfileFetch'));
        // Remove JWT from AsyncStorage if expired
        await AsyncStorage.removeItem('jwt');
      }
    }
  };

export const appleSignIn =
  (navigation: any): MyThunkAction<LoginSuccessAction> =>
  async (dispatch) => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken, fullName, email } = credential;

      if (!identityToken) {
        throw new Error('apple_signin_failed');
      }

      const response = await fetch(`${backendUrl}/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identityToken,
          fullName: fullName
            ? { givenName: fullName.givenName, familyName: fullName.familyName }
            : null,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.message) throw new Error(data.message);
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      await AsyncStorage.setItem('jwt', data.payload.jwt);
      dispatch(data);
      navigation.replace('/');
    } catch (error) {
      if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') {
        return;
      }
      dispatch(errorFromServer(error, loginSignupFunctionErrorCtx));
    }
  };