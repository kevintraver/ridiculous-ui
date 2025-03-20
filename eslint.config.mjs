import eslint from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  eslint.configs.recommended,
  prettierConfig,
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'dist/**', 'public/**']
  },
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'error',
      quotes: ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'arrow-parens': ['error', 'as-needed'],
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ]
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint
    },
    languageOptions: {
      parser: tsParser
    },
    rules: {
      'prettier/prettier': 'error',
      quotes: ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'arrow-parens': ['error', 'as-needed'],
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ]
    }
  }
]
