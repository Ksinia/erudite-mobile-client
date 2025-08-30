import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import NotificationService from '@/services/NotificationService';

const NotificationHandler: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Handle notification received while app is in foreground
    const notificationListener = NotificationService.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      
      // You can customize this behavior
      // For example, show an in-app alert or update badge
      const { data } = notification.request.content;
      
      if (data?.type === 'game_update') {
        console.log('Game update notification received');
      } else if (data?.type === 'chat_message') {
        console.log('Chat message notification received');
      }
    });

    // Handle notification response (when user taps notification)
    const responseListener = NotificationService.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response:', response);
      
      const { data } = response.notification.request.content;
      
      // Navigate based on notification type
      if (data?.type === 'game_update' && data?.gameId) {
        console.log('Navigating to game:', data.gameId);
        router.push(`/(tabs)/game/${data.gameId}`);
      } else if (data?.type === 'chat_message' && data?.gameId) {
        console.log('Navigating to game chat:', data.gameId);
        router.push(`/(tabs)/game/${data.gameId}`);
      } else if (data?.type === 'turn_notification' && data?.gameId) {
        console.log('Navigating to game for turn:', data.gameId);
        router.push(`/(tabs)/game/${data.gameId}`);
      }
    });

    // Check if app was opened by a notification when it was killed/closed
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        console.log('App opened via notification:', response);
        
        const { data } = response.notification.request.content;
        if (data?.gameId) {
          // Small delay to ensure navigation is ready
          setTimeout(() => {
            router.push(`/(tabs)/game/${data.gameId}`);
          }, 1000);
        }
      }
    };

    checkInitialNotification();

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [router]);

  // This component doesn't render anything
  return null;
};

export default NotificationHandler;