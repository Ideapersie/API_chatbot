import { useState, useCallback, useRef } from 'react';
import { MESSAGE_TYPES, CHAT_STATES, ERROR_MESSAGES, API_ENDPOINTS } from '../../utils/constants';
import { generateId } from '../../utils/helpers';
import UserApiKeyManager from '../api/userApiKeyManager';

const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [chatState, setChatState] = useState(CHAT_STATES.IDLE);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const apiKeyManager = new UserApiKeyManager();

  const addMessage = useCallback((content, type = MESSAGE_TYPES.USER) => {
    const message = {
      id: generateId(),
      content,
      type,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const addErrorMessage = useCallback((errorContent) => {
    addMessage(errorContent, MESSAGE_TYPES.ERROR);
    setChatState(CHAT_STATES.ERROR);
  }, [addMessage]);

  const clearError = useCallback(() => {
    setError(null);
    setChatState(CHAT_STATES.IDLE);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingMessage('');
    setChatState(CHAT_STATES.IDLE);
    setError(null);
  }, []);

  const canSendMessage = useCallback(() => {
    try {
      const apiConfig = apiKeyManager.getApiConfig();
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const sendMessage = useCallback(async (messageContent) => {
    if (chatState === CHAT_STATES.LOADING || !messageContent.trim()) {
      return;
    }

    // Check if we can send messages
    if (!canSendMessage()) {
      addErrorMessage('Please configure your API key or check your remaining free messages.');
      return;
    }

    // Clear any previous errors
    clearError();

    // Add user message
    const userMessage = addMessage(messageContent, MESSAGE_TYPES.USER);

    // Set loading state
    setChatState(CHAT_STATES.TYPING);
    setStreamingMessage('');

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          history: messages.slice(-10) // Send last 10 messages for context
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      // Check if the response is a stream
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/stream')) {
        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.substring(6).trim();
                if (data === '[DONE]') {
                  break;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.content || '';
                  if (content) {
                    fullResponse += content;
                    setStreamingMessage(fullResponse);
                  }
                } catch (e) {
                  // Skip invalid JSON chunks
                  continue;
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        // Add the complete response as a message
        if (fullResponse) {
          addMessage(fullResponse, MESSAGE_TYPES.ASSISTANT);
        }
      } else {
        // Handle regular JSON response
        const data = await response.json();
        addMessage(data.response || 'No response received', MESSAGE_TYPES.ASSISTANT);
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled, don't show error
        return;
      }

      console.error('Chat error:', error);

      // Handle specific error types
      if (error.message.includes('API key')) {
        addErrorMessage('API key error. Please check your configuration.');
      } else if (error.message.includes('Rate limit')) {
        addErrorMessage(ERROR_MESSAGES.RATE_LIMIT);
      } else if (error.message.includes('Network')) {
        addErrorMessage(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        addErrorMessage(ERROR_MESSAGES.API_ERROR);
      }

      setError(error.message);
    } finally {
      setStreamingMessage('');
      setChatState(CHAT_STATES.IDLE);
      abortControllerRef.current = null;
    }
  }, [chatState, messages, canSendMessage, addMessage, addErrorMessage, clearError]);

  const cancelMessage = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStreamingMessage('');
    setChatState(CHAT_STATES.IDLE);
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.type === MESSAGE_TYPES.USER);

    if (lastUserMessage) {
      // Remove error messages after the last user message
      const lastUserIndex = messages.findIndex(msg => msg.id === lastUserMessage.id);
      const filteredMessages = messages.slice(0, lastUserIndex + 1);
      setMessages(filteredMessages);

      // Retry sending the message
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  return {
    // State
    messages,
    chatState,
    streamingMessage,
    error,
    isLoading: chatState === CHAT_STATES.LOADING || chatState === CHAT_STATES.TYPING,
    canSendMessage: canSendMessage(),

    // Actions
    sendMessage,
    cancelMessage,
    retryLastMessage,
    clearMessages,
    clearError,

    // Utils
    addMessage
  };
};

export default useChat;