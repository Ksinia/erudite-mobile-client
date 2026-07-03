import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { MyThunkAction } from '../reducer/types';
import { LoginSuccessAction } from '../reducer/auth';
import { errorFromServer, loginSignupFunctionErrorCtx } from './errorHandling';
import { TRANSLATIONS } from '@/constants/translations';
import config from "@/config"

const backendUrl = config.backendUrl;

// Build an error message from a non-OK response without letting a missing or
// non-JSON body throw (which would obscure the real HTTP status).
async function errorMessageFromResponse(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body && body.message) {
      return body.message;
    }
  } catch {
    // body was empty or not JSON; fall back to the status line
  }
  return `${response.status}: ${response.statusText}`;
}

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
      if (action.payload.refreshToken) {
        await AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
      }

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

export async function refreshTokens(): Promise<{ jwt: string; refreshToken: string } | null> {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) return null;
  try {
    const response = await fetch(`${backendUrl}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    await AsyncStorage.setItem('jwt', data.payload.jwt);
    await AsyncStorage.setItem('refreshToken', data.payload.refreshToken);
    return { jwt: data.payload.jwt, refreshToken: data.payload.refreshToken };
  } catch {
    return null;
  }
}

export const getProfileFetch =
  (jwt: string): MyThunkAction<LoginSuccessAction> =>
  async (dispatch) => {
    const url = `${backendUrl}/profile`;
    if (jwt) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        // Check the status before reading the body: a 401 may come with an
        // empty or non-JSON body, and parsing it first would throw straight
        // into the catch below, which keeps the (now dead) tokens.
        if (!response.ok) {
          if (response.status === 401) {
            const refreshed = await refreshTokens();
            if (refreshed) {
              const retryResponse = await fetch(url, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${refreshed.jwt}`,
                  'Content-Type': 'application/json',
                },
              });
              if (retryResponse.ok) {
                const retryData = await retryResponse.json();
                const action = {
                  ...retryData,
                  payload: { ...retryData.payload, jwt: refreshed.jwt },
                };
                dispatch(action);
                return;
              }
              // Only a fresh token being rejected again proves the tokens are
              // truly dead. Any other retry failure (5xx, network) is
              // transient, so we keep the tokens for a later attempt.
              if (retryResponse.status === 401) {
                await AsyncStorage.multiRemove(['jwt', 'refreshToken']);
              }
            }
            // refreshed === null means the refresh could not be completed
            // (no refresh token, or a transient failure); keep the tokens.
          }
          throw new Error(await errorMessageFromResponse(response));
        }

        const data = await response.json();
        const action = {
          ...data,
          payload: { ...data.payload, jwt },
        };

        dispatch(action);
      } catch (error) {
        // Network and server failures are transient: keep the stored tokens
        // so the session survives an offline start or a backend outage.
        dispatch(errorFromServer(error, 'getProfileFetch'));
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
      if (data.payload.refreshToken) {
        await AsyncStorage.setItem('refreshToken', data.payload.refreshToken);
      }
      dispatch(data);
      navigation.replace('/');
    } catch (error) {
      if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') {
        return;
      }
      dispatch(errorFromServer(error, loginSignupFunctionErrorCtx));
    }
  };