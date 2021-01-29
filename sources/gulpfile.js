// Project data

var srcpaths = {
	less: './less/**/*.less',
	images: './images/**/*',
	icons: './embedsvg/icons/**/*',
	logos: './embedsvg/logos/**/*',
	libJS: './js/libs/**/*',
	appJS: './js/app/**/*.js',
	appJSFile: './js/app.js',
};

var destpaths = {
	css: '../deploy/static/css',
	js: '../deploy/static/js/generated',
	images: '../deploy/static/images',
	embedsvg: '../deploy/static/svgs',
	vue: '../deploy/static/vue',
};


// Dependencies and Plugins

const gulp = require('gulp');
const plugins = require('gulp-load-plugins');

plugins.rename = require('gulp-rename');
plugins.del = require('del');
plugins.imagemin = require('gulp-imagemin');
plugins.cheerio = require('gulp-cheerio');


function loadTask(task, options) {
	return require('./gulptasks/' + task)(gulp, plugins, options)
}


gulp.task('version-dev', loadTask('versioning/versioning_dev')); //increase dev version
gulp.task('version-bugfix', loadTask('versioning/versioning_fix')); //increase bugfix version
gulp.task('version-minor', loadTask('versioning/versioning_release')); //increase minor version
gulp.task('version-major', loadTask('versioning/versioning_major')); //increase major version

gulp.task('js', loadTask('js_task', {
	src: srcpaths.appJS,
	srcFile: srcpaths.appJSFile,
	dest: destpaths.js
}));

gulp.task('lib', loadTask('lib_task', {
	src: [
		//'./js/libs/ie-polyfill.js',
		'./js/libs/jquery.min.js',
		'./js/libs/jquery-lib.js',
		'./js/libs/lazysizes.min.js',
		'./js/libs/ofi.min.js',
		'./js/libs/swiper.min.js',
		//'./js/libs/jquery.photoswipe-global.min.js',
		'./js/libs/jquery-modal-video.min.js',
		'./js/libs/jquery-ui.min.js'
	],
	dest: destpaths.js
}));

gulp.task('css', loadTask('css_task', {
	src: './less/style.less',
	dest: destpaths.css
}));

gulp.task('admin-css', loadTask('css_task', {
	src: './less/admin.less',
	dest: destpaths.css
}));

gulp.task('icons', loadTask('icon_task', {
	src: srcpaths.icons,
	dest: destpaths.embedsvg
}));

gulp.task('logos', loadTask('logo_task', {
	src: srcpaths.logos,
	dest: destpaths.embedsvg
}));

gulp.task('images', loadTask('image_task', {
	src: srcpaths.images,
	dest: destpaths.images
}));

gulp.task('vue', loadTask('vue_task',{
	src: srcpaths.vue,
	dest: destpaths.vue
}))

gulp.task('watch', function () {
	gulp.watch(srcpaths.less, gulp.series('css'));
	gulp.watch(srcpaths.less, gulp.series('admin-css'));
	gulp.watch(srcpaths.icons, gulp.series('icons'));
	gulp.watch(srcpaths.logos, gulp.series('logos'));
	gulp.watch(srcpaths.images, gulp.series('images'));
	gulp.watch(srcpaths.libJS, gulp.series('lib'));
	gulp.watch(srcpaths.appJS, gulp.series('js'));
	gulp.watch(srcpaths.appJSFile, gulp.series('js'));
	gulp.watch(srcpaths.vue, gulp.series('vue'));
});


gulp.task('default', gulp.series([
	'css', 'admin-css',
	'images', 'icons', 'logos',
	'js', 'lib',
	'vue'
]));
