import { newSpecPage } from 'jest-stencil-runner';
import { MyComponent } from './my-component';

describe('my-component', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: '<my-component></my-component>',
    });
    expect(root).toMatchInlineSnapshot(`
<my-component>
  <template shadowrootmode="open">
    <div>
      Hello, World! I'm
    </div>
  </template>
</my-component>
`);
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
});
