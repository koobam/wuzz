module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-worklets/plugin'],
    [
      'module-resolver',
      {
        alias: {
          '@features': './src/features',
          '@core': './src/core',
          '@components': './src/components',
          '@pages': './src/pages',
          '@http': './src/core/http',
          '@mock': './src/core/mock',
          '@api': './src/core/api',
          '@hooks': './src/services/hooks',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@utils': './src/utils',
          '@assets': './public/assets',
          '@icons': './public/icons',
          '@fonts': './public/fonts',
        },
      },
    ],
    'hot-updater/babel-plugin',
    '@babel/plugin-transform-class-static-block',
  ],
};
