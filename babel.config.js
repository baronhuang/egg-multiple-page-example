
const plugins = [
  ['@babel/plugin-transform-runtime']
];
if (process.env.NODE_ENV === 'production') {
  // 移除console.log
  plugins.push('transform-remove-console');
}

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'usage',
        'corejs': 3,
        // 若需要使用webpack的tree shaking，必须设置为false
        'modules': false,
        'targets': {
          'chrome': 55,
          'ie': 9
        }
      }
    ]
  ],
  plugins: plugins
};
