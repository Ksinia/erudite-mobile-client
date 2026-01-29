import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TRANSLATIONS } from "@/constants/translations";
import { RootState } from "@/reducer";
import Translation from './Translation';

interface Props {
  translationKey: string;
  args?: string[];
}

const TranslationContainer: React.FC<Props> = ({ translationKey, args }) => {
  const locale = useSelector((state: RootState) => state.translation?.locale ?? 'ru_RU');

  const translation = useMemo(() => {
    if (!translationKey || !locale) return '';
    try {
      let result = TRANSLATIONS[locale][translationKey];
      if (args && args.length > 0) {
        args.forEach((arg) => (result = result.replace('{}', arg)));
      }
      return result;
    } catch {
      return '';
    }
  }, [translationKey, locale, args]);

  if (!translation) return null;
  return <Translation translation={translation} />;
};

export default TranslationContainer;
