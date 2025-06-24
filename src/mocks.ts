/**
 * Mock fetch implementation for testing.
 */
export function mockFetch(): void {
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

/**
 * Mock window object for testing.
 */
export function mockWindow(): any {
  const mockWin = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    location: {
      href: 'http://localhost:3333/',
      protocol: 'http:',
      host: 'localhost:3333',
      hostname: 'localhost',
      port: '3333',
      pathname: '/',
      search: '',
      hash: '',
    },
    history: {
      pushState: jest.fn(),
      replaceState: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      go: jest.fn(),
    },
    navigator: {
      userAgent: 'Mozilla/5.0 (Test Environment)',
    },
    document: mockDocument(),
    console: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  };

  if (typeof global !== 'undefined') {
    (global as any).window = mockWin;
  }

  return mockWin;
}

/**
 * Mock document object for testing.
 */
export function mockDocument(): any {
  const mockDoc = {
    createElement: jest.fn((tagName: string) => ({
      tagName: tagName.toUpperCase(),
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
      removeAttribute: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
        contains: jest.fn(),
        toggle: jest.fn(),
      },
      style: {},
      innerHTML: '',
      textContent: '',
    })),
    
    createElementNS: jest.fn((namespace: string, tagName: string) => ({
      tagName: tagName.toUpperCase(),
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
      removeAttribute: jest.fn(),
    })),
    
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    
    body: {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(() => []),
    },
    
    head: {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    },
  };

  if (typeof global !== 'undefined') {
    (global as any).document = mockDoc;
  }

  return mockDoc;
} 
