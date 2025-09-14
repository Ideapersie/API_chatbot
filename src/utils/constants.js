export const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  ERROR: 'error'
};

export const CHAT_STATES = {
  IDLE: 'idle',
  TYPING: 'typing',
  LOADING: 'loading',
  ERROR: 'error'
};

export const EXTENSION_TYPES = {
  RAG: 'rag',
  AGENT: 'agent',
  TOOL: 'tool'
};

export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  RAG_QUERY: '/api/rag/query',
  AGENT_EXECUTE: '/api/agents/execute'
};

export const ERROR_MESSAGES = {
  API_ERROR: 'Sorry, I encountered an error. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  RATE_LIMIT: 'Rate limit exceeded. Please wait a moment.',
  INVALID_INPUT: 'Please enter a valid message.'
};

export const UI_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 4000,
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300
};