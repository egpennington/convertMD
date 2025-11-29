// This service is deprecated and has been replaced by formatService.ts for offline functionality.
export const convertToMarkdown = async (text: string): Promise<string> => {
  throw new Error("Gemini Service is removed. Use formatService instead.");
};