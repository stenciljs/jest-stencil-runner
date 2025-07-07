# interactive-button



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute      | Description                    | Type                                   | Default      |
| ------------ | -------------- | ------------------------------ | -------------------------------------- | ------------ |
| `dataTestId` | `data-test-id` | Custom data attribute value    | `string`                               | `undefined`  |
| `disabled`   | `disabled`     | Whether the button is disabled | `boolean`                              | `false`      |
| `label`      | `label`        | The button label               | `string`                               | `'Click me'` |
| `variant`    | `variant`      | The button variant             | `"danger" \| "primary" \| "secondary"` | `'primary'`  |


## Events

| Event               | Description                                 | Type                                                 |
| ------------------- | ------------------------------------------- | ---------------------------------------------------- |
| `buttonClick`       | Event emitted when button is clicked        | `CustomEvent<{ count: number; timestamp: number; }>` |
| `buttonDoubleClick` | Event emitted when button is double clicked | `CustomEvent<{ message: string; }>`                  |
| `loadingChange`     | Event emitted when loading state changes    | `CustomEvent<boolean>`                               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
