import process from 'node:process';

import { BUILD } from '@stencil/core/internal/app-data';
import {
  modeResolutionChain,
  resetPlatform,
  setErrorHandler,
  stopAutoApplyChanges,
  // @ts-expect-error - TODO: add types for this module
} from '@stencil/core/internal/testing';
import { setupGlobal, teardownGlobal, type MockDocument, type MockNode, type MockWindow } from '@stencil/core/mock-doc';
import * as customMatchers from './matcher/index.js';
import { resetBuildConditionals } from './reset-build-conditionals';
import type {
  afterEach as JestAfterEach,
  beforeEach as JestBeforeEach,
  expect as JestExpect,
  jest as JestJest,
} from '@jest/globals';

import type * as d from '@stencil/core/internal';

declare const expect: typeof JestExpect;
declare const jest: typeof JestJest;
declare const beforeEach: typeof JestBeforeEach;
declare const afterEach: typeof JestAfterEach;
declare const global: d.JestEnvironmentGlobal;

/**
 * Setup function for Jest with Stencil testing.
 * This function is called after the test framework has been set up.
 */
export function setupJestStencil(): void {
  // Setup custom matchers for Stencil testing
  setupCustomMatchers();

  // Configure timeouts
  setupTimeouts();

  global.resourcesUrl = '/build';

  setupGlobal(global);

  beforeEach(() => {
    // reset the platform for this new test
    resetPlatform();
    setErrorHandler(undefined);
    resetBuildConditionals(BUILD);
    modeResolutionChain.length = 0;
  });

  afterEach(() => {
    stopAutoApplyChanges();

    // Remove each node from the mocked DOM
    // Without this step, a component's `disconnectedCallback`
    // will not be called since this only happens when a node is removed,
    // not if the window is destroyed.
    //
    // So, we do this outside the mocked window/DOM teardown
    // because this operation is really only necessary in the testing
    // context so any "cleanup" operations in the `disconnectedCallback`
    // can happen to prevent testing errors with async code in the component
    //
    // We only care about removing all the nodes that are children of the 'body' tag/node.
    // This node is a child of the `html` tag which is the 2nd child of the document (hence
    // the `1` index).
    const bodyNode = (
      ((global as any).window as MockWindow)?.document as unknown as MockDocument
    )?.childNodes?.[1]?.childNodes?.find((ref) => ref.nodeName === 'BODY');
    bodyNode?.childNodes?.forEach(removeDomNodes);

    teardownGlobal(global);
    global.resourcesUrl = '/build';
  });
}

/**
 * Recursively removes all child nodes of a passed node starting with the
 * furthest descendant and then moving back up the DOM tree.
 *
 * @param node The mocked DOM node that will be removed from the DOM
 */
export function removeDomNodes(node: MockNode | undefined | null) {
  if (node == null) {
    return;
  }

  if (!node.childNodes?.length) {
    node.remove();
  }

  node.childNodes?.forEach(removeDomNodes);
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
      jest.setTimeout(Number.parseInt(timeout, 10));
    }
  }
}
