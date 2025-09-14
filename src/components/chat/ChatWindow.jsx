import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { MESSAGE_TYPES, CHAT_STATES } from '../../utils/constants';
import { generateId } from '../../utils/helpers';

const ChatWindow = ({ messages, isLoading, streamingMessage }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage, isLoading]);

  // Show welcome message if no messages
  const showWelcome = messages.length === 0 && !isLoading;

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto bg-gray-50"
      style={{ height: 'calc(100vh - 140px)' }}
    >
      {showWelcome && (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-sm text-white font-bold">AI</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to AI Chat
            </h2>
            <p className="text-gray-600 mb-4">
              Start a conversation by typing a message below. I'm here to help with any questions you might have!
            </p>
            <div className="text-sm text-gray-500 bg-gray-100 rounded-lg p-3">
              <p className="font-medium mb-1">Tips:</p>
              <ul className="text-left space-y-1">
                <li>• Ask me anything - I can help with various topics</li>
                <li>• Use Shift+Enter for multi-line messages</li>
                <li>• Your conversations are private and secure</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!showWelcome && (
        <div className="py-4">
          {/* Render all messages */}
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.content}
              timestamp={message.timestamp}
              type={message.type}
            />
          ))}

          {/* Streaming message */}
          {streamingMessage && (
            <MessageBubble
              message={streamingMessage}
              timestamp={new Date()}
              type={MESSAGE_TYPES.ASSISTANT}
              isStreaming={true}
            />
          )}

          {/* Typing indicator */}
          <TypingIndicator isVisible={isLoading && !streamingMessage} />

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Empty state for when there's an error */}
      {messages.length > 0 && messages[messages.length - 1]?.type === MESSAGE_TYPES.ERROR && (
        <div className="p-4">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              There was an issue with your last message. Please try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;