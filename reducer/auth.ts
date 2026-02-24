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

// Thunk action that handles logout and AsyncStorage
export const logOutAndClearStorage = (): MyThunkAction<LogOutAction> => 
  async (dispatch) => {
    try {
      // Remove JWT from AsyncStorage
      await AsyncStorage.removeItem('jwt');
      // Dispatch the logout action
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
      AsyncStorage.removeItem('jwt');
      return null;
    })
    .addCase(updateEmail, (state, action) => {
      if (state) {
        state.email = action.payload;
      }
    })
);
