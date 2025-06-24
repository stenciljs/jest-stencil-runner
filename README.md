# Jest Stencil Runner

> A Jest preset and test utilities for testing Stencil components with Jest v30+

This package provides a Jest preset and testing utilities specifically designed for Stencil components. It integrates Stencil's testing platform with Jest, allowing you to write unit tests for your Stencil components using familiar Jest syntax while leveraging Stencil's powerful testing capabilities.

⚠️ This project is work in progress, don't use it yet.

## Features

- 🚀 **Jest v30+ Support** - Compatible with the latest Jest version
- 🎯 **Stencil Integration** - Uses Stencil's own testing platform and DOM mocking
- 🔧 **TypeScript Support** - Full TypeScript support with proper type definitions
- 🎨 **Custom Matchers** - Additional Jest matchers for HTML and component testing
- 📱 **Component Testing** - Test Stencil components in isolation with `newSpecPage()`

## Installation

Install the package as a development dependency:

```bash
npm install --save-dev jest-stencil-runner
```

## Configuration

Create a `jest.config.js` file in your project root:

```javascript
const { createJestStencilPreset } = require('jest-stencil-runner/preset');

module.exports = createJestStencilPreset({
  rootDir: __dirname,
  // Add any additional Jest configuration here
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ]
});
```

## Usage

### Basic Component Testing

Test your Stencil components using the `newSpecPage()` utility:

```typescript
import { newSpecPage } from 'jest-stencil-runner';
import { MyComponent } from './my-component';

describe('my-component', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MyComponent],
      html: `<my-component></my-component>`,
    });
    expect(page.root).toEqualHtml(`
      <my-component>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </my-component>
    `);
  });

  it('renders with values', async () => {
    const page = await newSpecPage({
      components: [MyComponent],
      html: `<my-component first="Stencil" last="'Don't call me a framework' JS"></my-component>`,
    });
    expect(page.root).toEqualHtml(`
      <my-component first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </my-component>
    `);
  });

  it('handles property changes', async () => {
    const page = await newSpecPage({
      components: [MyComponent],
      html: `<my-component></my-component>`,
    });

    // Update properties
    page.root.first = 'Hello';
    page.root.last = 'World';
    
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <my-component>
        <mock:shadow-root>
          <div>
            Hello, World! I'm Hello World
          </div>
        </mock:shadow-root>
      </my-component>
    `);
  });
});
```

## API Reference

### `newSpecPage(options)`

Creates a new spec page for unit testing Stencil components.

**Parameters:**
- `options.components` - Array of component classes to register
- `options.html` - Initial HTML content for the page
- `options.template` - Function that returns JSX template
- `options.includeAnnotations` - Whether to include Stencil annotations

**Returns:** `Promise<SpecPage>`

**SpecPage Methods:**
- `setContent(html: string)` - Set the page HTML content
- `waitForChanges()` - Wait for component re-renders
- `root` - The root element of the component
- `doc` - The document object
- `win` - The window object
- `body` - The document body

## Custom Jest Matchers

The runner includes additional Jest matchers for component testing:

### `toEqualHtml(html)`

Compares HTML content, ignoring whitespace differences:

```typescript
expect(element).toEqualHtml(`
  <div class="my-class">
    <span>Content</span>
  </div>
`);
```

### `toHaveClass(className)`

Checks if an element has a specific CSS class:

```typescript
expect(element).toHaveClass('active');
expect(element).not.toHaveClass('disabled');
```

### `toEqualText(text)`

Compares the text content of an element:

```typescript
expect(element).toEqualText('Hello World');
```

### `toEqualAttribute(attr, value)`

Checks if an element has a specific attribute with a value:

```typescript
expect(element).toEqualAttribute('role', 'button');
```

## TypeScript Support

The runner includes full TypeScript definitions. Make sure your `tsconfig.json` includes the necessary types:

```json
{
  "compilerOptions": {
    "types": ["jest", "jest-stencil-runner"]
  }
}
```

## Configuration Options

### Jest Preset Options

When using `createJestStencilPreset()`, you can pass additional options:

```javascript
const { createJestStencilPreset } = require('jest-stencil-runner/preset');

module.exports = createJestStencilPreset({
  rootDir: __dirname,
  
  // Standard Jest options
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jest-stencil-runner/environment',
  
  // Stencil-specific options
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/*.(test|spec).(ts|tsx|js)'],
});
```

## Advanced Usage

### Testing Components with Props

```tsx
import { newSpecPage } from 'jest-stencil-runner';
import { MyButton } from './my-button';

describe('my-button', () => {
  it('renders with different variants', async () => {
    const page = await newSpecPage({
      components: [MyButton],
      html: `<my-button variant="primary" size="large">Click me</my-button>`,
    });
    
    expect(page.root).toHaveClass('btn-primary');
    expect(page.root).toHaveClass('btn-large');
  });
});
```

### Testing Events

```tsx
describe('my-button events', () => {
  it('emits click event', async () => {
    const page = await newSpecPage({
      components: [MyButton],
      html: `<my-button>Click me</my-button>`,
    });
    
    const clickSpy = jest.fn();
    page.root.addEventListener('myClick', clickSpy);
    
    // Trigger click
    page.root.click();
    await page.waitForChanges();
    
    expect(clickSpy).toHaveBeenCalled();
  });
});
```

## Troubleshooting

### Common Issues

1. **Module resolution errors**: Ensure your `tsconfig.json` has proper module resolution settings
2. **Component not rendering**: Make sure components are properly registered in the `components` array
3. **Async issues**: Always use `await page.waitForChanges()` after making changes

### Debug Mode

Enable debug logging by setting the `DEBUG` environment variable:

```bash
DEBUG=jest-stencil-runner npm test
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to the repository.

## License

MIT License - see LICENSE file for details.
