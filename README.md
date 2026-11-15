# API Chatbot

A bring-your-own-key chat app for any OpenAI-compatible LLM endpoint. Paste an API key and base URL, and you get a streaming chat interface backed by that model; the key stays in your browser and is sent only with your own requests. Built with Next.js 14 and Tailwind, deployable to Vercel as-is.

## Features

- **Streaming responses** over server-sent events from a Next.js API route (`src/pages/api/chat.js`), with a typing indicator and incremental rendering.
- **Two key modes.** Users can supply their own key and base URL (stored in `localStorage`, attached per request), or the deployment can offer a limited guest mode on a server-side key.
- **Conversation context** trimmed to the last 10 messages, and input validation (empty and over-length messages are rejected before any model call).
- **Model-agnostic client** (`src/services/api/llmClient.js`) that talks to any OpenAI-style `/chat/completions` endpoint.

## Running it

```bash
npm install
cp .env.example .env.local     # set the API base URL, model name and, for guest mode, a server key
npm run dev                    # http://localhost:3000
```

Deploy by importing the repo into Vercel; `vercel.json` is included. The environment variables are documented in `.env.example`. The `KPIT_*` names are historical and work with any OpenAI-compatible provider.

## Structure

```
src/
  pages/api/chat.js            chat endpoint: validation, key selection, streaming
  pages/index.js               app shell
  components/chat/             ChatWindow, MessageBubble, InputArea, TypingIndicator
  components/ui/ApiKeyModal.jsx  key and base-URL entry
  services/api/                LLM client and client-side key manager
  services/hooks/useChat.js    chat state and stream handling
chatbot_architect.py           design notes used to plan the architecture
```

## Status and known gaps

The chat app is complete. RAG and agent tools are planned (placeholders exist in `.env.example`) but not implemented. Before running this as a public service:

- The guest-mode usage counter lives in `localStorage`, so it's a UX limit rather than a real quota. A server-side rate limit (by IP or session) would be needed to protect the server key.
- When a user supplies their own key, the endpoint also accepts a user-supplied base URL and proxies to it. Restrict that to an allowlist of known providers.
