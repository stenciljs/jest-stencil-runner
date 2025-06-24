import { NODE_TYPES } from '@stencil/core/mock-doc';

export function toEqualText(input: HTMLElement | string, expectTextContent: string) {
  if (input == null) {
    throw new Error(`expect toEqualText() value is "${input}"`);
  }

  if (typeof (input as any).then === 'function') {
    throw new TypeError(`element must be a resolved value, not a promise, before it can be tested`);
  }

  let textContent: string;

  if ((input as HTMLElement).nodeType === NODE_TYPES.ELEMENT_NODE) {
    textContent = ((input as HTMLElement).textContent ?? '').replaceAll(/\s{2,}/g, ' ').trim();
  } else {
    textContent = String(input)
      .replaceAll(/\s{2,}/g, ' ')
      .trim();
  }

  if (typeof expectTextContent === 'string') {
    expectTextContent = expectTextContent.replaceAll(/\s{2,}/g, ' ').trim();
  }

  const pass = textContent === expectTextContent;

  return {
    message: () => `expected textContent "${expectTextContent}" to ${pass ? 'not ' : ''}equal "${textContent}"`,
    pass,
  };
}
