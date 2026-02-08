import React from 'react';
import { Share, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducer';
import { TRANSLATIONS } from '@/constants/translations';
import config from '@/config';

interface Props {
  gameId: number;
  started?: boolean;
}

const ShareButton: React.FC<Props> = ({ gameId, started }) => {
  const locale = useSelector((state: RootState) => state.translation?.locale ?? 'ru_RU');
  const messageKey = started ? 'share_message_started' : 'share_message';
  const message = TRANSLATIONS[locale]?.[messageKey] ?? 'Check out my Erudit game!';

  const handleShare = async () => {
    const url = `${config.webUrl}/game/${gameId}`;
    try {
      await Share.share({ message: `${message} ${url}` });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <Pressable onPress={handleShare} style={styles.button} hitSlop={8}>
      <Ionicons name="share-outline" size={18} color="rgba(0,0,0,0.5)" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});

export default ShareButton;
