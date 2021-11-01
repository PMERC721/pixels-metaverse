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
    // 以下代码！！！  与alias或babel同级
    configure: (webpackConfig, { env, paths }) => {
      // 修改build的生成文件名称
      webpackConfig.output = {
        ...webpackConfig.output,
      }

      return webpackConfig;
    }
  },
  // craco 提供的插件
  plugins: [
    // 配置 less
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