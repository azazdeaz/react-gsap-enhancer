var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var demoWebpackConfig = require('./demo/webpack.config.js');
var webpackConfig = {};
var ghPages = require('gulp-gh-pages');


gulp.task('default', ['webpack-dev-server']);

gulp.task('gh-pages', ['build-demo'], function() {
  return gulp.src('./demo/dist/**/*')
    .pipe(ghPages());
});

gulp.task('build-demo', function(callback) {
	webpack(demoWebpackConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('build-demo', err);
		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));
		callback();
	});
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:build-dev', err);
		gutil.log('[webpack:build-dev]', stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task('webpack-dev-server', function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(demoWebpackConfig);
	myConfig.devtool = '#eval-source-map';
	myConfig.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: '/' + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, 'localhost', function(err) {
		if(err) throw new gutil.PluginError('webpack-dev-server', err);
		gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
	});
});
