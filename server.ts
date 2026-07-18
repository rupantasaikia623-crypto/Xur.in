import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI helpers will not function.");
      throw new Error("GEMINI_API_KEY is required for the lyrics translation/explanation helper.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Xur Server is running." });
});

// 1. Explain lyrics or specific line
app.post("/api/lyrics/explain", async (req, res) => {
  try {
    const { lyrics, title, artist, line } = req.body;
    if (!lyrics || !title || !artist) {
      return res.status(400).json({ error: "Missing required fields (lyrics, title, artist)" });
    }

    const ai = getAiClient();
    
    let prompt = "";
    if (line) {
      prompt = `Analyze the song "${title}" by "${artist}". 
Explain the meaning, poetic devices, cultural context, and deeper interpretation of this specific lyric line:
"${line}"

Here are the complete lyrics for context:
${lyrics}

Provide a warm, human-friendly, insightful explanation suited for a music community. Do not sound robotic. Explain any cultural nuances if present.`;
    } else {
      prompt = `Analyze the song "${title}" by "${artist}". 
Provide a comprehensive explanation of its overall meaning, theme, cultural context, and artistic depth.

Here are the lyrics:
${lyrics}

Provide a warm, engaging, and professional breakdown of the song's core message. Use markdown for headings or bullet points where appropriate.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert musicologist, literary critic, and cultural historian. Your explanations are warm, objective, insightful, and accessible to music lovers. Avoid clinical jargon, and never use self-praise or sales-pitch wording. Use structured formatting with clean headers.",
      }
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error("Error in explain route:", error);
    res.status(500).json({ error: error.message || "Failed to analyze lyrics" });
  }
});

// 2. Translate lyrics
app.post("/api/lyrics/translate", async (req, res) => {
  try {
    const { lyrics, title, artist, targetLang } = req.body;
    if (!lyrics || !title || !artist || !targetLang) {
      return res.status(400).json({ error: "Missing required fields (lyrics, title, artist, targetLang)" });
    }

    const ai = getAiClient();
    const prompt = `Translate the lyrics of the song "${title}" by "${artist}" into ${targetLang}.
Keep the original poetic structure, lines, verses, and chorus matching. 
If there are untranslatable idioms or deep cultural expressions, provide a natural poetic translation and add brief notes in brackets at the end if needed.

Lyrics to translate:
${lyrics}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional lyrics translator fluent in multiple languages. You preserve the emotional resonance, rhyme rhythm, and physical layout of the original lyrics as closely as possible in the translation. Do not include unnecessary introduction text; start directly with the translated lyrics.",
      }
    });

    res.json({ translation: response.text });
  } catch (error: any) {
    console.error("Error in translate route:", error);
    res.status(500).json({ error: error.message || "Failed to translate lyrics" });
  }
});

// 3. Transliterate lyrics
app.post("/api/lyrics/transliterate", async (req, res) => {
  try {
    const { lyrics, title, artist } = req.body;
    if (!lyrics || !title || !artist) {
      return res.status(400).json({ error: "Missing required fields (lyrics, title, artist)" });
    }

    const ai = getAiClient();
    const prompt = `Provide a romanized (Latin characters / English letters) phonetic transliteration of the following song lyrics for "${title}" by "${artist}". 
This is so English speakers who do not read the original script can sing along accurately. 
Keep the line structure, verses, and chorus matching exactly.

Original Lyrics:
${lyrics}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a language transliteration expert. Your phonetic transliteration uses clear, consistent Romanization conventions (e.g. standard IAST or popular phonetic English mapping for South Asian languages like Assamese, Bengali, Hindi, etc.) that make it easy for non-native speakers to read and pronounce words accurately. Output ONLY the transliterated lyrics, maintaining original structures.",
      }
    });

    res.json({ transliteration: response.text });
  } catch (error: any) {
    console.error("Error in transliterate route:", error);
    res.status(500).json({ error: error.message || "Failed to translit lyrics" });
  }
});

// Setup Express with Vite in development, or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
