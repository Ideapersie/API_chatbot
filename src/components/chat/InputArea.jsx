import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { UI_CONSTANTS } from '../../utils/constants';
import { isValidMessage, sanitizeInput } from '../../utils/helpers';

const InputArea = ({ onSendMessage, isLoading = false, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const sanitizedMessage = sanitizeInput(message);

    if (!isValidMessage(sanitizedMessage) || isLoading || disabled) {
      return;
    }

    onSendMessage(sanitizedMessage);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const remainingChars = UI_CONSTANTS.MAX_MESSAGE_LENGTH - message.length;
  const isOverLimit = remainingChars < 0;
  const isMessageValid = isValidMessage(message);

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? "Please configure your API key to start chatting..." : "Type your message..."}
              disabled={disabled || isLoading}
              rows={1}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                disabled
                  ? 'bg-gray-100 border-gray-200 text-gray-500'
                  : isOverLimit
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300'
              }`}
              style={{
                minHeight: '40px',
                maxHeight: '120px',
                height: 'auto'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />

            {/* Character count */}
            <div className={`text-xs mt-1 ${
              isOverLimit ? 'text-red-600' : remainingChars < 50 ? 'text-yellow-600' : 'text-gray-500'
            }`}>
              {remainingChars} characters remaining
            </div>
          </div>

          <div className="flex-shrink-0">
            <Button
              type="submit"
              disabled={!isMessageValid || isLoading || disabled || isOverLimit}
              loading={isLoading}
              className="h-10 w-10 p-0 rounded-lg"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Quick actions or suggestions could go here */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {isLoading && (
            <span className="flex items-center">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse mr-2"></div>
              AI is typing...
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default InputArea;