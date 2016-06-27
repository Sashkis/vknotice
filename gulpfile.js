'use strict';

var gulp       = require('gulp');
var del        = require('del');

var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var gulpif     = require('gulp-if');
var flatten    = require('gulp-flatten');

var useref     = require('gulp-useref');
var uglify     = require('gulp-uglify');
var cleanCSS   = require('gulp-clean-css');
var htmlmin    = require('gulp-htmlmin');
var jsonminify = require('gulp-jsonminify');

var wiredep    = require('wiredep').stream;
var gettext    = require('gulp-angular-gettext');

gulp.task('pot', function () {
    return gulp.src(['src/**/*.html', 'src/**/*.js'])
        .pipe(gettext.extract('all.pot'))
        .pipe(gulp.dest('po/'));
});

gulp.task('translations', function () {
	return gulp.src(['po/**/*.po'])
		.pipe(gettext.compile())
		.pipe(gulp.dest('src/Translations/'));
});


gulp.task('default', ['sass:watch']);

gulp.task('sass', function () {
	return gulp.src(['./src/**/*.scss', '!src/bower_components/**/*.scss'])
	  .pipe(sourcemaps.init())
	  .pipe(sass().on('error', sass.logError))
	  .pipe(sourcemaps.write())
	  .pipe(gulp.dest('src'));
});

gulp.task('sass:watch', ['sass'], function () {
	gulp.watch(['./src/**/*.scss', '!src/bower_components/**/*.scss'], ['sass']);
});


gulp.task('copy', ['copy:fonts'], function () {
	return gulp.src(['src/*.json', 'src/+(_locales)/**/*.json', 'src/+(BackgroundApp)/+(audio|img)/*', 'src/**/*.tpl'])
	      .pipe(gulpif('*.json', jsonminify()))
	      .pipe(gulpif('*.tpl', htmlmin({collapseWhitespace: true})))
	      .pipe(gulp.dest('build'))
});

gulp.task('copy:fonts', function () {
	var fileName = '*.{woff,woff2}';
	return gulp.src([
		'src/bower_components/open-sans/fonts/+(regular|bold)/'+fileName,
		'src/bower_components/components-font-awesome/fonts/'+fileName,
	])
	      .pipe(flatten({ includeParents: -1}))
	      .pipe(gulp.dest('build/vendors/fonts'));
});


gulp.task('build', ['sass', 'clean'], function () {
	gulp.start('build:all');
});

gulp.task('build:all', [
	'build:Background',
	'build:Options',
	'build:Popup',
	'copy',
]);
gulp.task('build:Background', function () {
	return gulp.src('src/BackgroundApp/background.html')
	      .pipe(useref())
	      .pipe(gulpif('*.js', uglify()))
	      .pipe(gulpif('*.css', cleanCSS()))
	      .pipe(gulp.dest('build/BackgroundApp'));
});

gulp.task('build:Options', function () {
	return gulp.src('src/OptionsApp/*.html')
	      .pipe(useref())
	      .pipe(gulpif('*.js', uglify()))
	      .pipe(gulpif('*.css', cleanCSS()))
				.pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
	      .pipe(gulp.dest('build/OptionsApp/'));
});

gulp.task('build:Popup', function () {
	return gulp.src('src/PopupApp/popup.html')
	      .pipe(useref())
	      .pipe(gulpif('*.js', uglify()))
	      .pipe(gulpif('*.css', cleanCSS()))
	      .pipe(gulp.dest('build/PopupApp'));
});

gulp.task('clean', function () {
	return del(['build/*']);
});

gulp.task('bower', function () {
	gulp.src('src/**/*.html')
	    .pipe(wiredep({
	      optional: 'configuration',
	      goes: 'here',
	    }))
	    .pipe(gulp.dest('src'));
});
