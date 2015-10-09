var gulp = require('gulp'),
  concat = require('gulp-concat'),
  browserify = require('gulp-browserify'),
  connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Browserify task
gulp.task('browserify', function () {
  gulp.src(['game/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('game.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js'));
  
});

gulp.task('copy', function () {
  gulp.src(['assets/*/**'])
  .pipe(gulp.dest('dist/assets'));

  gulp.src('index.html')
  .pipe(gulp.dest('dist'));

  gulp.src('scss/*')
  .pipe(gulp.dest('dist/css'));
});

gulp.task('dev', function () {
  gulp.watch(['game/*.js', 'game/**/*.js'], [
    'browserify'
  ]);
    gulp.watch(['index.html', 'scss/*', 'assets/*/**'], [
    'copy'
  ]);
  connect.server({
    root: 'dist',
    port: 4254,
    livereload: true
  });
});