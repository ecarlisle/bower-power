var gulp = require('gulp'),
  del = require('del'),
  filter = require('gulp-filter'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  filter = require('gulp-filter'),
  exec = require('child_process').exec,
  minify_css = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),
  strip_css_comments = require('gulp-strip-css-comments'),
  bower = require('gulp-bower'),
  main_bower_files = require('main-bower-files');


// Cleans out dependencies in the /assets folder.
gulp.task('clean_assets', function() {
  return del('assets/**');
});

// Uses "Bower" Gulp module to get all dependencies.
gulp.task('get_dependencies', function() {
  return bower({cmd: 'update'});
});

// Use "get-main-files" Gulp module without options.
// Gets default "main" file(s) for each dependency.
gulp.task('main_files_1', ['get_dependencies'], function() {
  return gulp.src(main_bower_files(), {
      base: 'bower_components'
    })
    .pipe(gulp.dest('assets'));
});

// Use get-main-files Gulp module with an options.
// Overrides "main" file(s) option for bootstrap and font-awesome.
gulp.task('main_files_2', ['get_dependencies'], function() {
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


// --- A typical-ish simple Gulp approach using multiple tasks --- //
// Note: Much (if not all) of the functionality of the following 
// workflow can be done by pairing in the Gulp Bower modules.

// Get and optimize all scripts. 
gulp.task('scripts', ['clean_assets'], function() {

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

// --- Kick off the detailed Gulp build sequence. --- //
gulp.task('default', ['images'], function() {
});

// --- Fetch different versions of the bower config --- //

// Get a bower.json with the format you'd see after running "bower init".
gulp.task('bower1', function() {
  return gulp.src('src/bower_configs/bower1.json')
    .pipe(rename('bower.json'))
    .pipe(gulp.dest('.'));
});

// Get a bower.json with the format you'd see after indicating dependencies
// using "gump install"
gulp.task('bower2', function() {
  return gulp.src('src/bower_configs/bower2.json')
    .pipe(rename('bower.json'))
    .pipe(gulp.dest('.'));
});

// Get a bower.json with the format you'd see for the simplest configuration 
// of the bower-installer command-line tool.
gulp.task('bower3', function() {
  return gulp.src('src/bower_configs/bower3.json')
    .pipe(rename('bower.json'))
    .pipe(gulp.dest('.'));
});

// Get a bower.json with the format you'd see for a more specific configuration  
// of the bower-installer command-line tool.
gulp.task('bower4', function() {
  return gulp.src('src/bower_configs/bower4.json')
    .pipe(rename('bower.json'))
    .pipe(gulp.dest('.'));
});

// --- Utility functions --- //

// Utility functions - good for viewing the assets folder 
// structure if you have tree installed. Tree may be installed 
// with brew, apt-get, etc...
function tree(options) {
  exec('tree ' + options, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
}