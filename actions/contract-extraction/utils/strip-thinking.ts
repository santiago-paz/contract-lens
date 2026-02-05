/**
 * Utilities for handling reasoning model outputs that include <think> tags.
 * Some models (like DeepSeek) output their reasoning in <think>...</think> tags
 * before the actual JSON response.
 */

/**
 * Extracts the thinking content from <think>...</think> tags.
 * Returns null if no thinking tags are found.
 */
export function extractThinkingContent(text: string): string | null {
  if (!text) return null;

  const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/i);
  if (thinkMatch && thinkMatch[1]) {
    return thinkMatch[1].trim();
  }
  return null;
}

/**
 * Strips <think>...</think> tags from model output and extracts the JSON content.
 * Handles multiline thinking blocks and cleans up trailing non-JSON characters.
 */
export function stripThinkingTags(text: string): string {
  if (!text) return text;

  // Remove <think>...</think> blocks (including multiline content)
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // Trim whitespace
  cleaned = cleaned.trim();

  // If the result still doesn't start with { or [, try to find JSON in the text
  if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
    // Look for the first { or [ that might be the start of JSON
    const jsonStartBrace = cleaned.indexOf('{');
    const jsonStartBracket = cleaned.indexOf('[');

    let jsonStart = -1;
    if (jsonStartBrace >= 0 && jsonStartBracket >= 0) {
      jsonStart = Math.min(jsonStartBrace, jsonStartBracket);
    } else if (jsonStartBrace >= 0) {
      jsonStart = jsonStartBrace;
    } else if (jsonStartBracket >= 0) {
      jsonStart = jsonStartBracket;
    }

    if (jsonStart >= 0) {
      cleaned = cleaned.substring(jsonStart);
    }
  }

  // Remove trailing period or other non-JSON characters after the closing brace/bracket
  // Some models add "." or text after the JSON
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');
  const lastJsonChar = Math.max(lastBrace, lastBracket);

  if (lastJsonChar >= 0 && lastJsonChar < cleaned.length - 1) {
    cleaned = cleaned.substring(0, lastJsonChar + 1);
  }

  return cleaned;
}
