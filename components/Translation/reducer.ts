import { createAction, createReducer } from '@reduxjs/toolkit';
import { InternalMessageTypes } from "@/constants/internalMessageTypes";
import * as Localization from 'expo-localization';

const locales = Localization.getLocales();
const defaultLocaleString: string = locales.find(locale => locale.languageTag === 'ru_RU')
    ? 'ru_RU'
    : 'en_US';

const initialState = {
  locale: defaultLocaleString,
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
