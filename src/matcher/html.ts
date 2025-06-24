import { NODE_TYPES, parseHtmlToFragment, serializeNodeToHtml } from '@stencil/core/mock-doc';
import type { expect as JestExpect } from '@jest/globals';
import type * as d from '@stencil/core/internal';

declare const expect: typeof JestExpect;

/**
 * Custom matcher to check if an element's HTML matches the expected HTML.
 * @param input - The input to check.
 * @param shouldEqual - The expected HTML to compare against.
 * @returns A Jest matcher result object.
 */
export function toEqualHtml(input: string | HTMLElement | ShadowRoot, shouldEqual: string) {
  return compareHtml(input, shouldEqual, true);
}

/**
 * Custom matcher to check if an element's Light DOM matches the expected HTML.
 * @param input - The input to check.
 * @param shouldEqual - The expected HTML to compare against.
 * @returns A Jest matcher result object.
 */
export function toEqualLightHtml(input: string | HTMLElement | ShadowRoot, shouldEqual: string) {
  return compareHtml(input, shouldEqual, false);
}

/**
 * Helper function to compare HTML.
 * @param input - The input to check.
 * @param shouldEqual - The expected HTML to compare against.
 * @param serializeShadowRoot - Whether to serialize the shadow root.
 * @returns A Jest matcher result object.
 */
function compareHtml(
  input: string | HTMLElement | ShadowRoot,
  shouldEqual: string,
  serializeShadowRoot: d.SerializeDocumentOptions['serializeShadowRoot'],
) {
  if (input == null) {
    throw new Error(`expect toEqualHtml() value is "${input}"`);
  }

  if (typeof (input as any).then === 'function') {
    throw new TypeError(`element must be a resolved value, not a promise, before it can be tested`);
  }

  // Common serialization options for consistent formatting
  const baseSerializationOptions = {
    prettyHtml: true,
    outerHtml: true,
    removeHtmlComments: false,
    excludeTags: ['body'],
    serializeShadowRoot,
  };

  let serializeA: string;

  if ((input as HTMLElement).nodeType === NODE_TYPES.ELEMENT_NODE) {
    const options = getSpecOptions(input as any);
    serializeA = serializeNodeToHtml(input as any, {
      ...baseSerializationOptions,
      removeHtmlComments: options.includeAnnotations === false,
    });
  } else if ((input as HTMLElement).nodeType === NODE_TYPES.DOCUMENT_FRAGMENT_NODE) {
    serializeA = serializeNodeToHtml(input as any, {
      ...baseSerializationOptions,
      outerHtml: false, // Fragments don't have outer HTML
      excludeTags: ['style'],
      excludeTagContent: ['style'],
    });
  } else if (typeof input === 'string') {
    const parseA = parseHtmlToFragment(input);
    serializeA = serializeNodeToHtml(parseA, {
      ...baseSerializationOptions,
      outerHtml: false, // Parsed fragments don't need outer HTML
    });
  } else {
    throw new TypeError(`expect toEqualHtml() value should be an element, shadow root or string.`);
  }

  const parseB = parseHtmlToFragment(shouldEqual);
  const serializeB = serializeNodeToHtml(parseB, {
    ...baseSerializationOptions,
    outerHtml: false, // Expected HTML is parsed as fragment
  });

  // Prettify both HTML strings for better comparison
  const prettifiedA = prettifyHtml(serializeA);
  const prettifiedB = prettifyHtml(serializeB);

  if (prettifiedA !== prettifiedB) {
    expect(prettifiedA).toBe(prettifiedB);
    return {
      message: () => 'HTML does not match',
      pass: false,
    };
  }

  return {
    message: () => 'expect HTML to match',
    pass: true,
  };
}

/**
 * Custom HTML prettifier that handles template elements properly
 */
function prettifyHtml(html: string): string {
  const lines: string[] = [];
  let indentLevel = 0;
  const indentSize = 2;

  // Clean up the HTML first
  html = html.replaceAll('\r\n', '\n').replaceAll('\r', '\n').replaceAll(/>\s*</g, '><').trim();

  // Split on tag boundaries
  const parts = html.split(/(<[^>]*>)/);

  for (const part_ of parts) {
    const part = part_.trim();
    if (!part) continue;

    if (part.startsWith('<')) {
      // This is a tag
      if (part.startsWith('</')) {
        // Closing tag - decrease indent before adding
        indentLevel = Math.max(0, indentLevel - 1);
        lines.push(' '.repeat(indentLevel * indentSize) + part);
      } else if (part.endsWith('/>')) {
        // Self-closing tag
        lines.push(' '.repeat(indentLevel * indentSize) + part);
      } else {
        // Opening tag
        lines.push(' '.repeat(indentLevel * indentSize) + part);

        // Check if this is a void element that doesn't need closing
        const tagName = part.match(/<([a-z][a-z0-9-]*)/i)?.[1]?.toLowerCase();
        const voidElements = [
          'area',
          'base',
          'br',
          'col',
          'embed',
          'hr',
          'img',
          'input',
          'link',
          'meta',
          'param',
          'source',
          'track',
          'wbr',
        ];

        if (!voidElements.includes(tagName || '')) {
          indentLevel++;
        }
      }
    } else if (part.length > 0) {
      // This is text content
      lines.push(' '.repeat(indentLevel * indentSize) + part);
    }
  }

  return lines.join('\n');
}

function getSpecOptions(el: HTMLElement): Partial<d.NewSpecPageOptions> {
  if (el && el.ownerDocument && el.ownerDocument.defaultView) {
    return (el.ownerDocument.defaultView as any).__stencil_spec_options || {};
  }

  return {};
}
