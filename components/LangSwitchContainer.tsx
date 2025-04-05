import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LangSwitch from './LangSwitch';
import { setLanguage } from "@/components/Translation/reducer";
import { RootState } from "@/reducer";

const LangSwitchContainer: React.FC = () => {
  const locale = useSelector((state: RootState) => state.translation.locale);
  const dispatch = useDispatch();

  const handleSetLanguage = (params: { locale: string }) => {
    dispatch(setLanguage(params));
    // Store the selected language in AsyncStorage
    AsyncStorage.setItem('locale', params.locale);
  };

  return (
    <LangSwitch
      locale={locale}
      setLanguage={handleSetLanguage}
    />
  );
};

export default LangSwitchContainer;