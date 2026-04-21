import { describe, expect, it } from '@jest/globals';
import { newSpecPage } from 'jest-stencil-runner';

describe('snapshot serializer parity with serializeNodeToHtml', () => {
  it('serializes empty non-void tags on a single line', async () => {
    const page = await newSpecPage({
      components: [],
      html: '<my-tag><slot></slot><slot name="x"></slot></my-tag>',
    });

    expect(page.body.firstChild).toMatchInlineSnapshot(`
      <my-tag>
        <slot></slot>
        <slot name="x"></slot>
      </my-tag>
    `);
  });
});
