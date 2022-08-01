const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

module.exports = {
  pluginOptions: {
    storybook: {
      allowedPlugins: ["define"]
    }
  },

  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options["transformAssetUrls"] = {
          img: "src",
          image: "xlint:href",
          "b-img": "src",
          "b-img-lazy": ["src", "blank-src"],
          "b-card": "img-src",
          "b-card-img": "img-src",
          "b-card-img-lazy": ["src", "blank-src"],
          "b-carousel-slide": "img-src",
          "b-embed": "src"
        };
        return options;
      });
    // i18n Loader
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@kazupon/vue-i18n-loader")
      .end();
  },
  devServer: {
    client: {
      logging: "info"
    },
    static: {
      watch: true
    }
  },
  configureWebpack: {
    plugins: [
      new AntdDayjsWebpackPlugin({
        preset: "antdv3"
      })
    ]
  },
  pwa: {
    name: "Flowlity",
    themeColor: "#2d3748",
    msTileColor: "#2d3748",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestPath: "manifest.json",
    workboxOptions: {
      skipWaiting: true
    }
  },
  // needed after a bump in package -> https://github.com/ant-design/ant-motion/issues/44
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // important extra layer for less-loader^6.0.0
          javascriptEnabled: true
        }
      }
    }
  }
};
