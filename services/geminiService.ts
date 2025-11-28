import { GoogleGenAI } from "@google/genai";
import { GeminiModel } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client only if the key is present (handled gracefully in UI if not)
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateSystemResponse = async (userPrompt: string): Promise<string> => {
  if (!ai) {
    return "SYSTEM ERROR: API_KEY_MISSING. Please configure the environment.";
  }

  try {
    const model = GeminiModel.FLASH;
    const systemInstruction = `
      You are the Central Operating System of XOCIETY, a futuristic dystopian metaverse.
      Your tone is robotic, precise, slightly ominous, yet helpful to the "Player" or "Citizen".
      Keep responses concise (under 50 words) and formatted like a terminal output.
      Use terms like "Affirmative", "Processing", "Access Denied", "Frontier Avatar".
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "SYSTEM_NO_RESPONSE";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "SYSTEM CRITICAL FAILURE: Connection interrupted.";
  }
};
