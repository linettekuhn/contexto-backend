
```
contexto-backend
├─ .dockerignore
├─ docker-compose.override.yml
├─ docker-compose.yml
├─ Dockerfile
├─ Dockerfile.dev
├─ drizzle
│  └─ migrations
│     └─ 0000_ambiguous_the_stranger.sql
├─ drizzle.config.ts
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ config
│  │  └─ env.ts
│  ├─ controllers
│  │  ├─ auth.controller.ts
│  │  └─ translation.controller.ts
│  ├─ db
│  │  ├─ connection.ts
│  │  ├─ schema.ts
│  │  ├─ test-connection.ts
│  │  └─ test-translation.ts
│  ├─ index.ts
│  ├─ middleware
│  │  ├─ authMiddleware.ts
│  │  ├─ errorHandler.ts
│  │  ├─ rateLimiter.ts
│  │  ├─ requestLogger.ts
│  │  └─ validateTranslation.ts
│  ├─ routes
│  │  ├─ auth.routes.ts
│  │  └─ translate.routes.ts
│  ├─ services
│  │  ├─ auth.service.ts
│  │  └─ translation.service.ts
│  ├─ tests
│  │  ├─ integration
│  │  │  ├─ auth.service.integration.test.ts
│  │  │  └─ translation.service.integration.test.ts
│  │  ├─ setup.ts
│  │  └─ unit
│  │     ├─ auth.service.test.ts
│  │     └─ translation.service.test.ts
│  ├─ types
│  │  └─ translation.types.ts
│  └─ utils
│     ├─ jwt.ts
│     ├─ logger.ts
│     ├─ openaiClient.ts
│     └─ password.ts
├─ tsconfig.drizzle.json
├─ tsconfig.json
└─ vitest.config.ts

```