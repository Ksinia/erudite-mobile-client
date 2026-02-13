import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Href, useRouter } from 'expo-router';
import NotificationService from '@/services/NotificationService';
import { setNotificationNavigation } from '@/reducer/notificationNavigation';
import { useAppDispatch } from '@/hooks/redux';

const NotificationHandler: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Handle notification received while app is in foreground
    const notificationListener = NotificationService.addNotificationReceivedListener((notification) => {
      const { data } = notification.request.content;

      if (data?.type === 'game_update') {
        console.log('Game update notification received');
      } else if (data?.type === 'chat_message') {
        console.log('Chat message notification received');
      }
    });

    const navigateFromNotification = (data: Record<string, unknown>) => {
      if (!data?.gameId) return;

      dispatch(setNotificationNavigation({
        gameId: Number(data.gameId),
        scrollToChat: data.type === 'chat_message',
      }));

      router.push({
        pathname: `/(tabs)/game/[id]`,
        params: { id: String(data.gameId) },
      } as Href);
    };

    // Handle notification response (when user taps notification)
    const responseListener = NotificationService.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;
      navigateFromNotification(data as Record<string, unknown>);
    });

    // Check if app was opened by a notification when it was killed/closed
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        const { data } = response.notification.request.content;
        // Small delay to ensure navigation is ready
        setTimeout(() => {
          navigateFromNotification(data as Record<string, unknown>);
        }, 1000);
      }
    };

    checkInitialNotification();

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [router, dispatch]);

  return null;
};

export default NotificationHandler;
