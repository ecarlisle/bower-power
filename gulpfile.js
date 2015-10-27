var gulp = require('gulp'),
  del = require('del'),
  bower = require('gulp-bower'),
  filter = require('gulp-filter'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  filter = require('gulp-filter'),
  exec = require('child_process').exec,
  minify_css = require('gulp-minify-css'),
  rename = require('gulp-rename');
  sourcemaps = require('gulp-sourcemaps'),
  strip_css_comments = require('gulp-strip-css-comments'),
  main_bower_files = require('main-bower-files');

// Cleans out dependencies in the /vendor folder.
gulp.task('clean', function() {
  return del('assets/**');
});

// Cleans out dependencies in the /vendor folder.
gulp.task('rm_deps', function() {
  return del('bower_components/**');
});

// Use Bower gulp module to download folders.
gulp.task('get_deps', ['rm_deps'], function() {
  return bower({
    cmd: 'update'
  });
});

// Use get-main-files module to place dependencies in /vendor.
gulp.task('main_files_1', ['clean'], function() {
  return gulp.src(main_bower_files(), {
      base: 'bower_components'
    })
    .pipe(gulp.dest('assets'));
});

// Use get-main-files module, but this time get fonts and CSS
// Not indicated as a Bower "main" file.
gulp.task('main_files_2', ['clean'], function() {
  return gulp.src(main_bower_files(
      {
        "overrides": {
          "bootstrap": {
            "main": [
              "./dist/css/bootstrap.css",
              "./dist/js/bootstrap.js",
              "./dist/fonts/**"
            ]
          },
          "font-awesome": {
            "main": [
              "./css/font-awesome.css",
              "./fonts/**"
            ]
          }
        }
      }), {
      base: 'bower_components'
    })
    .pipe(gulp.dest('assets'));
});

// --- A typical-ish Gulp approach using multiple tasks --- //

// Get and optimize all scripts. 
gulp.task('scripts', ['clean'], function() {

  return gulp.src(['bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/mustache.js/mustache.js',
      'bower_components/modernizr/moderizr.js',
      'src/js/my-custom-script.js',
    ])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});

// Get and optimize all styles. 
gulp.task('styles', ['scripts'], function() {

  return gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css',
      'bower_components/font-awesome/css/font-awesome.css',
      'src/css/my-custom-styles.css'
    ])
    .pipe(strip_css_comments({
      preserve: false
    }))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.init())
    .pipe(minify_css())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/css'));
});

// Get fonts.
gulp.task('fonts', ['styles'], function() {
  return gulp.src(['bower_components/bootstrap/dist/fonts/**',
      'bower_components/font-awesome/fonts/**'
    ])
    .pipe(gulp.dest('assets/fonts'));
});

// Get images.
gulp.task('images', ['fonts'], function() {
  return gulp.src('src/images/bower-logo.png')
    .pipe(gulp.dest('assets/img'));
});

// --- Build tasks using different approaches --- //

gulp.task('build1', ['get_deps'], function() {
  tree('bower_components -d -C -L 1');
});

gulp.task('build2', ['main_files_1'], function() {
  tree('assets -C');
});

gulp.task('build3', ['main_files_2'], function() {
  tree('assets -C');
});

gulp.task('build4', ['images'], function() {
  tree('assets -C');
});

// --- The watcher --- //
gulp.task('watch', function() {
  gulp.watch('src/css/*.css', ['styles']);
});

// --- Fetch different versions of the bower config --- //

// Get bower after initial config.
gulp.task('bower1', function() {
  return gulp.src('src/bower_configs/bower1.json')
    .pipe(rename('bower.json'))
    .pipe(gulp.dest('.'));
});

// Get bower after determining dependencies config.
gulp.task('bower2', function() {
  return gulp.src('src/bower_configs/bower2.json')
    .pipe(rename('bower.json'))
    .pipe(gulp.dest('.'));
});

// Use for simple version of Bower Installer.
gulp.task('bower3', function() {
  return gulp.src('src/bower_configs/bower3.json')
    .pipe(rename('bower.json'))
    .pipe(gulp.dest('.'));
});

// Use for additional version of Bower Installer.
gulp.task('bower4', function() {
  return gulp.src('src/bower_configs/bower4.json')
    .pipe(rename('bower.json'))
    .pipe(gulp.dest('.'));
});

// --- Utility functions --- //

// Utility functions.
function tree(options) {
  exec('tree ' + options, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
}