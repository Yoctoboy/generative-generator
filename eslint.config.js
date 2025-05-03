import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import { configs as tsEslintConfig } from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    },
    {
        languageOptions: {
            globals: globals.browser,
            parser: '@typescript-eslint/parser',
        },
    },
    pluginJs.configs.recommended,
    ...tsEslintConfig.recommended,
    pluginReact.configs.flat.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    {
        rules: {
            'react/react-in-jsx-scope': 'off',
            'import/order': ['error', { alphabetize: { order: 'asc' } }],
            'react/no-unknown-property': ['off', { ignore: ['JSX'] }],
            '@typescript-eslint/consistent-type-assertions': [
                'error',
                { assertionStyle: 'never' },
            ],
        },
        settings: {
            react: { version: 'detect' },
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
                'typescript-bun': {
                    project: true,
                    alwaysTryTypes: true,
                },
            },
        },
    },
];
