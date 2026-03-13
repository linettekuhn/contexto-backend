export interface TranslationRequest {
  original_text: string;
  source_language: string;
  target_language: string;
  dialect: string;
  formality: number;
}

export interface TranslationResponse {
  translation: string;
}
