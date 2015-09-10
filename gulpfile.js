var gulp = require('gulp')
var gutil = require('gulp-util')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var demoWebpackConfig = require('./demo/webpack.config.js')
var ghPages = require('gulp-gh-pages')


gulp.task('default', ['webpack-dev-server'])

gulp.task('gh-pages', ['build-demo'], function() {
  return gulp.src('./demo/dist/**/*')
    .pipe(ghPages())
})

gulp.task('build-demo', function(callback) {
  var myConfig = Object.create(demoWebpackConfig)
  myConfig.plugins = [new webpack.DefinePlugin({
    __WIP__: 'false'
  })]

	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('build-demo', err)
		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}))
		callback()
	})
})

gulp.task('webpack-dev-server', function() {
  var myConfig = Object.create(demoWebpackConfig)
	myConfig.devtool = '#eval-source-map'
	myConfig.debug = true

	new WebpackDevServer(webpack(myConfig), {
		publicPath: '/' + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, 'localhost', function(err) {
		if(err) throw new gutil.PluginError('webpack-dev-server', err)
		gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html')
	})
})
