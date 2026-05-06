# Astra Chat (Gemini Multimodal Chatbot)

A polished, ChatGPT-style Gemini chatbot with multimodal context (text, documents, and images), clean UX, and session memory. Built as a portfolio-ready demo with production-minded structure and error handling.

## Features
- Multimodal chat: text, PDF/TXT uploads, and PNG/JPG images
- Context-aware routing between document and image prompts
- Session memory (last 10 messages)
- New chat reset with clean state
- Markdown rendering (including code blocks)
- Typing indicator and copy-to-clipboard
- Dark mode toggle

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Axios
- Backend: Node.js, Express
- Uploads: Multer
- PDF parsing: pdf-parse
- AI: Google Generative AI SDK (Gemini)

## Prerequisites
- Node.js 20.19+ or 22.12+
- Gemini API key

## Setup

### Backend
```bash
cd server
cp .env.sample .env
# Add your GEMINI_API_KEY in .env
npm install
npm run dev
```

Backend runs at http://localhost:3001 by default.

### Frontend
```bash
cd client
npm install
npm run dev
```

Frontend runs at http://localhost:5173 by default.

## Environment Variables

| Name | Description | Default |
| --- | --- | --- |
| GEMINI_API_KEY | Gemini API key | (required) |
| GEMINI_MODEL | Primary Gemini model | gemini-flash-latest |
| GEMINI_FALLBACK_MODEL | Fallback model if primary fails | gemini-pro-latest |
| DOCUMENT_TEXT_LIMIT | Max document chars sent | 12000 |
| CORS_ORIGINS | Allowed origins (comma-separated) | http://localhost:5173 |
| PORT | Backend port | 3001 |

## API

### POST /chat
Accepts multipart form data:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| message | string | optional | Can be empty for file-only requests |
| chatHistory | string | optional | JSON array of messages |
| documentText | string | optional | Used for TXT content |
| document | file | optional | PDF/TXT file |
| image | file | optional | PNG/JPG file |

## Usage

1. Upload a document or image (optional).
2. Ask a question (e.g., “Summarize this document”, “What is in this image?”).
3. Use **New Chat** to reset context.

## Notes
- Max upload size is 8 MB per file.
- For non-localhost frontends, update `CORS_ORIGINS`.
- If backend port changes, set `VITE_API_URL` in client `.env`.

## Project Status
- Demo-ready and stable for evaluation.

## Future Improvements
- Persistent chat storage (DB-backed sessions)
- Streaming responses
- File indexing and semantic search over documents
