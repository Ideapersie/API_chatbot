import { MESSAGE_TYPES } from '../../utils/constants';
import { formatTimestamp } from '../../utils/helpers';
import { User, Bot } from 'lucide-react';

const MessageBubble = ({ message, timestamp, type, isStreaming = false }) => {
  const isUser = type === MESSAGE_TYPES.USER;
  const isError = type === MESSAGE_TYPES.ERROR;

  return (
    <div className={`flex items-start space-x-3 px-4 py-3 animate-slide-up ${
      isUser ? 'flex-row-reverse space-x-reverse' : ''
    }`}>
      {/* Avatar */}
      <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
        isUser
          ? 'bg-primary-600 text-white'
          : isError
            ? 'bg-red-100 text-red-600'
            : 'bg-primary-100 text-primary-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">AI</span>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-2 break-words ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : isError
              ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}>
          <div className="whitespace-pre-wrap">
            {message}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse">|</span>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTimestamp(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;