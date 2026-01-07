
export interface TranscriptionResult {
  english: string;
  bangla: string;
  originalLanguageDetected: string;
}

export interface AppState {
  file: File | null;
  videoUrl: string | null;
  isLoading: boolean;
  result: TranscriptionResult | null;
  error: string | null;
  progressMessage: string;
}
