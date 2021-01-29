function initfiles(plugins) {
	try {
		plugins.fs.accessSync('version.json');
	} catch (error) {
		plugins.fs.writeFileSync('version.json',
			'{"version": "1.0.0"}\n'
		);
	}
	try {
		plugins.fs.accessSync(plugins.taskfolder + 'version.py')
	} catch (error) {
		plugins.fs.writeFileSync(plugins.taskfolder + 'version.py',
			'#!/usr/bin/python\n' +
			'# -*- coding: utf-8 -*-\n\n' +
			'version = {\n' +
			'\t"version": "@@version",\n' +
			'\t"lastbuild": "@@timestamp",\n' +
			'\t"name": "@@name"\n' +
			'}\n'
		);
	}

	try {
		plugins.fs.accessSync(plugins.taskfolder + 'codenames.json')
	} catch (error) {
		plugins.fs.writeFileSync(plugins.taskfolder + 'codenames.json', "{\n" +
			"\t\"0\":\"Auckland Field\",\n" +
			"\t\"1\":\"Blue Lake Crater\",\n" +
			"\t\"2\":\"Crow Lagoon\",\n" +
			"\t\"3\":\"Deception Island\",\n" +
			"\t\"4\":\"Endeavour Ridge\",\n" +
			"\t\"5\":\"Falcon Island\",\n" +
			"\t\"6\":\"Glacier Peak\",\n" +
			"\t\"7\":\"Hudson Mountains\",\n" +
			"\t\"8\":\"Inyo Craters\",\n" +
			"\t\"9\":\"Jordan Craters\",\n" +
			"\t\"10\":\"Korath Range\",\n" +
			"\t\"11\":\"Lavic Lake\",\n" +
			"\t\"12\":\"Montagu Island\",\n" +
			"\t\"13\":\"North Vate\",\n" +
			"\t\"14\":\"Oka Plateau\",\n" +
			"\t\"15\":\"Prevo Peak\",\n" +
			"\t\"16\":\"Quilotoa\",\n" +
			"\t\"17\":\"Risco Plateado\",\n" +
			"\t\"18\":\"Santa Cruz\",\n" +
			"\t\"19\":\"Toney Mountain\",\n" +
			"\t\"20\":\"Ukinrek Maars\",\n" +
			"\t\"21\":\"Vesuvius\",\n" +
			"\t\"22\":\"Wai Sano\",\n" +
			"\t\"23\":\"Xianjindao\",\n" +
			"\t\"25\":\"Yellowstone\",\n" +
			"\t\"26\":\"Znegyu\"\n" +
			"}\n")
	}
}

function rebuildVersion(gulp, plugins) {
	let content = plugins.fs.readFileSync('version.json', 'utf8');
	let pkg = JSON.parse(content); // require('./version.json');
	let minver = plugins.semver.major(pkg.version);
	let codenames = require('./codenames.json');

	/* Debug
	console.log(plugins.semver.major(pkg.version)); //major Release
	console.log(plugins.semver.minor(pkg.version)); //feature Release
	console.log(plugins.semver.patch(pkg.version)); //bugfix Release
	console.log(plugins.semver.prerelease(pkg.version)); //development
	*/

	// build new version.py
	let stream = gulp.src(plugins.taskfolder + 'version.py')
		.pipe(plugins.replace({
			patterns: [{
				match: 'version',
				replacement: pkg.version
			}]
		}))
		.pipe(plugins.replace({
			patterns: [{
				match: 'timestamp',
				replacement: new Date().getTime()
			}]
		}))
		.pipe(plugins.replace({
			patterns: [{
				match: 'name',
				replacement: codenames[minver]
			}]
		}))
		.pipe(gulp.dest(plugins.projektfolder));
	return stream
}


module.exports = function (gulp, plugins) {
	// register plugins
	plugins.fs = require('fs');
	plugins.bump = require('gulp-bump');
	plugins.replace = require('gulp-replace-task');
	plugins.semver = require('semver');
	plugins.initfiles = initfiles;
	plugins.rebuildVersion = rebuildVersion;


	return function () {
		plugins.projektfolder = '../deploy/';
		plugins.taskfolder = './gulptasks/versioning/';

		// file creation
		plugins.initfiles(plugins);

		// increment Version
		stream = gulp.src('version.json')
			.pipe(plugins.bump({type: 'prerelease'}))
			.pipe(gulp.dest('./'));

		stream.on('end', function () {
			// build new version.py
			plugins.rebuildVersion(gulp, plugins);
		});

		return stream;
	}
};
