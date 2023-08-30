module.exports = {
  extends: 'erb',
  plugins: ['@typescript-eslint', 'oclif', 'oclif-typescript'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    // Martin's additions to boilerplate
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function' },
    ],
    'class-methods-use-this': 'off',
    'prettier/prettier': 'off',

    // From marchive-cli
    'unicorn/prefer-optional-catch-binding': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-for-loop': 'off',
    'no-eq-null': 'off',
    eqeqeq: 'off',
    'linebreak-style': 'off',
    'max-params': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'new-cap': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/prefer-date-now': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
