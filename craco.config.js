// craco.config.js
const CracoLessPlugin = require('craco-less')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const reactRefreshOverlayEntry = require.resolve(
  'react-dev-utils/refreshOverlayInterop'
);

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.output = {
        ...webpackConfig.output,
      }

      return webpackConfig;
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ]
}