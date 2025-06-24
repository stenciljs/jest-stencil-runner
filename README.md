# Jest Stencil Runner

> A Jest preset and test utilities for testing Stencil components with Jest v30+

This package provides a Jest preset and testing utilities specifically designed for Stencil components. It integrates Stencil's testing platform with Jest, allowing you to write unit tests for your Stencil components using familiar Jest syntax while leveraging Stencil's powerful testing capabilities.

## Features

- 🚀 **Jest v30+ Support** - Compatible with the latest Jest version
- 🎯 **Stencil Integration** - Uses Stencil's own testing platform and DOM mocking
- 🔧 **TypeScript Support** - Full TypeScript support with proper type definitions
- 🎨 **Custom Matchers** - Additional Jest matchers for HTML and component testing
- 📱 **Component Testing** - Test Stencil components in isolation with `newSpecPage()`
- 📸 **Shadow DOM Testing** - Full support for testing and snapshotting Shadow DOM content

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

```tsx
import { newSpecPage } from 'jest-stencil-runner';
import { MyButton } from './my-button';

describe('my-button', () => {
  it('renders with correct structure and styling', async () => {
    const { root } = await newSpecPage({
      components: [MyButton],
      /**
       * use string template
       */
      html: '<my-button variant="primary" disabled>Click me</my-button>',
    });

    // Test HTML structure with shadow DOM
    expect(root).toEqualHtml(`
      <my-button variant="primary" disabled>
        <template shadowrootmode="open">
          <button class="btn btn--primary btn--disabled" disabled>
            Click me
          </button>
        </template>
      </my-button>
    `);

    // Test specific attributes and classes
    const button = root.shadowRoot.querySelector('button');
    expect(button).toHaveAttribute('disabled');
    expect(button).toHaveClasses(['btn', 'btn--primary', 'btn--disabled']);
    expect(button).toEqualText('Click me');
  });

  it('handles property changes and events', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [MyButton],
      /**
       * use JSX template
       */
      template: () => <my-button>Submit</my-button>,
    });

    // Test event handling
    const clickSpy = jest.fn();
    root.addEventListener('buttonClick', clickSpy);

    const button = root.shadowRoot.querySelector('button');
    button.click();
    await waitForChanges();

    expect(clickSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { clicked: true, timestamp: expect.any(Number) }
      })
    );

    // Test property updates
    root.variant = 'danger';
    root.disabled = true;
    await waitForChanges();

    expect(button).toHaveClasses(['btn', 'btn--danger', 'btn--disabled']);
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

The runner includes comprehensive Jest matchers for component testing, organized by category:

### HTML Matchers

#### `toEqualHtml(html)`

Compares HTML content, including shadow DOM, with normalized whitespace and attribute order:

```typescript
expect(element).toEqualHtml(`
  <my-component>
    <template shadowrootmode="open">
      <div class="container">
        <span>Content</span>
      </div>
    </template>
  </my-component>
`);
```

#### `toEqualLightHtml(html)`

Compares only the light DOM (excluding shadow DOM content):

```typescript
expect(element).toEqualLightHtml(`
  <my-component first="John" last="Doe"></my-component>
`);
```

### Text Matchers

#### `toEqualText(text)`

Compares the text content of an element, automatically trimming whitespace:

```typescript
expect(element).toEqualText('Hello World');
expect(shadowElement).toEqualText('Button Label');
```

### Attribute Matchers

#### `toHaveAttribute(attributeName)`

Checks if an element has a specific attribute (regardless of value):

```typescript
expect(element).toHaveAttribute('disabled');
expect(element).toHaveAttribute('data-testid');
expect(element).not.toHaveAttribute('hidden');
```

#### `toEqualAttribute(attributeName, value)`

Checks if an element has a specific attribute with an exact value:

```typescript
expect(element).toEqualAttribute('role', 'button');
expect(element).toEqualAttribute('aria-label', 'Close dialog');
expect(element).toEqualAttribute('data-count', '5');
```

#### `toEqualAttributes(attributes)`

Checks multiple attributes and their values at once:

```typescript
expect(element).toEqualAttributes({
  'role': 'button',
  'aria-label': 'Submit form',
  'data-testid': 'submit-btn',
  'disabled': '' // Boolean attributes have empty string values
});
```

### Class Matchers

#### `toHaveClass(className)`

Checks if an element has a specific CSS class:

```typescript
expect(element).toHaveClass('active');
expect(element).toHaveClass('btn-primary');
expect(element).not.toHaveClass('disabled');
```

#### `toHaveClasses(classNames)`

Checks if an element has all of the specified CSS classes (order doesn't matter):

```typescript
expect(element).toHaveClasses(['btn', 'btn-primary', 'btn-large']);
expect(element).toHaveClasses(['container', 'container--focused']);
```

#### `toMatchClasses(classNames)`

Checks if an element has exactly the specified CSS classes (no more, no less):

```typescript
expect(element).toMatchClasses(['btn', 'btn-primary']);
// This would fail if element also had 'btn-large' class
```

### Event Matchers

These matchers work with EventSpy objects for testing custom events:

#### `toHaveReceivedEvent()`

Checks if an event has been received at least once:

```typescript
const eventSpy = {
  eventName: 'buttonClick',
  events: [/* event objects */],
  length: 1
};

expect(eventSpy).toHaveReceivedEvent();
```

#### `toHaveReceivedEventTimes(count)`

Checks if an event has been received a specific number of times:

```typescript
expect(eventSpy).toHaveReceivedEventTimes(3);
expect(eventSpy).toHaveReceivedEventTimes(0); // No events received
```

#### `toHaveReceivedEventDetail(detail)`

Checks if the last received event has the expected detail data:

```typescript
expect(eventSpy).toHaveReceivedEventDetail({
  value: 'test',
  timestamp: expect.any(Number)
});
```

#### `toHaveFirstReceivedEventDetail(detail)`

Checks if the first received event has the expected detail data:

```typescript
expect(eventSpy).toHaveFirstReceivedEventDetail({
  count: 1,
  action: 'start'
});
```

#### `toHaveLastReceivedEventDetail(detail)`

Checks if the last received event has the expected detail data:

```typescript
expect(eventSpy).toHaveLastReceivedEventDetail({
  count: 5,
  action: 'complete'
});
```

#### `toHaveNthReceivedEventDetail(index, detail)`

Checks if the event at a specific index has the expected detail data:

```typescript
expect(eventSpy).toHaveNthReceivedEventDetail(0, { count: 1 }); // First event
expect(eventSpy).toHaveNthReceivedEventDetail(2, { count: 3 }); // Third event
```

### Event Testing Example

Here's a complete example of testing events with the EventSpy matchers:

```typescript
describe('button events', () => {
  it('should emit events with correct details', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [MyButton],
      html: '<my-button></my-button>',
    });

    const events = [];
    root.addEventListener('buttonClick', (e) => {
      events.push(e);
    });

    // Click multiple times
    root.click();
    await waitForChanges();
    root.click();
    await waitForChanges();
    root.click();
    await waitForChanges();

    // Create EventSpy-compatible object
    const eventSpy = {
      eventName: 'buttonClick',
      events: events,
      firstEvent: events[0],
      lastEvent: events[events.length - 1],
      length: events.length
    };

    // Test with EventSpy matchers
    expect(eventSpy).toHaveReceivedEvent();
    expect(eventSpy).toHaveReceivedEventTimes(3);
    expect(eventSpy).toHaveFirstReceivedEventDetail({ count: 1 });
    expect(eventSpy).toHaveLastReceivedEventDetail({ count: 3 });
  });
});
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
