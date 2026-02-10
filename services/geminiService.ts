
import { GoogleGenAI, Chat, LiveSession, LiveServerMessage, Modality, Blob as GenAIBlob, Operation, GenerateVideosResponse } from "@google/genai";
import type { Video } from '../types';

// In a real app, API keys would be handled securely and not be hardcoded or exposed client-side.
// We are using a placeholder here for demonstration purposes.
// The user should provide their own key via an environment variable.

let ai: GoogleGenAI;

function getAiInstance() {
    if (ai) {
        return ai;
    }
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        // This will be caught by the ApiKeyGate component, but it's good practice to have it.
        throw new Error("API_KEY is not set. Please set it in your environment variables or select one in the app.");
    }
    // A new instance is created before calls that need it, to ensure the latest key is used.
    ai = new GoogleGenAI({ apiKey: API_KEY });
    return ai;
}

// --- Chatbot ---
export async function runChatbot(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }): Promise<string> {
    try {
        const aiInstance = getAiInstance();
        const chat = aiInstance.chats.create({
            model: 'gemini-3-pro-preview',
            history
        });
        const response = await chat.sendMessage({ message: prompt });
        return response.text ?? "Sorry, I couldn't process that. Please try again.";
    } catch (error) {
        console.error("Gemini Chatbot Error:", error);
        return "An error occurred while communicating with the AI. Please check the console for details.";
    }
}

// --- Image Generation (Nano Banana Pro) ---
export async function generateImageNanoPro(prompt: string, aspectRatio: string, imageSize: string): Promise<string> {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await aiInstance.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio, imageSize } },
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return part.inlineData.data;
    }
    throw new Error("No image was generated.");
}

export async function editImage(prompt: string, imageBase64: string, mimeType: string): Promise<string> {
    const aiInstance = getAiInstance();
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: prompt,
    };
    const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [imagePart, textPart],
        },
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image was generated from edit.");
}


// --- Video Generation (Veo) ---
export async function generateVideoVeo(prompt: string, aspectRatio: '16:9' | '9:16', image?: { data: string, mimeType: string }): Promise<Operation<GenerateVideosResponse>> {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const request: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio },
    };
    if (image) {
        request.image = { imageBytes: image.data, mimeType: image.mimeType };
    }
    return await aiInstance.models.generateVideos(request);
}

export async function checkVideoOperation(operation: Operation<GenerateVideosResponse>): Promise<Operation<GenerateVideosResponse>> {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await aiInstance.operations.getVideosOperation({ operation });
}

// --- Content Analyzer ---
export async function analyzeContent(prompt: string, options: { model: string, useThinking?: boolean, grounding?: 'search' | 'maps' }): Promise<{ text: string, groundingChunks?: any[] }> {
    const aiInstance = getAiInstance();
    const { model, useThinking, grounding } = options;
    
    const config: any = {};
    if (useThinking) config.thinkingConfig = { thinkingBudget: 32768 };
    if (grounding === 'search') config.tools = [{ googleSearch: {} }];
    if (grounding === 'maps') config.tools = [{ googleMaps: {} }];

    const response = await aiInstance.models.generateContent({
        model,
        contents: prompt,
        config,
    });
    
    return {
        text: response.text ?? "No response text found.",
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
    };
}

export async function analyzeImage(prompt: string, imageBase64: string, mimeType: string): Promise<string> {
    const aiInstance = getAiInstance();
    const imagePart = { inlineData: { data: imageBase64, mimeType } };
    const textPart = { text: prompt };
    
    const response = await aiInstance.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text ?? "Could not analyze the image.";
}

// --- Audio Suite ---
export async function transcribeAudio(audioBlob: GenAIBlob): Promise<string> {
    const aiInstance = getAiInstance();
    const response = await aiInstance.models.generateContent({
        model: 'gemini-3-flash-preview',
        // FIX: Added a text part to explicitly instruct the model to transcribe the audio.
        // Multimodal models require clear instructions on what action to perform on the provided media.
        contents: { parts: [{ text: "Please transcribe the following audio:" }, { inlineData: audioBlob }] },
    });
    return response.text ?? "Could not transcribe audio.";
}

export async function generateSpeech(text: string): Promise<string> {
    const aiInstance = getAiInstance();
    const response = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? "";
}

// --- Real-time Voice Conversation with Live API (Existing) ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export function createPcmBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}

export function connectToLiveSession(callbacks: { onMessage: (msg: LiveServerMessage) => void, onError: (e: ErrorEvent) => void, onClose: (e: CloseEvent) => void, onOpen: () => void }): Promise<LiveSession> {
    const aiInstance = getAiInstance();
    return aiInstance.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            systemInstruction: 'You are Spark, a friendly and helpful AI assistant for the World Premiere XTV platform. Keep your responses concise and conversational.',
        },
    });
}
