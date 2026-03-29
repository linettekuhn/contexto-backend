# Contexto (Backend)

This is the backend service powering the AI dialect-aware translation platform, Contexto.

It processes user translation requests, validates and sanitizes input, communicates with the OpenAI API, and logs translation activity while enforcing security and rate limiting.

---

## Demo
[👉 **speakcontexto.com**](https://speakcontexto.com)

---

## Features
- AI-powered dialect-aware translation using the OpenAI API
- Input validation middleware using Zod and sanitize-html
- Rate limiting to prevent abuse
- Translation request logging
- PostgreSQL database integration via Drizzle ORM with versioned migrations
- User authentication with secure password hashing and JWT-based session management
- Auth and history routes with dedicated controllers and services
- Stores and retrieves past translations per authenticated user
- Containerized with Docker for consistent dev and production environments
- Unit and integration test suite using Vitest, covering auth, history, and translation services
- Deployed on a DigitalOcean VPS

---

## Built With
- Backend: Node.js, Express, TypeScript
- ORM: Drizzle ORM
- Auth: JWT, bcrypt
- Testing: Vitest
- Containerization: Docker
- Frontend [managed in sister repository](https://github.com/linettekuhn/contexto-frontend): React, TypeScript, Vite
- Deployment: DigitalOcean VPS
- Database: PostgreSQL
- APIs: OpenAI API
