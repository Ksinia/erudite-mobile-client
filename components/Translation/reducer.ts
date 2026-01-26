import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from "@/constants/internalMessageTypes";
import * as Localization from 'expo-localization';

// Detect device language and map to supported locale
const getDefaultLocale = (): string => {
  const locales = Localization.getLocales();
  const deviceLanguage = locales[0]?.languageCode || 'en';

  // Support Russian if device language starts with 'ru'
  if (deviceLanguage.startsWith('ru')) {
    return 'ru_RU';
  }
  return 'en_US';
};

const initialState = {
  locale: getDefaultLocale(),
};

export const setLanguage = createAction<
  { locale: string },
  InternalMessageTypes.SET_LANGUAGE
>(InternalMessageTypes.SET_LANGUAGE);

export default createReducer<{ locale: string }>(initialState, (builder) =>
  builder.addCase(setLanguage, (state, action) => {
    return { ...state, locale: action.payload.locale };
  })
);
