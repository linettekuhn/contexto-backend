# Contexto (Backend)

This is the backend service powering the AI dialect-aware translation platform, Contexto.

It processes user translation requests, validates and sanitizes input, communicates with the OpenAI API, and logs translation activity while enforcing security and rate limiting.

---

## Features

- AI-powered dialect-aware translation using the OpenAI API
- Input validation middleware using Zod and sanitize-html
- Rate limiting to prevent abuse
- Translation request logging
- PostgreSQL database integration
- Deployed on a DigitalOcean VPS

---

## Built With

- Backend: Node.js, Express, TypeScript
- Frontend [managed in sister repository](https://github.com/linettekuhn/contexto-frontend): React, TypeScript, Vite
- Deployment: DigitalOcean VPS
- Database: PostgreSQL
- APIs: OpenAI API

---
