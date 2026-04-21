import { describe, expect, it } from '@jest/globals';
import { newSpecPage } from 'jest-stencil-runner';

describe('global location / document binding', () => {
  it('window.location and bare location point at the same instance', async () => {
    await newSpecPage({ components: [], html: '' });

    expect((window as any).location).toBe((globalThis as any).location);
  });

  it('writes through window.location are observable via bare location', async () => {
    await newSpecPage({ components: [], html: '' });

    (window as any).location.pathname = '/some/path';
    (window as any).location.search = '?foo=bar';

    expect((globalThis as any).location.pathname).toBe('/some/path');
    expect((globalThis as any).location.search).toBe('?foo=bar');
  });

  it('window.document and bare document point at the same instance', async () => {
    await newSpecPage({ components: [], html: '' });

    expect((window as any).document).toBe((globalThis as any).document);
  });
});
