module.exports = function (gulp, plugins, options) {

	return function () {
		gulp.task('version-dev')();  // increase dev number

		plugins.del([options.dest + '/**/logo-*'], {force: true});

		return gulp.src(options.src)
			.pipe(plugins.imagemin([
				plugins.imagemin.mozjpeg({progressive: true}),
				plugins.imagemin.optipng({optimizationLevel: 5}),
				plugins.imagemin.svgo({
					plugins: [
						{removeViewBox: false},
						{removeDimensions: true}
					]
				})
			]))
			.pipe(plugins.cheerio({
				run: function ($, file) {
					$('svg').addClass('logo').removeAttr('x').removeAttr('y');
				},
				parserOptions: {xmlMode: true}
			}))
			.pipe(plugins.rename({prefix: 'logo-'}))
			.pipe(gulp.dest(options.dest));
	}
};
