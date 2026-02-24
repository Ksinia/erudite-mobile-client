import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducer';
import { clearMessages } from '@/reducer/chat';
import { User, Message } from '@/reducer/types';
import { useAppDispatch } from '@/hooks/redux';
import { TRANSLATIONS } from '@/constants/translations';
import { sendChatMessageWithAck } from '@/thunkActions/chat';
import { addGameToSocket } from '@/reducer/outgoingMessages';
import config from '@/config';

interface ChatProps {
  players: User[];
  gamePhase: string;
  gameId: number;
  resetScroll?: number;
}

const Chat: React.FC<ChatProps> = ({ players, gamePhase, gameId, resetScroll }) => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendErrorKey, setSendErrorKey] = useState<string | null>(null);
  const chatScrollRef = useRef<ScrollView>(null);

  const user = useSelector((state: RootState) => state.user);
  const chat = useSelector((state: RootState) => state.chat);
  const locale = useSelector((state: RootState) => state.translation?.locale ?? 'ru_RU');
  const isConnected = useSelector((state: RootState) => state.socketConnectionState);
  
  const getTranslation = (key: string): string => {
    try {
      return TRANSLATIONS[locale][key] || key;
    } catch {
      return key;
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (resetScroll) {
      chatScrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [resetScroll]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    if (!isConnected) {
      setSendErrorKey('no_connection');
      return;
    }

    const messageToSend = message;
    setIsSending(true);
    setSendErrorKey(null);

    try {
      const response = await sendChatMessageWithAck(messageToSend);
      if (response.success) {
        setMessage('');
      } else {
        setSendErrorKey('send_failed');
      }
    } catch {
      setSendErrorKey('send_failed');
    } finally {
      setIsSending(false);
    }
  };

  const [feedbackKey, setFeedbackKey] = useState<string | null>(null);

  const handleMessageLongPress = (msg: Message) => {
    if (!user || msg.userId === user.id) return;
    Alert.alert(
      msg.name,
      msg.text,
      [
        {
          text: getTranslation('report_message'),
          onPress: () => handleReport(msg),
        },
        {
          text: getTranslation('block_user'),
          style: 'destructive',
          onPress: () => handleBlock(msg.userId),
        },
        { text: getTranslation('pass'), style: 'cancel' },
      ]
    );
  };

  const handleReport = async (msg: Message) => {
    try {
      const res = await fetch(`${config.backendUrl}/report-message`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user!.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageText: msg.text,
          messageSenderName: msg.name,
          gameId,
        }),
      });
      if (res.ok) {
        setFeedbackKey('message_reported');
        setTimeout(() => setFeedbackKey(null), 3000);
      } else {
        setSendErrorKey('send_failed');
      }
    } catch {
      setSendErrorKey('send_failed');
    }
  };

  const handleBlock = async (blockedUserId: number) => {
    try {
      const res = await fetch(`${config.backendUrl}/block-user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user!.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: blockedUserId }),
      });
      if (res.ok) {
        setFeedbackKey('user_blocked');
        setTimeout(() => setFeedbackKey(null), 3000);
        dispatch(addGameToSocket(gameId));
      } else {
        setSendErrorKey('send_failed');
      }
    } catch {
      setSendErrorKey('send_failed');
    }
  };

  const isPlayerInGame = user && players && players.some(player => player.id === user.id);
  const shouldShowInput = ((gamePhase === 'waiting' || gamePhase === 'ready') && user) || isPlayerInGame;
  

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.chatContainer}>
        {sendErrorKey && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{getTranslation(sendErrorKey)}</Text>
          </View>
        )}

        {feedbackKey && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>{getTranslation(feedbackKey)}</Text>
          </View>
        )}

        {shouldShowInput && (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isSending && styles.inputDisabled]}
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                if (sendErrorKey) setSendErrorKey(null);
              }}
              placeholder={getTranslation('message')}
              placeholderTextColor="#999"
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              multiline={false}
              editable={!isSending}
            />
            <TouchableOpacity
              style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!message.trim() || isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="rgb(60, 60, 60)" />
              ) : (
                <Text style={styles.sendButtonText}>↑</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          ref={chatScrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={true}
        >
          {chat.map((msg: Message, index: number) => (
            <TouchableOpacity
              key={msg.id || index}
              style={styles.messageWrapper}
              onLongPress={() => handleMessageLongPress(msg)}
              activeOpacity={0.7}
            >
              <Text style={styles.messageText}>
                {msg.name}: {msg.text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageWrapper: {
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: 'rgb(60, 60, 60)',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: 'rgb(60, 60, 60)',
    marginRight: 10,
    backgroundColor: 'white',
    height: 30,
  },
  sendButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'rgb(60, 60, 60)',
    fontSize: 20,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    textAlign: 'center',
  },
  feedbackContainer: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  feedbackText: {
    color: '#2e7d32',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Chat;