var path = require('path')
var webpack = require('webpack')

module.exports = {
  context: __dirname,
  entry: './src/index.jsx',
  output: {
    publicPath: '/dist/',
    path: path.join( __dirname, '/dist'),
    filename: 'index.js'
  },
  resolve: {
    packageMains: ['main'],
    extensions: ['', '.js', '.jsx'],
    alias: {
      'react-gsap-enhancer': path.join(__dirname, '../src/gsap-enhancer.js'),
      'react': path.join(__dirname, '../node_modules/react'),
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, '../src'),
          __dirname
        ]
      }, {
        test: /\.(html|css)/,
        loader: 'file?name=[name].[ext]',
        include: [
          path.join(__dirname, '../src'),
          __dirname
        ]
      }
    ]
  },
  plugins: [new webpack.DefinePlugin({
    __WIP__: 'true'
  })]
}
