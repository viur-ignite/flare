// register versioning_dev first!!!
module.exports = function (gulp, plugins) {

	return function () {
		plugins.projektfolder = '../deploy/';
		plugins.taskfolder = './gulptasks/versioning/';

		// file creation
		plugins.initfiles(plugins);

		// increment Version
		stream = gulp.src('version.json')
			.pipe(plugins.bump({type: 'patch'}))
			.pipe(gulp.dest('./'));

		stream.on('end', function () {
			// build new version.py
			plugins.rebuildVersion(gulp, plugins);
		});

		return stream;
	}
};
