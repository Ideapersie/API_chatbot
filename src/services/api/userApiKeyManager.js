import { config } from '../../utils/config';

class UserApiKeyManager {
  constructor() {
    this.storageKey = 'chatbot_user_api_key';
    this.usageKey = 'chatbot_usage_count';
  }

  // Client-side API key management
  setUserApiKey(apiKey, baseUrl = null) {
    if (typeof window !== 'undefined') {
      const keyData = {
        apiKey: apiKey,
        baseUrl: baseUrl || config.api.kpitBaseUrl,
        timestamp: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(keyData));
    }
  }

  getUserApiKey() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          this.clearUserApiKey();
        }
      }
    }
    return null;
  }

  clearUserApiKey() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  hasUserApiKey() {
    const keyData = this.getUserApiKey();
    return keyData && keyData.apiKey;
  }

  // Usage tracking for guest mode
  getUsageCount() {
    if (typeof window !== 'undefined') {
      const count = localStorage.getItem(this.usageKey);
      return parseInt(count) || 0;
    }
    return 0;
  }

  incrementUsage() {
    if (typeof window !== 'undefined') {
      const currentCount = this.getUsageCount();
      localStorage.setItem(this.usageKey, (currentCount + 1).toString());
    }
  }

  resetUsage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.usageKey);
    }
  }

  canUseGuestMode() {
    if (!config.api.allowGuestMode) return false;
    return this.getUsageCount() < config.api.guestModeLimit;
  }

  getRemainingGuestMessages() {
    if (!config.api.allowGuestMode) return 0;
    return Math.max(0, config.api.guestModeLimit - this.getUsageCount());
  }

  // Validate API key format (basic validation)
  validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      return { valid: false, message: 'API key is required' };
    }

    if (apiKey.length < 10) {
      return { valid: false, message: 'API key appears to be too short' };
    }

    // Add more specific validation based on your API's key format
    // Example for OpenAI-style keys:
    // if (!apiKey.startsWith('sk-')) {
    //   return { valid: false, message: 'API key should start with "sk-"' };
    // }

    return { valid: true, message: 'API key format appears valid' };
  }

  // Get the appropriate API configuration for requests
  getApiConfig() {
    const userKey = this.getUserApiKey();

    if (config.api.requireUserApiKey && !userKey) {
      throw new Error('User API key is required but not provided');
    }

    if (userKey && userKey.apiKey) {
      return {
        apiKey: userKey.apiKey,
        baseUrl: userKey.baseUrl || config.api.kpitBaseUrl,
        source: 'user'
      };
    }

    if (config.api.allowGuestMode && this.canUseGuestMode()) {
      if (!config.api.kpitApiKey) {
        throw new Error('Server API key not configured for guest mode');
      }
      return {
        apiKey: config.api.kpitApiKey,
        baseUrl: config.api.kpitBaseUrl,
        source: 'guest'
      };
    }

    throw new Error('No valid API key available');
  }
}

export default UserApiKeyManager;