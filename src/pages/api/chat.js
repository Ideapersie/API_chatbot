import LLMClient from '../../services/api/llmClient';
import { ERROR_MESSAGES } from '../../utils/constants';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [], userApiKey, userBaseUrl } = req.body;

  // Validate request
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 4000) {
    return res.status(400).json({ error: 'Message too long' });
  }

  try {
    // Create LLM client instance
    const llmClient = new LLMClient();

    // If user provided their own API key, temporarily override
    if (userApiKey) {
      llmClient.userApiKeyManager.setUserApiKey(userApiKey, userBaseUrl);
    }

    // Check if streaming is requested
    const isStreamingRequest = req.headers.accept?.includes('text/stream') ||
                              req.headers['x-stream'] === 'true';

    if (isStreamingRequest) {
      // Set up streaming response
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      try {
        await llmClient.streamResponse(
          message,
          {
            history: history.slice(-10), // Limit context to last 10 messages
            systemPrompt: "You are a helpful AI assistant. Provide clear, concise, and accurate responses.",
            temperature: 0.7
          },
          (chunk, fullContent) => {
            // Send chunk to client
            res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
          }
        );

        // End the stream
        res.write('data: [DONE]\n\n');
        res.end();

      } catch (error) {
        console.error('Streaming error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }

    } else {
      // Regular JSON response
      try {
        const response = await llmClient.sendMessage(
          message,
          {
            history: history.slice(-10),
            systemPrompt: "You are a helpful AI assistant. Provide clear, concise, and accurate responses.",
            temperature: 0.7
          }
        );

        res.status(200).json({
          response: response.content,
          usage: response.usage,
          model: response.model
        });

      } catch (error) {
        console.error('Chat API error:', error);

        // Handle specific error types
        if (error.message.includes('API key')) {
          res.status(401).json({ error: 'Invalid or missing API key' });
        } else if (error.message.includes('rate limit')) {
          res.status(429).json({ error: ERROR_MESSAGES.RATE_LIMIT });
        } else if (error.message.includes('timeout')) {
          res.status(408).json({ error: 'Request timeout' });
        } else {
          res.status(500).json({ error: ERROR_MESSAGES.API_ERROR });
        }
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: ERROR_MESSAGES.API_ERROR });
  }
}