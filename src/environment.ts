// @ts-expect-error - TODO: add types for this module
import { win as mockWindow, resetPlatform } from '@stencil/core/internal/testing';
import type {
  MockCustomEvent,
  MockDocument,
  MockKeyboardEvent,
  MockMouseEvent,
  MockWindow,
} from '@stencil/core/mock-doc';

type MockStorage = ReturnType<typeof mockWindow>['localStorage'];
type MockEvent = ReturnType<typeof mockWindow>['Event'];
type MockTimeout = ReturnType<typeof mockWindow>['setTimeout'];
type MockSetInterval = ReturnType<typeof mockWindow>['setInterval'];

/**
 * Extended global object that includes both Node.js globals and DOM APIs
 */
export interface StencilGlobal {
  window: MockWindow;
  document: MockDocument;
  HTMLElement: typeof HTMLElement;
  customElements: CustomElementRegistry;
  Event: MockEvent;
  CustomEvent: typeof MockCustomEvent;
  MouseEvent: typeof MockMouseEvent;
  KeyboardEvent: typeof MockKeyboardEvent;
  addEventListener: typeof addEventListener;
  removeEventListener: typeof removeEventListener;
  requestAnimationFrame: typeof requestAnimationFrame;
  cancelAnimationFrame: typeof cancelAnimationFrame;
  localStorage: MockStorage;
  sessionStorage: MockStorage;
  location: Location;
  history: History;
  navigator: Navigator;
  fetch: typeof fetch;
  console: Console;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;
  URL: typeof URL;
}

/**
 * Jest environment that provides the Stencil testing platform.
 * This sets up the proper DOM mocking and Stencil utilities.
 */
export class StencilEnvironment {
  global: StencilGlobal;

  constructor() {
    this.global = global as unknown as StencilGlobal;

    // Initialize Stencil's testing platform
    this.setupStencilGlobals();
  }

  private setupStencilGlobals(): void {
    // Initialize the Stencil platform
    resetPlatform();

    const win = mockWindow as MockWindow;

    // Set up globals from Stencil's mock DOM
    this.global.window = win;
    this.global.document = win.document as unknown as MockDocument;
    this.global.HTMLElement = win.HTMLElement;
    this.global.customElements = win.customElements;
    this.global.Event = win.Event;
    this.global.CustomEvent = win.CustomEvent;
    this.global.MouseEvent = win.MouseEvent;
    this.global.KeyboardEvent = win.KeyboardEvent;
    this.global.addEventListener = win.addEventListener.bind(win) as any;
    this.global.removeEventListener = win.removeEventListener.bind(win);
    this.global.requestAnimationFrame = win.requestAnimationFrame.bind(win);
    this.global.cancelAnimationFrame = win.cancelAnimationFrame.bind(win);
    this.global.localStorage = win.localStorage;
    this.global.sessionStorage = win.sessionStorage;
    this.global.location = win.location;
    this.global.history = win.history;
    this.global.navigator = win.navigator;
    this.global.fetch = win.fetch;

    // Set up console methods
    this.global.console = console;

    // Set up timing functions
    this.global.setTimeout = win.setTimeout.bind(win) as MockTimeout;
    this.global.clearTimeout = win.clearTimeout.bind(win);
    this.global.setInterval = win.setInterval.bind(win) as MockSetInterval;
    this.global.clearInterval = win.clearInterval.bind(win);

    // Set up URL
    this.global.URL = win.URL;
  }

  setup(): void {
    // Reset platform for each test
    resetPlatform();
  }

  async teardown(): Promise<void> {
    // Cleanup if needed
  }

  getVmContext(): any {
    return this.global;
  }
}
