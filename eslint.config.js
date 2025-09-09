module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['@typescript-eslint','react','react-hooks','import','unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    // выключаем правила, конфликтующие с Prettier
    'eslint-config-prettier'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // для React 17+
    'unused-imports/no-unused-imports': 'error',
    'import/order': ['warn', {
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
      groups: ['builtin','external','internal','parent','sibling','index','object','type']
    }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['dist','build','node_modules'],
};