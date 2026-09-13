module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@core': './src/core',
          '@features': './src/features',
          '@pages': './src/pages',
          '@navigation': './src/navigation',
          '@services': './src/services',
        },
      },
    ],
  ],
};
