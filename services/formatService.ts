/**
 * Local formatting service to replace AI functionality.
 * Uses heuristics and Regex to clean up and structure Markdown.
 */

export const formatMarkdown = async (text: string): Promise<string> => {
  // Simulate a small delay for UX so the user sees the "processing" state briefly
  await new Promise(resolve => setTimeout(resolve, 500));

  let formatted = text;

  // 1. Fix Headers: Ensure space after # (e.g., "#Title" -> "# Title")
  formatted = formatted.replace(/^(#{1,6})(?! )/gm, '$1 ');

  // 2. Fix Lists: Ensure space after bullet (e.g., "-Item" -> "- Item")
  formatted = formatted.replace(/^(\s*)([-*+])(?! )/gm, '$1$2 ');

  // 3. Fix Numbered Lists: Ensure space after dot (e.g., "1.Item" -> "1. Item")
  formatted = formatted.replace(/^(\s*)(\d+)\.(?! )/gm, '$1$2. ');

  // 4. Fix Bold/Italic spacing: Ensure no space inside tags (e.g., "** bold **" -> "**bold**")
  formatted = formatted.replace(/\*\* +(.+?) +\*\*/g, '**$1**');
  formatted = formatted.replace(/__ +(.+?) +__/g, '__$1__');
  formatted = formatted.replace(/(?<!\*)\* +(.+?) +\*(?!\*)/g, '*$1*');

  // 5. Standardize Blockquotes: Ensure space after >
  formatted = formatted.replace(/^>(?! )/gm, '> ');

  // 6. Ensure empty line before headers (except at start of file)
  formatted = formatted.replace(/([^\n])\n(#{1,6} )/g, '$1\n\n$2');

  // 7. Ensure empty line before lists (if not already there)
  formatted = formatted.replace(/([^\n])\n([-*+] )/g, '$1\n\n$2');

  return formatted;
};