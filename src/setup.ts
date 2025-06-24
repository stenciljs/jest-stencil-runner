/**
 * Setup function for Jest with Stencil testing.
 * This function is called after the test framework has been set up.
 */
export function setupJestStencil(): void {
  // Setup custom matchers for Stencil testing
  setupCustomMatchers();
  
  // Setup global test utilities
  setupGlobalTestUtils();
  
  // Configure timeouts
  setupTimeouts();
}

/**
 * Setup custom Jest matchers specific to Stencil testing.
 */
function setupCustomMatchers(): void {
  // Add custom matchers like toEqualHtml, toHaveReceivedEvent, etc.
  if (typeof expect !== 'undefined' && expect.extend) {
    expect.extend({
      toEqualHtml(received: any, expected: string) {
        const receivedHtml = getHtmlContent(received);
        const expectedHtml = normalizeHtml(expected);
        const normalizedReceived = normalizeHtml(receivedHtml);
        
        const pass = normalizedReceived === expectedHtml;
        return {
          message: () => `Expected HTML to ${pass ? 'not ' : ''}equal:\n${expectedHtml}\nReceived:\n${normalizedReceived}`,
          pass,
        };
      },
      
      toHaveReceivedEvent(received: any, eventName: string) {
        const events = received.events || [];
        const pass = events.some((event: any) => event.type === eventName);
        return {
          message: () => `Expected to ${pass ? 'not ' : ''}have received event "${eventName}"`,
          pass,
        };
      },
      
      toHaveClass(received: any, expectedClass: string) {
        const classList = getElementClassList(received);
        const pass = classList.includes(expectedClass);
        return {
          message: () => `Expected element to ${pass ? 'not ' : ''}have class "${expectedClass}"`,
          pass,
        };
      },
      
      toEqualText(received: any, expected: string) {
        const receivedText = getTextContent(received);
        const pass = receivedText.trim() === expected.trim();
        return {
          message: () => `Expected text to ${pass ? 'not ' : ''}equal:\n"${expected}"\nReceived:\n"${receivedText}"`,
          pass,
        };
      },
    });
  }
}

/**
 * Get HTML content from various input types.
 */
function getHtmlContent(input: any): string {
  if (typeof input === 'string') {
    return input;
  }
  if (input && typeof input.outerHTML === 'string') {
    return input.outerHTML;
  }
  if (input && typeof input.innerHTML === 'string') {
    return input.innerHTML;
  }
  if (input && input.toString) {
    return input.toString();
  }
  return String(input);
}

/**
 * Get text content from various input types.
 */
function getTextContent(input: any): string {
  if (typeof input === 'string') {
    return input;
  }
  if (input && typeof input.textContent === 'string') {
    return input.textContent;
  }
  if (input && typeof input.innerText === 'string') {
    return input.innerText;
  }
  return String(input);
}

/**
 * Get class list from element.
 */
function getElementClassList(input: any): string[] {
  if (input && input.classList && Array.isArray(input.classList)) {
    return input.classList;
  }
  if (input && input.classList && typeof input.classList.contains === 'function') {
    // Convert DOMTokenList to array
    return Array.from(input.classList);
  }
  if (input && typeof input.className === 'string') {
    return input.className.split(/\s+/).filter(Boolean);
  }
  return [];
}

/**
 * Setup global test utilities.
 */
function setupGlobalTestUtils(): void {
  // Setup mock functions and utilities available globally in tests
  if (typeof global !== 'undefined') {
    // Make common Stencil testing utilities available globally
    (global as any).mockFetch = mockFetch;
    (global as any).mockWindow = mockWindow;
    (global as any).mockDocument = mockDocument;
  }
}

/**
 * Configure test timeouts.
 */
function setupTimeouts(): void {
  if (typeof process !== 'undefined' && process.env) {
    const timeout = process.env.STENCIL_DEFAULT_TIMEOUT;
    if (timeout && typeof jest !== 'undefined') {
      jest.setTimeout(parseInt(timeout, 10));
    }
  }
}

/**
 * Simple mock functions for basic testing.
 */
function mockFetch(): void {
  if (typeof global !== 'undefined') {
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
      })
    );
  }
}

function mockWindow(): any {
  const mockWin = {
    location: { href: 'http://localhost:3333/' },
    document: mockDocument(),
  };
  if (typeof global !== 'undefined') {
    (global as any).window = mockWin;
  }
  return mockWin;
}

function mockDocument(): any {
  const mockDoc = {
    createElement: jest.fn(() => ({})),
    body: {},
  };
  if (typeof global !== 'undefined') {
    (global as any).document = mockDoc;
  }
  return mockDoc;
}

/**
 * Normalize HTML for comparison by removing extra whitespace and formatting.
 */
function normalizeHtml(html: string): string {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s*=\s*/g, '=')
    .trim();
} 
