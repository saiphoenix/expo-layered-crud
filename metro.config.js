// Metro is the JavaScript bundler for React Native.
// `withNativeWind` compiles Tailwind classes from global.css into React Native styles.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/global.css', inlineRem: 16 });
