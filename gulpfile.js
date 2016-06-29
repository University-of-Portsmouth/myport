var gulp = require('gulp');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();
var copy = require('gulp-copy');

var stylesheets = [
  'source/**/*.scss',
  './node_modules/styleguide/source',
  './node_modules/bootstrap-sass/assets/stylesheets'
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

// serve up using browsersync
gulp.task('serve', function() {
  browserSync.init({ server: 'dest' });

  // watch files and build/reload where needed
  gulp.watch(['source/**/*.scss', './node_modules/styleguide/source/**/*.scss'], ['sass']);
  gulp.watch('./node_modules/styleguide/source/images/**/*', ['copy-images']);
  gulp.watch('dest/**/*.html').on('change', browserSync.reload);
});

// copies images to styleguide
gulp.task('copy-images', function(){
  return gulp.src('./node_modules/styleguide/source/images/**/*')
    .pipe(copy('dest', { prefix: 3 }));
});

// copies fonts to styleguide
gulp.task('copy-fonts', function(){
  return gulp.src('./node_modules/styleguide/source/fonts/**/*')
      .pipe(copy('dest', { prefix: 3 }));
});

// when running `gulp build` for a static build
gulp.task('build', ['sass', 'copy-images', 'copy-fonts']);

// when running `gulp` to build, watch and re-build
gulp.task('default', ['build', 'serve']);
