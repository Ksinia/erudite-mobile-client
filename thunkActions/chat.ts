import { socket } from '@/store';
import { OutgoingMessageTypes } from '@/constants/outgoingMessageTypes';

interface ChatMessageResponse {
  success: boolean;
  error?: string;
}

export const sendChatMessageWithAck = async (
  message: string
): Promise<ChatMessageResponse> => {
  const action = {
    type: OutgoingMessageTypes.SEND_CHAT_MESSAGE,
    payload: message,
  };

  try {
    const response = await socket
      .timeout(10000)
      .emitWithAck('message', action);
    return response ?? { success: true };
  } catch {
    return { success: false, error: 'Message send timeout' };
  }
};
