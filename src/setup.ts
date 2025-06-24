import type { expect as JestExpect, jest as JestJest } from '@jest/globals';
import * as customMatchers from './ matcher/index.js';

declare const expect: typeof JestExpect;
declare const jest: typeof JestJest;

/**
 * Setup function for Jest with Stencil testing.
 * This function is called after the test framework has been set up.
 */
export function setupJestStencil(): void {
  // Setup custom matchers for Stencil testing
  setupCustomMatchers();

  // Configure timeouts
  setupTimeouts();
}

/**
 * Setup custom Jest matchers specific to Stencil testing.
 */
function setupCustomMatchers(): void {
  // Add custom matchers like toEqualHtml, toHaveReceivedEvent, etc.
  if (typeof expect !== 'undefined' && expect.extend) {
    expect.extend(customMatchers);
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
