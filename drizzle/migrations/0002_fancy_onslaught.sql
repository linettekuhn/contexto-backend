ALTER TABLE "translations" ADD COLUMN "formality" varchar(10) DEFAULT 'neutral' NOT NULL;

CREATE INDEX idx_translations_cache 
ON translations(original_text, source_language, target_language, dialect, formality);