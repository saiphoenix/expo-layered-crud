// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const pluginQuery = require('@tanstack/eslint-plugin-query');

module.exports = defineConfig([
  expoConfig,
  ...pluginQuery.configs['flat/recommended'],
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'coverage/*', 'src/components/ui/*'],
  },

  /*
   * LAYER RULES - ESLint stops you from skipping a layer.
   * Screens & components  ->  React Query hooks (@/queries)  ->  services  ->  api client
   */
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/services', '@/services/*'],
              message: 'UI must not call services directly. Use a hook from @/queries instead.',
            },
            {
              group: ['@/api/http-client'],
              message: 'UI must not make HTTP calls. Use a hook from @/queries instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/api/http-client.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Only src/api/http-client.ts may call fetch. Use `http` from @/api.',
        },
      ],
    },
  },
]);
