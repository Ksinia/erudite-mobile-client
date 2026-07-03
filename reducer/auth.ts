import { createAction, createReducer } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { IncomingMessageTypes } from '../constants/incomingMessageTypes';
import { User, MyThunkAction } from './types';

export const loginSuccess = createAction<
  User,
  IncomingMessageTypes.LOGIN_SUCCESS
>(IncomingMessageTypes.LOGIN_SUCCESS);

export type LoginSuccessAction = ReturnType<typeof loginSuccess>;

export const errorLoaded = createAction<string, IncomingMessageTypes.ERROR>(
  IncomingMessageTypes.ERROR
);

export type ErrorLoadedAction = ReturnType<typeof errorLoaded>;

export const logOut = createAction<void, InternalMessageTypes.LOGOUT>(
  InternalMessageTypes.LOGOUT
);

export type LogOutAction = ReturnType<typeof logOut>;

export const updateEmail = createAction<string, InternalMessageTypes.UPDATE_EMAIL>(
  InternalMessageTypes.UPDATE_EMAIL
);

export type UpdateEmailAction = ReturnType<typeof updateEmail>;

export const jwtRefreshed = createAction<
  { jwt: string; refreshToken?: string },
  InternalMessageTypes.JWT_REFRESHED
>(InternalMessageTypes.JWT_REFRESHED);

export type JwtRefreshedAction = ReturnType<typeof jwtRefreshed>;

// Thunk action that handles logout and AsyncStorage
export const logOutAndClearStorage = (): MyThunkAction<LogOutAction> => 
  async (dispatch) => {
    try {
      await AsyncStorage.multiRemove(['jwt', 'refreshToken']);
      dispatch(logOut());
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      // Still dispatch logout even if AsyncStorage fails
      dispatch(logOut());
    }
  };

export default createReducer<User | null>(null, (builder) =>
  builder
    .addCase(loginSuccess, (_, action) => action.payload)
    .addCase(logOut, () => null)
    .addCase(errorLoaded, () => null)
    .addCase(InternalMessageTypes.LOGIN_OR_SIGNUP_ERROR, () => {
      AsyncStorage.multiRemove(['jwt', 'refreshToken']);
      return null;
    })
    .addCase(updateEmail, (state, action) => {
      if (state) {
        state.email = action.payload;
      }
    })
    .addCase(jwtRefreshed, (state, action) => {
      if (state) {
        state.jwt = action.payload.jwt;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
      }
    })
);
