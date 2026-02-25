import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootState } from '@/reducer';
import { useAppDispatch } from '@/hooks/redux';
import { subscriptionRegistered } from '@/reducer/subscription';
import { addUserToSocket } from '@/reducer/outgoingMessages';
import NotificationService from '@/services/NotificationService';
import { TRANSLATIONS } from '@/constants/translations';

const STORAGE_KEY = 'notificationPermissionAsked';

const NotificationPermissionModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const locale = useSelector((state: RootState) => state.translation?.locale ?? 'ru_RU');
  const dispatch = useAppDispatch();

  const t = (key: string): string => {
    try {
      return TRANSLATIONS[locale][key] || key;
    } catch {
      return key;
    }
  };

  useEffect(() => {
    if (!user) return;

    const checkShouldShow = async () => {
      const alreadyAsked = await AsyncStorage.getItem(STORAGE_KEY);
      if (alreadyAsked) return;

      const status = await NotificationService.checkPermissionStatus();
      if (status === 'undetermined') {
        setVisible(true);
      }
    };

    checkShouldShow();
  }, [user]);

  const handleEnable = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);

    const pushToken = await NotificationService.getExpoPushToken();
    if (pushToken) {
      dispatch(subscriptionRegistered(pushToken));
      if (user?.jwt) {
        dispatch(addUserToSocket(user.jwt));
      }
    }
  };

  const handleDismiss = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.icon}>🔔</Text>
          <Text style={styles.title}>{t('notification_permission_title')}</Text>
          <Text style={styles.body}>{t('notification_permission_body')}</Text>
          <Pressable style={styles.enableButton} onPress={handleEnable}>
            <Text style={styles.enableButtonText}>{t('enable_notifications')}</Text>
          </Pressable>
          <Pressable style={styles.dismissButton} onPress={handleDismiss}>
            <Text style={styles.dismissButtonText}>{t('not_now')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  enableButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dismissButton: {
    paddingVertical: 10,
  },
  dismissButtonText: {
    color: '#999',
    fontSize: 14,
  },
});

export default NotificationPermissionModal;
