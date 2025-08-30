import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducer';

const TestNotifications: React.FC = () => {
  const subscription = useSelector((state: RootState) => state.subscription);
  const user = useSelector((state: RootState) => state.user);

  const sendTestNotification = async () => {
    if (!subscription?.data) {
      Alert.alert('Error', 'No push token available');
      return;
    }

    try {
      // This would normally be sent from your backend
      const message = {
        to: subscription.data,
        sound: 'default',
        title: 'Test Game Update',
        body: 'Your turn in the game!',
        data: {
          type: 'game_update',
          gameId: 123
        },
        categoryId: 'game_update'
      };

      // For testing, we'll schedule a local notification instead
      await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          data: message.data,
          categoryIdentifier: message.categoryId,
        },
        trigger: { seconds: 2 },
      });

      Alert.alert('Success', 'Test notification scheduled for 2 seconds');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const sendTestChatNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'New Chat Message',
          body: 'Player123: Hello everyone!',
          data: {
            type: 'chat_message',
            gameId: 456
          },
          categoryIdentifier: 'chat_message',
        },
        trigger: { seconds: 2 },
      });

      Alert.alert('Success', 'Test chat notification scheduled for 2 seconds');
    } catch (error) {
      console.error('Error sending test chat notification:', error);
      Alert.alert('Error', 'Failed to send test chat notification');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notification Testing</Text>
      
      <Text style={styles.info}>
        User: {user?.name || 'Not logged in'}
      </Text>
      
      <Text style={styles.info}>
        Push Token: {subscription?.data ? 'Available' : 'Not available'}
      </Text>
      
      {subscription?.data && (
        <Text style={styles.token}>
          Token: {subscription.data.substring(0, 50)}...
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={sendTestNotification}>
        <Text style={styles.buttonText}>Send Test Game Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={sendTestChatNotification}>
        <Text style={styles.buttonText}>Send Test Chat Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  token: {
    fontSize: 12,
    marginBottom: 15,
    color: '#999',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TestNotifications;