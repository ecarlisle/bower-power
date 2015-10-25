var gulp = require('gulp'),
  del = require('del'),
  bower = require('gulp-bower'),
  main_bower_files = require('main-bower-files'),
  run = require('gulp-run'),
  filter = require('gulp-filter'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  filter = require('gulp-filter');

// ----
// Cleans out dependencies in the /vendor folder.
gulp.task('clean', function() {
  return del('vendor/**');
});

// Use Bower gulp module to download folders.
gulp.task('get_deps', ['clean'], function() {
  return bower({
    cmd: 'update'
  });
});

// Use get-main-files module to place dependencies in /vendor.
gulp.task('main_files_1', ['clean'], function() {
  return gulp.src(main_bower_files(), {
      base: 'bower_components'
    })
    .pipe(gulp.dest('vendor/'));
});

// Use get-main-files module, but this time get fonts and CSS.
gulp.task('main_files_2', ['clean'], function() {
  return gulp.src(main_bower_files({
      "overrides": [{
        "bootstrap": {
          "main": [
            "dist/css/bootstrap.css",
            "dist/js/bootstrap.js"
          ]
        }
      }]
    }), {
      base: 'bower_components'
    })
    .pipe(gulp.dest('vendor/'));
});

gulp.task('cherry_pick', ['clean'], function() {
  return gulp.src(['bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/modernizr/moderizr.js'
    ])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('vendor/js'));
});

// Build using different approaches.
gulp.task('build1', ['get_deps'], function() {
  tree('bower_components -d -C -L 1');
});

gulp.task('build2', ['main_files_1'], function() {
  tree('vendor -C');
});

gulp.task('build3', ['main_files_2'], function() {
  tree('vendor -C');
});

gulp.task('build4', ['cherry_pick'], function() {
  tree('vendor -C');
});

// Utility functions.
function tree(options) {
  run('tree ' + options).exec();
}