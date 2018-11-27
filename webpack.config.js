/* global process __dirname */
const DEV = process.env.NODE_ENV !== 'production';

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const appPath = `${path.resolve(__dirname)}`;

// Dev Server
const proxyUrl = 'dev.boilerplate.com'; // local dev url example: dev.wordpress.com

// Theme
const themeName = 'inf_theme';
const themePath = `/wp-content/themes/${themeName}/skin`;
const themePublicPath = `${themePath}/public/`;
const themeEntry = `${appPath}/skin/assets/application.js`;
const themeAdminEntry = `${appPath}/skin/assets/application-admin.js`;
const themeOutput = `${appPath}/skin/public`;

// Outputs
const outputHash = `${DEV ? '[name]' : '[name]-[hash]'}`;
const outputStatic = '[name].[ext]';


// All loaders to use on assets.
const allModules = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    },
    {
      test: /\.json$/,
      exclude: /node_modules/,
      use: `file-loader?name=${outputStatic}`,
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
      exclude: [/fonts/, /node_modules/],
      use: `file-loader?name=${outputStatic}`,
    },
    {
      test: /\.(eot|otf|ttf|woff|woff2|svg)$/,
      exclude: [/images/, /node_modules/],
      use: `file-loader?name=${outputStatic}`,
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader', 'postcss-loader', 'sass-loader',
      ],
    },
  ],
};

// All plugins to use.
const allPlugins = [

  // Convert JS to CSS.
  new MiniCssExtractPlugin({
    filename: `${outputHash}.css`,
  }),

  // Gives you jQuery with in the webpack so no need for impoting it.
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
  }),

  // Use BrowserSync.
  new BrowserSyncPlugin(
    {
      host: 'localhost',
      port: 3000,
      proxy: proxyUrl,
      files: [
        {
          match: [
            '**/*.php',
            `${themePublicPath}*.css`,
          ],
        },
      ],
      notify: true,
    },
    {
      reload: false,
    },
  ),

  // Copy from one target to new destination.
  new CopyWebpackPlugin([

    // Find jQuery in node_modules and copy it to public folder
    {
      from: `${appPath}/node_modules/jquery/dist/jquery.min.js`,
      to: themeOutput,
    },
  ]),

  // Create manifest.json file.
  new ManifestPlugin({
    publicPath: `/skin/public/`,
  }),
];

// General optimisations.
const allOptimizations = {
  runtimeChunk: false,
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
    },
  },
};

// Use only for production build
if (!DEV) {
  allOptimizations.minimizer = [

    // Optimise for production.
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        output: {
          comments: false,
        },
        compress: {
          warnings: false,
          drop_console: true, // eslint-disable-line camelcase
        },
      },
    }),
  ];

  // Delete public folder.
  allPlugins.push(new CleanWebpackPlugin([themeOutput]));
}

module.exports = [

  // Theme Skin
  {
    context: path.join(__dirname),
    entry: {
      application: [themeEntry],
      applicationAdmin: [themeAdminEntry],
    },
    output: {
      path: themeOutput,
      publicPath: themePublicPath,
      filename: `${outputHash}.js`,
    },

    // Don't bundle jQuery but expect it from a different source.
    externals: {
      jquery: 'jQuery',
    },

    optimization: allOptimizations,

    module: allModules,

    plugins: allPlugins,

    devtool: DEV ? '' : 'source-map',
  },
];
