const TypingIndicator = ({ isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center space-x-2 px-4 py-3 animate-fade-in">
      <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
        <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">AI</span>
        </div>
      </div>
      <div className="bg-gray-100 rounded-2xl px-4 py-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;