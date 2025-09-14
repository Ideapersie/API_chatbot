import { useState, useEffect } from 'react';
import { X, Key, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { config } from '../../utils/config';
import UserApiKeyManager from '../../services/api/userApiKeyManager';

const ApiKeyModal = ({ isOpen, onClose, onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState(config.api.kpitBaseUrl);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const apiKeyManager = new UserApiKeyManager();

  useEffect(() => {
    if (isOpen) {
      const existingKey = apiKeyManager.getUserApiKey();
      if (existingKey) {
        setApiKey(existingKey.apiKey);
        setBaseUrl(existingKey.baseUrl || config.api.kpitBaseUrl);
      }
    }
  }, [isOpen]);

  const handleValidateAndSave = async () => {
    setIsValidating(true);
    setValidation(null);

    try {
      // Basic validation
      const basicValidation = apiKeyManager.validateApiKey(apiKey);
      if (!basicValidation.valid) {
        setValidation({ type: 'error', message: basicValidation.message });
        setIsValidating(false);
        return;
      }

      // Optional: Test API key with a simple request
      // You can uncomment this if you want to validate the key by making a test call
      /*
      const testResponse = await fetch(`${baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!testResponse.ok) {
        setValidation({
          type: 'error',
          message: 'API key validation failed. Please check your key and URL.'
        });
        setIsValidating(false);
        return;
      }
      */

      // Save the API key
      apiKeyManager.setUserApiKey(apiKey, baseUrl);
      setValidation({ type: 'success', message: 'API key saved successfully!' });

      setTimeout(() => {
        onApiKeySet?.();
        onClose();
      }, 1000);

    } catch (error) {
      setValidation({
        type: 'error',
        message: 'Failed to validate API key. Please check your connection.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearKey = () => {
    apiKeyManager.clearUserApiKey();
    setApiKey('');
    setValidation({ type: 'success', message: 'API key cleared successfully!' });

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const getGuestModeInfo = () => {
    if (!config.api.allowGuestMode) return null;

    const remaining = apiKeyManager.getRemainingGuestMessages();
    return {
      remaining,
      total: config.api.guestModeLimit
    };
  };

  if (!isOpen) return null;

  const guestInfo = getGuestModeInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">API Key Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {guestInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Guest Mode Available</p>
                  <p>You have {guestInfo.remaining} of {guestInfo.total} free messages remaining.</p>
                  <p className="mt-1">Add your own API key for unlimited usage.</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              Your API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </button>
          </div>

          {showAdvanced && (
            <div>
              <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700 mb-2">
                API Base URL
              </label>
              <input
                type="url"
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.your-provider.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

          {validation && (
            <div className={`flex items-start gap-2 p-3 rounded-lg ${
              validation.type === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
            }`}>
              {validation.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              )}
              <p className={`text-sm ${
                validation.type === 'error' ? 'text-red-800' : 'text-green-800'
              }`}>
                {validation.message}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleValidateAndSave}
              disabled={!apiKey.trim() || isValidating}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Validating...' : 'Save API Key'}
            </button>

            {apiKeyManager.hasUserApiKey() && (
              <button
                onClick={handleClearKey}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
              >
                Clear
              </button>
            )}
          </div>

          {config.api.requireUserApiKey && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">API Key Required</p>
                  <p>An API key is required to use this chatbot.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;