import { useState } from 'react';
import { Key, Settings, MessageCircle } from 'lucide-react';
import Button from '../ui/Button';
import ApiKeyModal from '../ui/ApiKeyModal';
import { config } from '../../utils/config';
import UserApiKeyManager from '../../services/api/userApiKeyManager';

const Header = ({ onApiKeyUpdate }) => {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [userHasApiKey, setUserHasApiKey] = useState(false);

  const apiKeyManager = new UserApiKeyManager();

  // Check if user has API key on component mount
  useState(() => {
    setUserHasApiKey(apiKeyManager.hasUserApiKey());
  });

  const handleApiKeySet = () => {
    setUserHasApiKey(true);
    onApiKeyUpdate?.();
  };

  const getApiKeyButtonText = () => {
    if (config.api.requireUserApiKey && !userHasApiKey) {
      return 'Setup Required';
    }
    if (userHasApiKey) {
      return 'API Key';
    }
    if (config.api.allowGuestMode) {
      const remaining = apiKeyManager.getRemainingGuestMessages();
      return `${remaining} free left`;
    }
    return 'Setup API Key';
  };

  const getApiKeyButtonVariant = () => {
    if (config.api.requireUserApiKey && !userHasApiKey) {
      return 'danger';
    }
    return 'ghost';
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {config.app.name}
              </h1>
              <p className="text-sm text-gray-500">
                AI-powered chatbot
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* API Key Status/Button */}
            <Button
              variant={getApiKeyButtonVariant()}
              size="sm"
              onClick={() => setIsApiKeyModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>{getApiKeyButtonText()}</span>
            </Button>

            {/* Future: Settings button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => {
                // Future: Open settings modal
                console.log('Settings clicked');
              }}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Warning banner for missing API key */}
        {config.api.requireUserApiKey && !userHasApiKey && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Key className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">API Key Required:</span> Please configure your API key to start using the chatbot.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onApiKeySet={handleApiKeySet}
      />
    </>
  );
};

export default Header;