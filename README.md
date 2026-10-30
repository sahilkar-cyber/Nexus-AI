# Nexus AI — DevFest Frontend

A responsive AI productivity workspace built with React, Vite, Tailwind CSS v4, Framer Motion, Recharts, and Lucide icons.

## Run locally

1. Install Node.js 18+.
2. Extract this project.
3. Open a terminal in the project folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Features

- Responsive sidebar navigation and dashboard
- Overview with productivity chart, goals, task list, and AI insight
- Create and complete tasks (client-side state)
- AI assistant chat UI with demo responses
- Document summarizer UI with local demo summarization
- Analytics page with interactive chart
- Dark mode toggle
- Mobile navigation and toast notifications

## Important demo note

The assistant and document summarizer currently use local demo logic so the frontend works without credentials. To make the AI features production-ready, connect a secure backend endpoint to a model API. Never put a private API key directly in frontend code.

## Suggested DevFest demo flow

1. Start at Overview and explain the productivity problem.
2. Add a task and mark it complete.
3. Open AI Assistant and ask it to plan your day.
4. Open Document Studio, paste a short brief, and generate a summary.
5. Show Analytics and switch to dark mode.
