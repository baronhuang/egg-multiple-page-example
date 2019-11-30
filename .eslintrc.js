module.exports = {
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:vue/essential'
  ],
  plugins: [
    'vue'
  ],
  env: {
    'browser': true,
    'node': true,
    'es6': true
  },
  globals: {
    '$': false
  },
  parserOptions: {
    'parser': 'babel-eslint', // 支持import异步组件
    'sourceType': 'module',
    'allowImportExportEverywhere': true
  },
  /**
   * 'off' 或 0 - 关闭规则
   * 'warn' 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
   * 'error' 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  'rules': {
    'no-new': 0,  // 不需要存储new的对象
    'no-console': 0,  // 禁用 console
    'no-debugger': 0, // 禁用debugger
    'no-trailing-spaces': 0,  // 禁用行尾空白
    'semi': ['error', 'always'],  // 要求分号
    'no-eval': 0, // 禁用 eval()
    'no-unused-expressions': ['error', { 'allowTernary': true, 'allowShortCircuit': true }],  // 禁止未使用过的表达式
    'no-throw-literal': 0 // 限制可以被抛出的异常
  }
};
