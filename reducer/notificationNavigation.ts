import { createAction, createReducer } from '@reduxjs/toolkit';

interface NotificationNavigation {
  gameId: number;
  scrollToChat: boolean;
}

export const setNotificationNavigation = createAction<NotificationNavigation>('SET_NOTIFICATION_NAVIGATION');
export const clearNotificationNavigation = createAction('CLEAR_NOTIFICATION_NAVIGATION');

export default createReducer<NotificationNavigation | null>(null, (builder) =>
  builder
    .addCase(setNotificationNavigation, (_, action) => action.payload)
    .addCase(clearNotificationNavigation, () => null)
);
