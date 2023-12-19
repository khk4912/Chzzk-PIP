import type * as webpack from 'webpack'
import * as path from 'path'
import CopyPlugin = require('copy-webpack-plugin')

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development'

const config: webpack.Configuration = {
  mode,
  entry: {
    content_script: path.resolve(__dirname, 'src/scripts/content_script.ts')
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].js',
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '..'
        }
      ]
    })
  ]
}

export default config
