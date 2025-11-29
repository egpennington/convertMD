import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const convertToMarkdown = async (text: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert technical writer and Markdown formatter. 
      Analyze the following text and convert it into clean, well-structured Markdown.
      
      Instructions:
      1. If the input is plain text, infer the structure (titles, lists, paragraphs) and format it accordingly.
      2. If the input is already Markdown, improve the formatting and fix any syntax errors.
      3. Use appropriate headers (#, ##, etc.) for titles and sections.
      4. Convert lists into bullet points or numbered lists.
      5. Format code snippets into code blocks with language specifiers if detectable.
      6. Use bold and italics for emphasis where appropriate.
      7. Return ONLY the markdown content. Do not add any conversational filler like "Here is the markdown" or wrapping markdown code blocks (no \`\`\`markdown wrappers).

      Input Text:
      ${text}`,
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini conversion error:", error);
    throw error;
  }
};