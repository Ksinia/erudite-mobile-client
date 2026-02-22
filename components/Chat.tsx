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
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducer';
import { clearMessages } from '@/reducer/chat';
import { User, Message } from '@/reducer/types';
import { useAppDispatch } from '@/hooks/redux';
import { TRANSLATIONS } from '@/constants/translations';
import { sendChatMessageWithAck } from '@/thunkActions/chat';

interface ChatProps {
  players: User[];
  gamePhase: string;
  resetScroll?: number;
}

const Chat: React.FC<ChatProps> = ({ players, gamePhase, resetScroll }) => {
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
            <View key={msg.id || index} style={styles.messageWrapper}>
              <Text style={styles.messageText}>
                {msg.name}: {msg.text}
              </Text>
            </View>
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
});

export default Chat;