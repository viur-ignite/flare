module.exports = function (gulp, plugins, options) {

	return function () {
		gulp.task('version-dev')();  // increase dev number

		plugins.del([options.dest + '/**/icon-*',], {force: true});

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
					$('style').remove();
					$('[id]').removeAttr('id');
					//$('[class]').removeAttr('class')
					$('[fill]').removeAttr('fill');
					$('svg').addClass('icon').removeAttr("x").removeAttr("y");
				},
				parserOptions: {xmlMode: true}
			}))
			.pipe(plugins.rename({prefix: "icon-"}))
			.pipe(gulp.dest(options.dest));
	}
};
