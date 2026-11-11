// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const pluginQuery = require('@tanstack/eslint-plugin-query');

/*
 * ARCHITECTURE RULES - ESLint keeps the vertical slices clean.
 * See docs/ARCHITECTURE.md -> "The import rules".
 *
 *   src/app       routes: thin, render a module's screen
 *   src/modules   business code: one folder per module, one sub-folder per feature
 *   src/shared    business-agnostic code every module may use
 *
 * Note: when several config blocks set `no-restricted-imports` for the same file, the LAST one
 * wins (options are replaced, not merged). That's why each block lists every rule it needs.
 */
const rules = {
  /** Outside a module, only its public API (`@/modules/<name>`) may be imported. */
  modulePublicApiOnly: {
    regex: '^@/modules/[^/]+/.+',
    message:
      "Import a module only through its public API: '@/modules/<name>'. Inside a module, use relative imports.",
  },
  /** Shared code must work in any app, so it can't know about business modules or routes. */
  sharedIsBusinessFree: {
    regex: '^@/(modules|app)(/|$)',
    message:
      'src/shared must not depend on modules or routes. Move the code into a module instead.',
  },
  /** A feature uses a sibling feature only through that feature's index.ts. */
  siblingFeaturePublicApiOnly: {
    regex: '^\\.\\./[^./][^/]*/.+',
    message:
      "Import another feature only through its index: '../<feature>'. Shared code inside a module goes in components/ or data/.",
  },
  /** UI never talks to services or the HTTP client directly: it uses a React Query hook. */
  uiNoService: {
    regex: '\\.service$',
    message:
      'UI must not call services directly. Use a React Query hook (data/*.queries.ts or a feature use-*.ts hook).',
  },
  uiNoHttp: {
    regex: '^@/shared/api/http-client$',
    message: 'UI must not make HTTP calls. Use a React Query hook instead.',
  },
};

const restrict = (...patterns) => ({
  'no-restricted-imports': ['error', { patterns }],
});

const UI_FILES = ['src/app/**/*.tsx', 'src/modules/**/*.tsx'];

module.exports = defineConfig([
  expoConfig,
  ...pluginQuery.configs['flat/recommended'],
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'coverage/*', 'src/shared/ui/*'],
  },

  // Everywhere: no deep imports into a module.
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: restrict(rules.modulePublicApiOnly),
  },
  // src/shared: no business code.
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: restrict(rules.sharedIsBusinessFree),
  },
  // Feature hooks and helpers (.ts): no reaching into a sibling feature's private files.
  {
    files: ['src/modules/*/features/**/*.ts'],
    rules: restrict(rules.modulePublicApiOnly, rules.siblingFeaturePublicApiOnly),
  },
  // UI (.tsx in routes and modules): no services, no HTTP.
  {
    files: UI_FILES,
    rules: restrict(rules.modulePublicApiOnly, rules.uiNoService, rules.uiNoHttp),
  },
  // Feature UI: all of the above.
  {
    files: ['src/modules/*/features/**/*.tsx'],
    rules: restrict(
      rules.modulePublicApiOnly,
      rules.siblingFeaturePublicApiOnly,
      rules.uiNoService,
      rules.uiNoHttp
    ),
  },

  // Only the HTTP client may call fetch.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/shared/api/http-client.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message:
            'Only src/shared/api/http-client.ts may call fetch. Use `http` from @/shared/api.',
        },
      ],
    },
  },
]);
