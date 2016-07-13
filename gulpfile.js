var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();
var copy = require('gulp-copy');
var rename = require('gulp-rename');

var bootstrapPath = './node_modules/bootstrap-sass/assets/';
var styleguidePath = './node_modules/styleguide/source/';

var stylesheets = [
  'source/**/*.scss',
  styleguidePath,
  bootstrapPath + 'stylesheets'
];

var scripts = [
  // local scripts

  // 'scripts/**/*.js'

	// bootstrap

	// bootstrapPath + 'javascripts/bootstrap/affix.js',
	// bootstrapPath + 'javascripts/bootstrap/alert.js',
	// bootstrapPath + 'javascripts/bootstrap/button.js',
	bootstrapPath + 'javascripts/bootstrap/collapse.js',
	bootstrapPath + 'javascripts/bootstrap/dropdown.js',
	// bootstrapPath + 'javascripts/bootstrap/modal.js',
	// bootstrapPath + 'javascripts/bootstrap/popover.js',
	// bootstrapPath + 'javascripts/bootstrap/scrollspy.js',
	// bootstrapPath + 'javascripts/bootstrap/tab.js',
	// bootstrapPath + 'javascripts/bootstrap/tooltip.js',
	// bootstrapPath + 'javascripts/bootstrap/transition.js',
];

// converts sass into final stylesheet file
gulp.task('sass', function () {
  return gulp
    .src('source/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      includePaths: stylesheets
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dest/css'))
    .pipe(browserSync.stream());
});

// converts scripts into final minified file
gulp.task('scripts', function(){
	return gulp
    .src(scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dest/js'))
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dest/js'))
    .pipe(browserSync.reload({ stream: true }));
});

// serve up using browsersync
gulp.task('serve', function() {
  browserSync.init({ server: 'dest' });

  // watch files and build/reload where needed
  gulp.watch(['source/**/*.scss', styleguidePath + '**/*.scss'], ['sass']);
  gulp.watch(scripts, ['scripts']);
  gulp.watch(styleguidePath + 'images/**/*', ['copy-images']);
  gulp.watch('dest/**/*.html').on('change', browserSync.reload);
});

// copies images to styleguide
gulp.task('copy-images', function(){
  return gulp.src(styleguidePath + 'images/**/*')
    .pipe(copy('dest', { prefix: 3 }));
});

// copies fonts to styleguide
gulp.task('copy-fonts', function(){
  return gulp.src(styleguidePath + 'fonts/**/*')
      .pipe(copy('dest', { prefix: 3 }));
});

// when running `gulp build` for a static build
gulp.task('build', ['sass', 'scripts', 'copy-images', 'copy-fonts']);

// when running `gulp` to build, watch and re-build
gulp.task('default', ['build', 'serve']);
