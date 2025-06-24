# form-input



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description                     | Type                                          | Default     |
| --------------- | ----------------- | ------------------------------- | --------------------------------------------- | ----------- |
| `disabled`      | `disabled`        | Whether input is disabled       | `boolean`                                     | `false`     |
| `label`         | `label`           | Input label                     | `string`                                      | `undefined` |
| `maxLength`     | `max-length`      | Maximum length                  | `number`                                      | `undefined` |
| `minLength`     | `min-length`      | Minimum length                  | `number`                                      | `undefined` |
| `placeholder`   | `placeholder`     | Input placeholder               | `string`                                      | `undefined` |
| `required`      | `required`        | Whether input is required       | `boolean`                                     | `false`     |
| `showCharCount` | `show-char-count` | Whether to show character count | `boolean`                                     | `false`     |
| `type`          | `type`            | Input type                      | `"email" \| "number" \| "password" \| "text"` | `'text'`    |
| `value`         | `value`           | Input value                     | `string`                                      | `''`        |


## Events

| Event         | Description                            | Type                                                |
| ------------- | -------------------------------------- | --------------------------------------------------- |
| `inputBlur`   | Event emitted when input loses focus   | `CustomEvent<{ value: string; isValid: boolean; }>` |
| `inputChange` | Event emitted when input value changes | `CustomEvent<{ value: string; isValid: boolean; }>` |
| `inputFocus`  | Event emitted when input is focused    | `CustomEvent<string>`                               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
