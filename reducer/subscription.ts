import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from '../constants/internalMessageTypes';
import { ExpoPushToken } from '../services/NotificationService';

export const subscriptionRegistered = createAction<
  ExpoPushToken,
  InternalMessageTypes.SUBSCRIPTION_REGISTERED
>(InternalMessageTypes.SUBSCRIPTION_REGISTERED);

export type SubscriptionRegisteredAction = ReturnType<
  typeof subscriptionRegistered
>;

export default createReducer<ExpoPushToken | null>(null, (builder) =>
  builder.addCase(subscriptionRegistered, (_, action) => action.payload)
);
