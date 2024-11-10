import { configureStore } from '@reduxjs/toolkit';
import yourReducer from './reducer'; // Import your reducer here

const store = configureStore({
  reducer: {
    yourState: yourReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
