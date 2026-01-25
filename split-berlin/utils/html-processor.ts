export const getBlocksFromHtml = (html: string): string[] => {
  // Split by comma that is NOT inside an HTML tag.
  // The regex matches a comma only if it's NOT followed by a closing bracket '>' 
  // without a preceding opening bracket '<'.
  // This effectively finds commas in text nodes.
  return html.split(/,(?![^<>]*>)/);
};

export const getChangedBlockIndex = (oldBlocks: string[], newBlocks: string[]): number => {
  // If lengths differ, structural change -> return -1
  if (oldBlocks.length !== newBlocks.length) {
    console.log('[Diff] Structure mismatch:', oldBlocks.length, 'vs', newBlocks.length);
    return -1;
  }

  let changedIndex = -1;
  let changesCount = 0;

  for (let i = 0; i < newBlocks.length; i++) {
    if (oldBlocks[i] !== newBlocks[i]) {
      changedIndex = i;
      changesCount++;
    }
  }

  console.log(`[Diff] Changes detected: ${changesCount}, Index: ${changedIndex}`);

  // If exactly one block changed, return its index.
  return changesCount === 1 ? changedIndex : -1;
};
