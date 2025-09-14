# API_chatbot
Creating a simple website hosting a chatbot where the user can enter their own LLM's API key of choice, with extension of RAG and Agents in developmet


### Core Architecture

  1. Frontend Framework: Next.js

  - Why: Perfect for Vercel deployment, API routes, SSR/SSG capabilities
  - Styling: Tailwind CSS for rapid UI development
  - State Management: React Context + useReducer for chat state


  API Key Strategy Options

  Option 1: User-Provided API Keys (Recommended for public hosting)
  - Set REQUIRE_USER_API_KEY=true
  - Users enter their own API keys
  - Keys are stored locally in browser
  - No cost to you, unlimited usage for users

  Option 2: Guest Mode with Limited Usage
  - Set ALLOW_GUEST_MODE=true and GUEST_MODE_LIMIT=10
  - Users get X free messages using your API key
  - After limit, they must provide their own key
  - Good for demos/trials

  Option 3: Hybrid Approach
  - Both options enabled
  - Users can choose between guest mode or their own key

  Key Features Created

  1. UserApiKeyManager - Handles API key storage and validation
  2. Updated LLMClient - Works with both user and server API keys
  3. ApiKeyModal - UI component for key management
  4. Usage tracking - Monitors guest mode usage
  5. Local storage - Keys never leave the user's browser

  For Public Deployment

  The cleanest approach is Option 1 where users provide their own keys:
  - Zero API costs for you
  - Users have full control
  - Scales infinitely
  - Most privacy-friendly

## Development

To get started:

```bash
npm install
cp .env.example .env.local
# Configure your environment variables
npm run dev
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

---

Generated using Claude Code
