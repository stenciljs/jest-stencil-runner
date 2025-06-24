/**
 * Custom Jest snapshot serializer for DOM elements using outerHTML
 * This serializer ensures that DOM elements are serialized using their outerHTML property
 */
export const test = (val: unknown): boolean => {
  if (!val || typeof val !== 'object' || !('tagName' in val) || typeof val.tagName !== 'string') {
    return false
  };
  
  return val.tagName.includes('-');
};

/**
 * Prettify HTML string with proper indentation
 */
function prettifyHTML(html: string, indentSize: number = 2): string {
  const indent = ' '.repeat(indentSize);
  
  // Self-closing and void elements
  const voidElements = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);
  
  // Parse HTML into tokens
  const tokens: Array<{type: 'tag' | 'text' | 'comment', content: string, isClosing?: boolean, isSelfClosing?: boolean, tagName?: string}> = [];
  
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      // Find the end of the tag
      const tagEnd = html.indexOf('>', i);
      if (tagEnd === -1) break;
      
      const tagContent = html.slice(i, tagEnd + 1);
      
      // Check if it's a comment
      if (tagContent.startsWith('<!--')) {
        tokens.push({ type: 'comment', content: tagContent });
      } else {
        // Parse tag
        const isClosing = tagContent.startsWith('</');
        const isSelfClosing = tagContent.endsWith('/>') || tagContent.includes(' /');
        
        // Extract tag name
        const tagNameMatch = tagContent.match(/<\/?([a-zA-Z0-9-]+)/);
        const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
        
        tokens.push({
          type: 'tag',
          content: tagContent,
          isClosing,
          isSelfClosing: isSelfClosing || voidElements.has(tagName),
          tagName
        });
      }
      
      i = tagEnd + 1;
    } else {
      // Find text content until next tag
      const nextTag = html.indexOf('<', i);
      const textContent = html.slice(i, nextTag === -1 ? html.length : nextTag);
      
      // Only add non-empty text content
      if (textContent.trim()) {
        tokens.push({ type: 'text', content: textContent.trim() });
      }
      
      i = nextTag === -1 ? html.length : nextTag;
    }
  }
  
  // Build formatted HTML
  let result = '';
  let indentLevel = 0;
  
  for (let j = 0; j < tokens.length; j++) {
    const token = tokens[j];
    const prevToken = tokens[j - 1];
    const nextToken = tokens[j + 1];
    
    if (token.type === 'tag') {
      if (token.isClosing) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add newline and indentation (except for the very first token)
      if (j > 0) {
        result += '\n' + indent.repeat(indentLevel);
      }
      
      result += token.content;
      
      // Increase indent level for opening tags that aren't self-closing
      if (!token.isClosing && !token.isSelfClosing) {
        indentLevel++;
      }
    } else if (token.type === 'text') {
      // Add newline and indentation before text content
      if (prevToken && prevToken.type === 'tag' && !prevToken.isClosing) {
        result += '\n' + indent.repeat(indentLevel);
      }
      
      result += token.content;
    } else if (token.type === 'comment') {
      // Handle comments
      if (j > 0) {
        result += '\n' + indent.repeat(indentLevel);
      }
      result += token.content;
    }
  }
  
  return result;
}

export const serialize = (val: any, options: { indent: string }): string => {
  // Use outerHTML for serialization
  if (val.outerHTML) {
    return prettifyHTML(val.outerHTML, options.indent.split('').length);
  }
  
  // Fallback for elements without outerHTML
  if (val.tagName) {
    const tagName = val.tagName.toLowerCase();
    const attributes = Array.from(val.attributes || [])
      .map((attr: any) => `${attr.name}="${attr.value}"`)
      .join(' ');
    
    const openTag = attributes ? `<${tagName} ${attributes}>` : `<${tagName}>`;
    
    // Self-closing tags
    const voidElements = new Set([
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]);
    
    if (voidElements.has(tagName)) {
      return attributes ? `<${tagName} ${attributes} />` : `<${tagName} />`;
    }
    
    const innerHTML = val.innerHTML || '';
    const html = `${openTag}${innerHTML}</${tagName}>`;
    return prettifyHTML(html);
  }
  
  // Final fallback
  return val.toString();
};

export default { test, serialize }; 
