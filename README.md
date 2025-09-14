# API_chatbot
Create a chatbot with a vercel frontend? using KPIT's API key for the chatbot

Project Structure

  api-chatbot/
  ├── src/
  │   ├── components/
  │   │   ├── chat/
  │   │   │   ├── ChatWindow.jsx
  │   │   │   ├── MessageBubble.jsx
  │   │   │   ├── InputArea.jsx
  │   │   │   └── TypingIndicator.jsx
  │   │   ├── ui/
  │   │   │   ├── Button.jsx
  │   │   │   ├── Input.jsx
  │   │   │   └── LoadingSpinner.jsx
  │   │   └── layout/
  │   │       ├── Header.jsx
  │   │       └── Layout.jsx
  │   ├── services/
  │   │   ├── api/
  │   │   │   ├── llmClient.js
  │   │   │   ├── ragService.js
  │   │   │   └── agentService.js
  │   │   └── hooks/
  │   │       ├── useChat.js
  │   │       ├── useRAG.js
  │   │       └── useAgent.js
  │   ├── utils/
  │   │   ├── config.js
  │   │   ├── constants.js
  │   │   └── helpers.js
  │   ├── styles/
  │   │   ├── globals.css
  │   │   └── components.css
  │   └── pages/
  │       ├── index.js
  │       └── api/
  │           ├── chat.js
  │           ├── rag/
  │           │   └── query.js
  │           └── agents/
  │               └── execute.js
  ├── public/
  │   ├── favicon.ico
  │   └── logo.png
  ├── .env.local
  ├── .env.example
  ├── vercel.json
  ├── package.json
  └── README.md

● Core Architecture

  1. Frontend Framework: Next.js

  - Why: Perfect for Vercel deployment, API routes, SSR/SSG capabilities
  - Styling: Tailwind CSS for rapid UI development
  - State Management: React Context + useReducer for chat state