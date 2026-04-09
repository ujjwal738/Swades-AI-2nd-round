# Swades AI – Hono + Prisma + React

Minimal fullstack project:
- **Backend**: Hono + Node.js + TypeScript + Prisma (PostgreSQL)
- **Frontend**: Vite + React + TypeScript
- **Optional**: Vercel AI SDK (natural text via `generateText`)

## Setup

### Backend

1) Create `.env` from `.env.example` and set `DATABASE_URL` (PostgreSQL).
   - Optional: set `OPENAI_API_KEY` to enable natural language responses.

2) Install deps:

```bash
npm install
```

3) Run migrations and seed:

```bash
npm run prisma:migrate
npm run seed
```

4) Start backend:

```bash
npm run dev
```

Backend health:
- `GET /api/health`

### Frontend

1) Install deps:

```bash
cd frontend
npm install
```

2) Start frontend:

```bash
npm run dev
```

The frontend uses a dev proxy so calls to `/api/*` go to the backend at `http://localhost:3000`.

## API

### Chat
- `POST /api/chat/messages` body: `{ "conversationId": "...", "message": "..." }`
- `GET /api/chat/conversations`
- `GET /api/chat/conversations/:id`
- `DELETE /api/chat/conversations/:id`

### Agents
- `GET /api/agents`
- `GET /api/agents/:type/capabilities`


