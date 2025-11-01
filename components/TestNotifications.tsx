import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/reducer';
import NotificationService from '@/services/NotificationService';
import { subscriptionRegistered } from '@/reducer/subscription';

const TestNotifications: React.FC = () => {
  const dispatch = useDispatch();
  const subscription = useSelector((state: RootState) => state.subscription);
  const user = useSelector((state: RootState) => state.user);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string>('Unknown');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissions(status);
    } catch (error) {
      setPermissions(`Error: ${error}`);
    }
  };

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const requestTokenManually = async () => {
    addDebugInfo('Starting manual token request...');
    addDebugInfo(`Device.isDevice: ${Device.isDevice}`);
    
    try {
      const token = await NotificationService.getExpoPushToken();
      if (token) {
        addDebugInfo(`Got token: ${token.data.substring(0, 20)}...`);
        dispatch(subscriptionRegistered(token));
        addDebugInfo('Token dispatched to Redux');
      } else {
        addDebugInfo('Token was null');
      }
    } catch (error) {
      addDebugInfo(`Error: ${error}`);
    }
  };

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
        Device: {Device.isDevice ? 'Physical' : 'Simulator'}
      </Text>
      
      <Text style={styles.info}>
        Permissions: {permissions}
      </Text>
      
      <Text style={styles.info}>
        Push Token: {subscription?.data ? 'Available' : 'Not available'}
      </Text>
      
      {subscription?.data && (
        <Text style={styles.token}>
          Token: {subscription.data.substring(0, 50)}...
        </Text>
      )}

      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={requestTokenManually}>
        <Text style={styles.buttonText}>Request Push Token</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={sendTestNotification}>
        <Text style={styles.buttonText}>Send Test Game Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={sendTestChatNotification}>
        <Text style={styles.buttonText}>Send Test Chat Notification</Text>
      </TouchableOpacity>

      {debugInfo.length > 0 && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Info:</Text>
          {debugInfo.map((info, index) => (
            <Text key={index} style={styles.debugText}>{info}</Text>
          ))}
        </View>
      )}
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
  primaryButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  debugContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  debugText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
});

export default TestNotifications;