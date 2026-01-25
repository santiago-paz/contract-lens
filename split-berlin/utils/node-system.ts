// Utils for robust DOM node handling
import * as cheerio from 'cheerio';

export interface ContentNode {
  id: string; // Generated hash or index based ID to track identity
  tag: string;
  content: string; // innerHTML
  text: string; // textContent (for lighter comparisons)
  attributes: string; // Serialized attributes (class, style, etc)
}

/**
 * Parses HTML string into a structured array of ContentNodes using Cheerio
 * This is robust and isomorphic (works on server and client)
 */
export const parseHtmlToNodes = (html: string): ContentNode[] => {
  // Load HTML with cheerio. 
  // null means no wrapper (no html/body tags added automatically if not present)
  const $ = cheerio.load(html, { xml: false }, false); // xml: false ensures HTML mode
  
  // We assume the root level elements are the blocks
  // If the editor wraps everything in a div, we might need to adjust selector
  const nodes: ContentNode[] = [];
  
  // Iterate over root elements
  $.root().children().each((index, el) => {
    // Only process actual elements (tags), ignoring root-level text nodes if they are just whitespace
    // If the editor produces clean block-level elements (p, h1, ul, etc), this works well.
    if (el.type === 'tag') {
        const $el = $(el);
        const tagName = el.tagName.toLowerCase();
        
        // Serialize attributes
        const attributes = Object.entries(el.attribs || {})
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

        nodes.push({
            id: `${tagName}-${index}`,
            tag: tagName,
            content: $el.html() || '', // innerHTML
            text: $el.text() || '',    // textContent
            attributes: attributes
        });
    }
  });

  return nodes;
};

/**
 * Reconstructs HTML string from ContentNodes
 */
export const serializeNodesToHtml = (nodes: ContentNode[]): string => {
  return nodes.map(node => {
    const attrs = node.attributes ? ` ${node.attributes}` : '';
    return `<${node.tag}${attrs}>${node.content}</${node.tag}>`;
  }).join('');
};

export type DiffResult = 
  | { type: 'NO_CHANGE' }
  | { type: 'TEXT_UPDATE'; index: number; content: string }
  | { type: 'STRUCTURAL_ADD'; index: number; node: ContentNode }
  | { type: 'STRUCTURAL_REMOVE'; index: number }
  | { type: 'FULL_RELOAD' }; // Fallback for complex merges/splits that confuse the diff engine

/**
 * Intelligent Diffing Algorithm
 * Distinguishes between text edits and structural changes (enter/delete)
 */
export const compareNodes = (oldNodes: ContentNode[], newNodes: ContentNode[]): DiffResult => {
  // Case 1: Same structure, check for text updates
  if (oldNodes.length === newNodes.length) {
    let changedIndex = -1;
    let changesCount = 0;

    for (let i = 0; i < newNodes.length; i++) {
      // We compare textContent to ignore minor HTML formatting noise, 
      // but if you want strict HTML sync, use .content
      if (oldNodes[i].content !== newNodes[i].content) {
        changedIndex = i;
        changesCount++;
      }
    }

    if (changesCount === 0) return { type: 'NO_CHANGE' };
    if (changesCount === 1) return { type: 'TEXT_UPDATE', index: changedIndex, content: newNodes[changedIndex].content };
    
    // If multiple blocks changed simultaneously without length change, it's a complex edit (or copy paste)
    // We treat it as full reload for safety, or we could handle batch updates later.
    return { type: 'FULL_RELOAD' }; 
  }

  // Case 2: Node Added (Enter key pressed)
  if (newNodes.length > oldNodes.length) {
    // Find where the insertion happened
    let insertIndex = -1;
    
    // Simple look-ahead strategy
    // [A, B, C] vs [A, B, NEW, C]
    let offset = 0;
    for (let i = 0; i < newNodes.length; i++) {
      const oldNode = oldNodes[i - offset];
      const newNode = newNodes[i];

      // If we ran out of old nodes, it means the new node is at the end
      if (!oldNode) {
         if (insertIndex === -1) {
             insertIndex = i;
             return { type: 'STRUCTURAL_ADD', index: insertIndex, node: newNodes[insertIndex] };
         } else {
             return { type: 'FULL_RELOAD' };
         }
      }

      if (oldNode.content !== newNode.content) {
        // Mismatch found. 
        // Is the NEXT node a match? (Insertion confirmed)
        // Check if newNodes[i+1] matches oldNodes[i] (current old node)
        // If so, then newNodes[i] is the inserted one.
        if (i + 1 < newNodes.length && oldNode.content === newNodes[i+1].content) {
             // Confirmed insertion at i
             if (insertIndex === -1) {
                 insertIndex = i;
                 offset = 1; // Start shifting comparison
                 // We continue loop to ensure rest of doc matches
             } else {
                 return { type: 'FULL_RELOAD' };
             }
        } else {
            // Complex mismatch
            return { type: 'FULL_RELOAD' };
        }
      }
    }

    if (insertIndex !== -1) {
      return { type: 'STRUCTURAL_ADD', index: insertIndex, node: newNodes[insertIndex] };
    }
  }

  // Case 3: Node Removed (Backspace)
  if (newNodes.length < oldNodes.length) {
    let removeIndex = -1;
    let offset = 0;

    for (let i = 0; i < oldNodes.length; i++) {
      const newNode = newNodes[i - offset];
      const oldNode = oldNodes[i];

      // If we ran out of new nodes, the deletion was at the end
      if (!newNode) {
          if (removeIndex === -1) {
              removeIndex = i;
              return { type: 'STRUCTURAL_REMOVE', index: removeIndex };
          } else {
              return { type: 'FULL_RELOAD' };
          }
      }

      if (newNode.content !== oldNode.content) {
        if (removeIndex === -1) {
          // Check if next old node matches current new node (deletion confirmed)
          if (i + 1 < oldNodes.length && oldNodes[i+1].content === newNode.content) {
              removeIndex = i;
              offset = 1;
          } else {
              return { type: 'FULL_RELOAD' };
          }
        } else {
          return { type: 'FULL_RELOAD' };
        }
      }
    }

    if (removeIndex !== -1) {
      return { type: 'STRUCTURAL_REMOVE', index: removeIndex };
    }
  }

  return { type: 'FULL_RELOAD' };
};
