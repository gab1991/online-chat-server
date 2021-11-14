module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-duplicate-imports': 'error',
    // disable standart rules to enable simple-sort-plugins rules
    'sort-imports': 'off',
    'import/order': 'off',
    //@simple-sort-pligins rules
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^@nest', '^@?\\w'],
          ['vendors', '^\\u0000'],
          ['types', '^types'],
          ['exit', '../'],
          ['deeper', './'],
        ],
      },
    ],
  },
};
