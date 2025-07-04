import antfu from '@antfu/eslint-config'

export default await antfu({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
}, {
  ignores: ['bun.lock'],
  rules: {
    'node/prefer-global/process': 'off',
    'no-console': 'off',
    'antfu/if-newline': 'off',
    'ts/unbound-method': 'off',
    'no-new': 'off',
    'unused-imports/no-unused-vars': 'warn',
    'no-eval': 'off',
    'ts/strict-boolean-expressions': 'off',
  },
})
