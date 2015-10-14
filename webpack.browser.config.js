var path = require('path')
var webpack = require('webpack')
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV !== 'production')),
})

module.exports = {
  context: __dirname,
  entry: './src/index',
  output: {
    path: path.join(__dirname, '/browser'),
    filename: 'react-gsap-enhancer.js',
    library: 'ReactGSAPEnhancer',
    libraryTarget: 'var'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  externals: {
    react: 'var React'
  },
  plugins: [definePlugin]
}
