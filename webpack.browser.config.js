var path = require('path')

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
  }
}
