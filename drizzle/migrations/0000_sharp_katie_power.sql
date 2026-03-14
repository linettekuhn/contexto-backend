CREATE TABLE "translations" (
	"id" SERIAL PRIMARY KEY NOT NULL,
	"original_text" TEXT NOT NULL,
	"translated_text" TEXT NOT NULL,
	"source_language" VARCHAR(10) NOT NULL,
	"target_language" VARCHAR(10) NOT NULL,
	"dialect" VARCHAR(20) NOT NULL,
	"created_at" TIMESTAMP DEFAULT now()
);

CREATE TABLE "users" (
	"id" SERIAL PRIMARY KEY,
	"email" TEXT UNIQUE NOT NULL,
	"password_hash" TEXT NOT NULL,
	"created_at" TIMESTAMP DEFAULT now()
)

CREATE TABLE "refresh_tokens" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES users(id) ON DELETE CASCADE,
	"token" TEXT NOT NULL,
	"expires_at" TIMESTAMP NOT NULL,
	"created_at" TIMESTAMP DEFAULT now()
)