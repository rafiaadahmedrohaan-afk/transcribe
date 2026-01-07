
import { GoogleGenAI, Type } from "@google/genai";
import { TranscriptionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const transcribeVideo = async (
  base64Data: string,
  mimeType: string
): Promise<TranscriptionResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Transcribe the dialogue from this video. 
            Identify the original language spoken.
            Provide a full transcription in English.
            Provide a full transcription in Bangla (Bengali).
            
            Format your response as a JSON object with the following keys:
            - english: The full transcription in English.
            - bangla: The full transcription in Bangla.
            - originalLanguageDetected: The name of the language detected in the video.
            
            Ensure the Bangla translation is natural and accurate. 
            If the video has no speech, return empty strings for transcriptions and 'None' for language.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING },
            bangla: { type: Type.STRING },
            originalLanguageDetected: { type: Type.STRING },
          },
          required: ["english", "bangla", "originalLanguageDetected"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(resultText) as TranscriptionResult;
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error("Failed to transcribe video. It might be too large or contain unsupported content.");
  }
};
