import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface ExpoPushToken {
  type: 'expo';
  data: string;
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  private expoPushToken: string | null = null;

  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permission for push notifications was denied');
      return false;
    }

    return true;
  }

  async getExpoPushToken(): Promise<ExpoPushToken | null> {
    if (!Device.isDevice) {
      return null;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'e2ce87b9-6786-4a8d-bc8f-d9b606b83acb', // From app.json
      });

      this.expoPushToken = tokenData.data;

      return {
        type: 'expo',
        data: tokenData.data,
      };
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
    }
  }

  // Set up notification received listener
  addNotificationReceivedListener(handler: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(handler);
  }

  // Set up notification response listener (when user taps notification)
  addNotificationResponseReceivedListener(handler: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(handler);
  }

  // For iOS, set up categories for interactive notifications
  async setupNotificationCategories() {
    if (Platform.OS === 'ios') {
      await Notifications.setNotificationCategoryAsync('game_update', [
        {
          identifier: 'view_game',
          buttonTitle: 'View Game',
          options: {
            opensAppToForeground: true,
          },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('chat_message', [
        {
          identifier: 'reply',
          buttonTitle: 'Reply',
          options: {
            opensAppToForeground: true,
          },
        },
      ]);
    }
  }

  getCurrentToken(): string | null {
    return this.expoPushToken;
  }
}

export default new NotificationService();