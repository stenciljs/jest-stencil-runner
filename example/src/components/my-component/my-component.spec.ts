import { newSpecPage } from 'jest-stencil-runner';
import { MyComponent } from './my-component';

describe('my-component', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: '<my-component></my-component>',
    });
    expect(root).toMatchSnapshot();
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: `<my-component first="Stencil" middle="'Don't call me a framework'" last="JS"></my-component>`,
    });
    expect(root).toMatchInlineSnapshot(`
<my-component first="Stencil" middle="'Don't call me a framework'" last="JS">
  <template shadowrootmode="open">
    <div>
      Hello, World! I'm Stencil 'Don't call me a framework' JS
    </div>
  </template>
</my-component>
`);
  });

  describe('HTML Matchers', () => {
    it('should render correct HTML structure', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component first="John" last="Doe"></my-component>',
      });

      expect(root).toEqualHtml(`
        <my-component first="John" last="Doe">
          <template shadowrootmode="open">
            <div>
              Hello, World! I'm John Doe
            </div>
          </template>
        </my-component>
      `);
    });

    it('should render light DOM correctly', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component first="Jane" last="Smith"></my-component>',
      });

      expect(root).toEqualLightHtml('<my-component first="Jane" last="Smith"></my-component>');
    });
  });

  describe('Text Matchers', () => {
    it('should display correct text content', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component first="Alice" middle="Marie" last="Johnson"></my-component>',
      });

      const div = root.shadowRoot.querySelector('div');
      expect(div).toEqualText('Hello, World! I\'m Alice Marie Johnson');
    });

    it('should handle empty names', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component></my-component>',
      });

      const div = root.shadowRoot.querySelector('div');
      expect(div).toEqualText('Hello, World! I\'m');
    });

    it('should handle single name', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component first="Cher"></my-component>',
      });

      const div = root.shadowRoot.querySelector('div');
      expect(div).toEqualText('Hello, World! I\'m Cher');
    });
  });

  describe('Attribute Matchers', () => {
    it('should have component attributes', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component first="Test" middle="User" last="Name"></my-component>',
      });

      expect(root).toHaveAttribute('first');
      expect(root).toHaveAttribute('middle');
      expect(root).toHaveAttribute('last');
    });

    it('should have correct attribute values', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component first="John" middle="Q" last="Public"></my-component>',
      });

      expect(root).toEqualAttribute('first', 'John');
      expect(root).toEqualAttribute('middle', 'Q');
      expect(root).toEqualAttribute('last', 'Public');
    });

    it('should have multiple correct attributes', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component first="Bob" last="Builder"></my-component>',
      });

      expect(root).toEqualAttributes({
        'first': 'Bob',
        'last': 'Builder'
      });
    });
  });

  describe('Text Formatting Edge Cases', () => {
    it('should handle special characters in names', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component first="José" middle="María" last="García-López"></my-component>',
      });

      const div = root.shadowRoot.querySelector('div');
      expect(div).toEqualText('Hello, World! I\'m José María García-López');
    });

    it('should handle very long names', async () => {
      const longName = 'Supercalifragilisticexpialidocious';
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: `<my-component first="${longName}" last="Person"></my-component>`,
      });

      const div = root.shadowRoot.querySelector('div');
      expect(div).toEqualText(`Hello, World! I'm ${longName} Person`);
    });

    it('should handle names with quotes', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component first="John" middle="&quot;The Great&quot;" last="Smith"></my-component>',
      });

      const div = root.shadowRoot.querySelector('div');
      expect(div).toEqualText('Hello, World! I\'m John "The Great" Smith');
    });
  });

  describe('Component Structure', () => {
    it('should have shadow DOM', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component></my-component>',
      });

      expect(root.shadowRoot).toBeTruthy();
      expect(root.shadowRoot.querySelector('div')).toBeTruthy();
    });

    it('should have correct element structure', async () => {
      const { root } = await newSpecPage({
        components: [MyComponent],
        html: '<my-component first="Test"></my-component>',
      });

      const shadowDiv = root.shadowRoot.querySelector('div');
      expect(shadowDiv.tagName.toLowerCase()).toBe('div');
      expect(shadowDiv.textContent).toContain('Hello, World!');
      expect(shadowDiv.textContent).toContain('Test');
    });
  });
});
