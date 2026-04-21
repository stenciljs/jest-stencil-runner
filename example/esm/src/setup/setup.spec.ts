import { describe, expect, it } from '@jest/globals';
import { MockHTMLElement, type MockNode } from '@stencil/core/mock-doc';

import { removeDomNodes } from 'jest-stencil-runner';

describe('jest setup test framework', () => {
  describe('removeDomNodes', () => {
    it('removes all children of the parent node', () => {
      const parentNode = new MockHTMLElement(null, 'div');
      parentNode.append(new MockHTMLElement(null, 'p'));

      expect(parentNode.childNodes.length).toEqual(1);

      removeDomNodes(parentNode);

      expect(parentNode.childNodes.length).toBe(0);
    });

    it('does nothing if there is no parent node', () => {
      const parentNode: MockNode | undefined = undefined;

      removeDomNodes(parentNode);

      expect(parentNode).toBeUndefined();
    });

    it('does nothing if the parent node child array is empty', () => {
      const parentNode = new MockHTMLElement(null, 'div');
      parentNode.childNodes = [];

      removeDomNodes(parentNode);

      expect(parentNode.childNodes).toStrictEqual([]);
    });

    it('does nothing if the parent node child array is `null`', () => {
      const parentNode = new MockHTMLElement(null, 'div');
      // the intent of this test is to guard against null-ish childNodes, hence the type assertion
      parentNode.childNodes = null as unknown as MockNode[];

      removeDomNodes(parentNode);

      expect(parentNode.childNodes).toBe(null);
    });
  });
});
