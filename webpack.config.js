var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? 'production' : 'development'

// common Webpack config settings
var commonConfig = {
  output: {
    path: path.resolve(__dirname, 'public/'),
    filename: '[hash].min.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'react-hot-loader' },
          { loader: 'babel-loader' }
        ],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.(png|jpg|jpeg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 8192, name: './img/[hash].[ext]' } // inline if under 8k
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'url-loader',
            options: { limit: 2048, name: './fonts/[hash].[ext]' } // inline if under 2k
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          { loader: 'babel!svg-react' }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/demos/index.html',
      inject: 'body',
      filename: 'index.html'
    })
  ]
}

// additional Webpack settings when running locally ('npm start')
if (TARGET_ENV === 'development') {
  console.log('Serving demo locally...')

  module.exports = merge(commonConfig, {

    // source maps (better than 'eval' but slower)
    devtool: 'inline-source-map',

    // dev server settings
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true
      // progress: true
    },

    // dev server with hot-loader
    entry: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './src/demos/index'
    ],

    module: {
      rules: [
        {
          // compile & auto-prefix CSS
          test: /\.(css|scss)$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' }
          ]
        }
      ]
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })
}

// additional Webpack settings when bundling for prod ('npm run build')
if (TARGET_ENV === 'production') {
  console.log('Building demo for prod...')

  module.exports = merge(commonConfig, {

    entry: [
      path.join(__dirname, 'src/demos/index')
    ],

    module: {
      rules: [
        {
          // create and save out a CSS bundle (using ExtractTextPlugin)
          test: /\.(css|scss)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [ 'css-loader', 'postcss-loader', 'sass-loader' ]
          })
        }
      ]
    },

    plugins: [
      // set global vars
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),

      // optimizations
      new webpack.optimize.OccurrenceOrderPlugin(),

      // save out CSS bundle (backtrack out of scripts/ to save into css/)
      new ExtractTextPlugin('css/[hash].min.css', { allChunks: true }),

      // minify & mangle JS/CSS
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compressor: { warnings: false }
        // mangle:  { except:   [ '$super', '$', 'exports', 'require' ] }
      })
    ]
  })
}
