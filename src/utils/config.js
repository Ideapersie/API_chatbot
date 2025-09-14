export const config = {
  api: {
    kpitApiKey: process.env.KPIT_API_KEY,
    kpitBaseUrl: process.env.KPIT_API_BASE_URL || 'https://api.example.com',
    kpitModelName: process.env.KPIT_MODEL_NAME || 'default-model',
    timeout: 30000,
    // API Key Strategy
    requireUserApiKey: process.env.REQUIRE_USER_API_KEY === 'true',
    allowGuestMode: process.env.ALLOW_GUEST_MODE === 'true',
    guestModeLimit: parseInt(process.env.GUEST_MODE_LIMIT) || 10,
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'API Chatbot',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  rag: {
    enabled: process.env.VECTOR_DB_URL ? true : false,
    vectorDbUrl: process.env.VECTOR_DB_URL,
    vectorDbApiKey: process.env.VECTOR_DB_API_KEY,
    embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-ada-002',
  },
  agents: {
    enabled: process.env.AGENT_TOOLS_ENABLED === 'true',
  },
  ui: {
    maxMessages: 50,
    streamingDelay: 20,
    typingIndicatorDelay: 500,
  }
};