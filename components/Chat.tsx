import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/reducer';
import { clearMessages } from '@/reducer/chat';
import { sendChatMessage } from '@/reducer/outgoingMessages';
import { User, Message } from '@/reducer/types';
import { useAppDispatch } from '@/hooks/redux';
import { TRANSLATIONS } from '@/constants/translations';

interface ChatProps {
  players: User[];
  gamePhase: string;
}

const Chat: React.FC<ChatProps> = ({ players, gamePhase }) => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  
  const user = useSelector((state: RootState) => state.user);
  const chat = useSelector((state: RootState) => state.chat);
  const locale = useSelector((state: RootState) => state.translation?.locale ?? 'ru_RU');
  
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

  const handleSendMessage = () => {
    if (message.trim()) {
      dispatch(sendChatMessage(message));
      setMessage('');
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
        {shouldShowInput && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder={getTranslation('message')}
              placeholderTextColor="#999"
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              multiline={false}
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Text style={styles.sendButtonText}>
                ↑
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <ScrollView 
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
    marginHorizontal: 10,
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
});

export default Chat;