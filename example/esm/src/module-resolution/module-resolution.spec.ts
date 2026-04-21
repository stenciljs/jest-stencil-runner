import { describe, expect, it } from '@jest/globals';
import * as StencilInternal from '@stencil/core/internal';
import { MockDocument } from '@stencil/core/mock-doc';

describe('stencil subpath module resolution', () => {
  it('@stencil/core/internal loads without SyntaxError', () => {
    expect(StencilInternal).toBeTruthy();
  });

  it('@stencil/core/mock-doc exposes MockDocument', () => {
    expect(MockDocument).toBeTruthy();
  });
});
