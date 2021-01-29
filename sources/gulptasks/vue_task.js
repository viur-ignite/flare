module.exports = function (gulp, plugins, options) {

	plugins.sourcemaps = require('gulp-sourcemaps');
	plugins.babel = require('gulp-babel');
	plugins.exec = require('gulp-exec');
	plugins.filter = require('gulp-filter');

	return function () {
		gulp.task('version-dev')();  // increase dev number

		return gulp.src('.')
			.pipe(plugins.exec('npm run vue-prod-deploy'))
			.pipe(plugins.exec.reporter({
				err: true,
				stderr: true,
				stdout: true
			}))
	}
};
