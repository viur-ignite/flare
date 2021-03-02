module.exports = function (gulp, plugins, options) {

	plugins.path = require('path');
	plugins.less = require('gulp-less');
	plugins.postcss = require('gulp-postcss');
	plugins.zindex = require('postcss-zindex');
	plugins.autoprefixer = require('autoprefixer');
	plugins.focus = require('postcss-focus');
	plugins.nocomments = require('postcss-discard-comments');
	plugins.cleancss = require('gulp-clean-css');
	plugins.jmq = require('gulp-join-media-queries');
	plugins.stylefmt = require('gulp-stylefmt');

	return function () {
		/*gulp.task('version-dev')();*/

		return gulp.src(options.src)
			.pipe(plugins.less({
				paths: [plugins.path.join(__dirname, 'less', 'includes')]
			}))
			.pipe(plugins.postcss([
				plugins.autoprefixer({ // add vendor prefixes
					cascade: false
				}),
				plugins.nocomments, // discard comments
				plugins.focus, // add focus to hover-states
				// plugins.zindex, // reduce z-index values - deprecated, use .zIndex()-mixin
			])) // clean up css
			.pipe(plugins.jmq())
			//#fixme: .pipe(plugins.stylefmt()) // syntax formatting, stylefmt destroys background inline-svg
			.pipe(gulp.dest(options.dest)) // save cleaned version
			.pipe(plugins.cleancss({zindex: false})) // minify css
			.pipe(plugins.rename({suffix: '.min'}))
			.pipe(gulp.dest(options.dest)); // save minified version
	}
};
