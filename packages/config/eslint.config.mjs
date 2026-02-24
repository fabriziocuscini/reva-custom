import eslint from '@eslint/js'
import panda from '@pandacss/eslint-plugin'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default [
  // Base JS recommended rules
  eslint.configs.recommended,

  // TypeScript strict rules (no type-checking for speed)
  ...tseslint.configs.strict,

  // React
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],

  // React Hooks
  reactHooks.configs.flat.recommended,

  // Accessibility
  jsxA11y.flatConfigs.recommended,

  // Panda CSS + Import sorting + custom rules
  {
    plugins: {
      '@pandacss': panda,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Panda CSS
      ...panda.configs.recommended.rules,

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // React (already set by flat config, but ensure these)
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/styled-system/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/.source/**',
      '**/.fumadocs/**',
    ],
  },
]
