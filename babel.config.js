// Babel turns our TypeScript/JSX into JavaScript the app can run.
// `jsxImportSource: 'nativewind'` + `nativewind/babel` let us use `className` on React Native components.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
