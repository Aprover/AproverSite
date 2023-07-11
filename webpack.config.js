import Dotenv from "dotenv-webpack"
import path from "path"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"
import webpack from "webpack"


export default {
  // Define the entry points of our application (can be multiple for different sections of a website)
  entry: {
    main: "./src/js/main.js",
    messageBuilder: "./src/js/messageBuilder.js",
    receptionBuilder: "./src/js/receptionBuilder.js"
  },

  // Define the destination directory and filenames of compiled resources
  output: {
    filename: "js/[name].js",
    path: path.resolve(process.cwd(), "./public"),
  },

  // Define development options
  devtool: "source-map",

  // Define loaders
  module: {
    rules: [
      // Use babel for JS files
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env"
            ]
          }
        }
      },
      // CSS, PostCSS, and Sass
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: true,
              url: false,
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "autoprefixer",
                ]
              }
            }
          },
          "sass-loader"
        ],
      },
      // File loader for images
      {
        test: /\.(jpg|jpeg|png|git|svg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ],
  },
  node: { global: true },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      name: false
    },
  },
  // Define used plugins
  plugins: [
    // Load .env file for environment variables in JS
    new Dotenv({
      path: "./.env"
    }),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),

    // Inject styles and scripts into the HTML
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(process.cwd(), "index.html"),
      chuncks: ['main'],
      excludeChunks: ['messageBuilder', 'receptionBuilder']
    }),

    new HtmlWebpackPlugin({
      filename: "messageBuilder.html",
      template: path.resolve(process.cwd(), "messageBuilder.html"),
      chunks: ['messageBuilder']
    }),

    new HtmlWebpackPlugin({
      filename: "receptionBuilder.html",
      template: path.resolve(process.cwd(), "receptionBuilder.html"),
      chunks: ['receptionBuilder']
    }),

    // Copy images to the public folder
    new CopyPlugin({
      patterns: [
        {
          from: "src/images",
          to: "images",
        }
      ]
    }),

    // Extracts CSS into separate files
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "[id].css"
    }),
  ],

  // Configure the "webpack-dev-server" plugin
  devServer: {
    static: {
      directory: path.resolve(process.cwd(), "public")
    },
    watchFiles: [
      path.resolve(process.cwd(), "index.html")
    ],
    compress: true,
    port: process.env.PORT || 9090,
    hot: true,
  },

  // Performance configuration
  performance: {
    hints: false
  }
};