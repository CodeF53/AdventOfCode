import antfu from '@antfu/eslint-config'

export default await antfu({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
}, {
  rules: {
    'node/prefer-global/process': 'off',
    'no-console': 'off',
    'antfu/if-newline': 'off',
    'ts/unbound-method': 'off',
  },
})
