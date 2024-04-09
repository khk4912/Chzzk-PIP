import type { Configuration } from 'webpack'
import { resolve } from 'path'
import CopyPlugin = require('copy-webpack-plugin')

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development'

const config: Configuration = {
  mode,
  devtool: mode === 'development' ? 'inline-source-map' : false,
  entry: {
    content_script: resolve(__dirname, 'src/scripts/content_script.ts'),
    record_result: resolve(__dirname, 'src/scripts/record_result.ts'),
    popup_script: resolve(__dirname, 'src/scripts/popup_script.ts'),
    download_vod: resolve(__dirname, 'src/scripts/download_vod.ts'),
    monkeypatch_core: resolve(__dirname, 'src/scripts/monkeypatch_core.ts'),
    service_worker: resolve(__dirname, 'src/scripts/service_worker.ts'),

    // Page entry
    popup: resolve(__dirname, 'src/pages/popup/popup.tsx')

  },
  output: {
    path: resolve(__dirname, 'dist/js'),
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
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '..'
        },
        {
          from: 'ffmpeg',
          to: '../ffmpeg/'
        },
        {
          from: 'vendors',
          to: '../js/.'
        }
      ]
    })
  ]
}

export default config
