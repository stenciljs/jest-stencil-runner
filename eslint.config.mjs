import { sxzz } from '@sxzz/eslint-config';

const sxzzConfig = await sxzz();

export default [
  ...sxzzConfig,
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^h$',
          argsIgnorePattern: '^h$',
        },
      ],
      'unused-imports/no-unused-imports': [
        'error',
        {
          varsIgnorePattern: '^h$',
        },
      ],
    },
  },
];
