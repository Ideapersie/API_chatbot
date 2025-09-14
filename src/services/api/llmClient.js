import { config } from '../../utils/config';
import { ERROR_MESSAGES } from '../../utils/constants';
import UserApiKeyManager from './userApiKeyManager';

class LLMClient {
  constructor() {
    this.modelName = config.api.kpitModelName;
    this.timeout = config.api.timeout;
    this.userApiKeyManager = new UserApiKeyManager();
  }

  getApiConfig() {
    return this.userApiKeyManager.getApiConfig();
  }

  validateConfig(apiConfig) {
    if (!apiConfig.apiKey) {
      throw new Error('API key is not available');
    }
    if (!apiConfig.baseUrl) {
      throw new Error('API base URL is not configured');
    }
  }

  async sendMessage(message, context = {}) {
    const apiConfig = this.getApiConfig();
    this.validateConfig(apiConfig);

    try {
      // Track usage for guest mode
      if (apiConfig.source === 'guest') {
        this.userApiKeyManager.incrementUsage();
      }

      const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            ...(context.systemPrompt ? [{ role: 'system', content: context.systemPrompt }] : []),
            ...(context.history || []),
            { role: 'user', content: message }
          ],
          temperature: context.temperature || 0.7,
          max_tokens: context.maxTokens || 1000,
          stream: false
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage,
        model: data.model
      };

    } catch (error) {
      console.error('LLM API Error:', error);

      if (error.name === 'TimeoutError') {
        throw new Error('Request timeout - please try again');
      }
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }

      throw new Error(ERROR_MESSAGES.API_ERROR);
    }
  }

  async streamResponse(message, context = {}, onChunk) {
    const apiConfig = this.getApiConfig();
    this.validateConfig(apiConfig);

    try {
      // Track usage for guest mode
      if (apiConfig.source === 'guest') {
        this.userApiKeyManager.incrementUsage();
      }

      const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            ...(context.systemPrompt ? [{ role: 'system', content: context.systemPrompt }] : []),
            ...(context.history || []),
            { role: 'user', content: message }
          ],
          temperature: context.temperature || 0.7,
          max_tokens: context.maxTokens || 1000,
          stream: true
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6);
              if (data === '[DONE]') {
                return content;
              }

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices[0]?.delta?.content || '';
                if (delta) {
                  content += delta;
                  onChunk(delta, content);
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

      return content;

    } catch (error) {
      console.error('Streaming Error:', error);
      throw new Error(ERROR_MESSAGES.API_ERROR);
    }
  }
}

export default LLMClient;