import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ChatWindow from '../components/chat/ChatWindow';
import InputArea from '../components/chat/InputArea';
import useChat from '../services/hooks/useChat';
import UserApiKeyManager from '../services/api/userApiKeyManager';
import { config } from '../utils/config';

export default function Home() {
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const apiKeyManager = new UserApiKeyManager();

  const {
    messages,
    streamingMessage,
    isLoading,
    canSendMessage,
    sendMessage,
    clearMessages,
    retryLastMessage
  } = useChat();

  // Check API key status on mount
  useEffect(() => {
    checkApiKeyStatus();
  }, []);

  const checkApiKeyStatus = () => {
    try {
      // Try to get API config - this will throw if no valid config is available
      apiKeyManager.getApiConfig();
      setApiKeyConfigured(true);
    } catch (error) {
      setApiKeyConfigured(false);
    }
  };

  const handleApiKeyUpdate = () => {
    checkApiKeyStatus();
  };

  const handleSendMessage = async (message) => {
    await sendMessage(message);
  };

  const canChat = canSendMessage && (apiKeyConfigured || config.api.allowGuestMode);

  return (
    <Layout onApiKeyUpdate={handleApiKeyUpdate}>
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Chat Window */}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          streamingMessage={streamingMessage}
        />

        {/* Input Area */}
        <InputArea
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!canChat}
        />

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-2 bg-gray-100 text-xs text-gray-600 border-t">
            <div className="max-w-4xl mx-auto">
              API Key: {apiKeyConfigured ? '✅' : '❌'} |
              Guest Mode: {config.api.allowGuestMode ? '✅' : '❌'} |
              Can Chat: {canChat ? '✅' : '❌'} |
              Messages: {messages.length}
              {config.api.allowGuestMode && (
                <> | Guest Messages Left: {apiKeyManager.getRemainingGuestMessages()}</>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}