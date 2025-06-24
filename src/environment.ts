/**
 * Jest environment for Stencil component testing.
 * This provides the basic browser-like environment needed for component tests.
 */
import type { Config } from '@jest/types';
import { win, resetPlatform } from './platform';

/**
 * Jest environment that provides the Stencil testing platform.
 * This sets up the proper DOM mocking and Stencil utilities.
 */
export default class StencilEnvironment {
  global: any;
  
  constructor(config: Config.ProjectConfig, context: any) {
    this.global = global;
    
    // Initialize Stencil's testing platform
    this.setupStencilGlobals();
  }

  private setupStencilGlobals() {
    // Initialize the Stencil platform
    resetPlatform();
    
    // Set up globals from Stencil's mock DOM
    this.global.window = win as any;
    this.global.document = win.document as any;
    this.global.HTMLElement = (win as any).HTMLElement;
    this.global.customElements = win.customElements as any;
    this.global.Event = (win as any).Event;
    this.global.CustomEvent = (win as any).CustomEvent;
    this.global.MouseEvent = (win as any).MouseEvent;
    this.global.KeyboardEvent = (win as any).KeyboardEvent;
    this.global.addEventListener = win.addEventListener.bind(win) as any;
    this.global.removeEventListener = win.removeEventListener.bind(win) as any;
    this.global.requestAnimationFrame = win.requestAnimationFrame.bind(win) as any;
    this.global.cancelAnimationFrame = win.cancelAnimationFrame.bind(win) as any;
    this.global.localStorage = win.localStorage as any;
    this.global.sessionStorage = win.sessionStorage as any;
    this.global.location = win.location as any;
    this.global.history = win.history as any;
    this.global.navigator = win.navigator as any;
    this.global.fetch = win.fetch as any;
    
    // Set up console methods
    this.global.console = console;
    
    // Set up timing functions
    this.global.setTimeout = win.setTimeout.bind(win) as any;
    this.global.clearTimeout = win.clearTimeout.bind(win) as any;
    this.global.setInterval = win.setInterval.bind(win) as any;
    this.global.clearInterval = win.clearInterval.bind(win) as any;
    
    // Set up URL and URLSearchParams
    this.global.URL = (win as any).URL;
    this.global.URLSearchParams = (win as any).URLSearchParams;
  }

  async setup(): Promise<void> {
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
