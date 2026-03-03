CREATE TABLE "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_text" text NOT NULL,
	"translated_text" text NOT NULL,
	"source_language" varchar(10) NOT NULL,
	"target_language" varchar(10) NOT NULL,
	"dialect" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
