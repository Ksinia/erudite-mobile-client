import { createAction, createReducer } from '@reduxjs/toolkit';

interface ActiveGameScreen {
  gameId: number;
  chatVisible: boolean;
}

export const setActiveGameScreen = createAction<ActiveGameScreen>('SET_ACTIVE_GAME_SCREEN');
export const clearActiveGameScreen = createAction('CLEAR_ACTIVE_GAME_SCREEN');
export const setChatVisible = createAction<boolean>('SET_CHAT_VISIBLE');

export default createReducer<ActiveGameScreen | null>(null, (builder) =>
  builder
    .addCase(setActiveGameScreen, (_, action) => action.payload)
    .addCase(clearActiveGameScreen, () => null)
    .addCase(setChatVisible, (state, action) => {
      if (state) {
        state.chatVisible = action.payload;
      }
    })
);
