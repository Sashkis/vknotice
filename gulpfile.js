'use strict';
// var debug = require('gulp-debug');

var gulp       = require('gulp');
var del        = require('del');
var args       = require('yargs').argv;

var filter     = require('gulp-filter');

var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
// var gulpif     = require('gulp-if');
var flatten    = require('gulp-flatten');

var useref     = require('gulp-useref');
var uglify     = require('gulp-uglify');
var cleanCSS   = require('gulp-clean-css');
var htmlmin    = require('gulp-htmlmin');
var jsonminify = require('gulp-jsonminify');

var wiredep    = require('wiredep').stream;
var gettext    = require('gulp-angular-gettext');

var bump = require('gulp-bump');

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
	var json = filter(['**/*.json'], {restore: true});
	var html = filter(['**/*.tpl'], {restore: true});
	return gulp.src(['src/*.json', 'src/+(_locales)/**/*.json', 'src/+(BackgroundApp)/+(audio|img)/*', 'src/**/*.tpl'])
				.pipe(json).pipe(jsonminify()).pipe(json.restore)
				.pipe(html).pipe(htmlmin({collapseWhitespace: true})).pipe(html.restore)
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


gulp.task('build', ['clean'], function () {
	gulp.start('build:source')
});
gulp.task('build:source', ['copy', 'sass'], function () {
	var js = filter(['**/*.js'], {restore: true});
	var css = filter(['**/*.css'], {restore: true});
	var html = filter(['**/*.html'], {restore: true});
	return gulp.src(['src/+(OptionsApp|BackgroundApp|PopupApp)/*.html'])
				.pipe(useref())
	      .pipe(js).pipe(uglify()).pipe(js.restore)
	      .pipe(css).pipe(cleanCSS()).pipe(css.restore)
	      .pipe(html).pipe(htmlmin({collapseWhitespace: true})).pipe(html.restore)
				.pipe(gulp.dest('build'))
				;
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

gulp.task('bump', function () {

	// Version example
	//  major: 1.0.0
	//  minor: 0.1.0
	//  patch: 0.0.2
	//  prerelease: 0.0.1-2
	var bumpParams = {};
	if (args.ver) bumpParams.version = args.ver;
	else bumpParams.type = args.type || 'patch';

  var manifestFilter = filter(['src/manifest.json'], {restore: true});
  var regularJsons = filter(['*.json'], {restore: true});

  return gulp.src(['bower.json', 'package.json', 'src/manifest.json'])
    .pipe(bump(bumpParams))
		.pipe(manifestFilter)
    .pipe(gulp.dest('./src'))
    .pipe(manifestFilter.restore)
    .pipe(regularJsons)
    .pipe(gulp.dest('./'));
});
