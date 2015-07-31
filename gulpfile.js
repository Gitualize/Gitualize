var gulp = require('gulp');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var protractor = require('gulp-angular-protractor');
var notify = require('gulp-notify');
var shell = require('gulp-shell');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');

var paths = {
  backend: ['./server/**/*.js'],
  frontend: ['./client/**/*.js']
};

var dependencies = [
  'react',
  'react/addons',
];

gulp.task('jshint', function(done){
  gulp.src(paths.backend.concat(paths.frontend))
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  // .pipe(jshint.reporter('fail'))
  .on('error', notify.onError(function(error) {
    return error.message;
  }));
});

gulp.task('min', function(){
  gulp.src(paths.frontend)
  .pipe(concat())
  .pipe(uglify());
});

gulp.task('test', function(){
  gulp.src(['./spec/unit/backend.js', './spec/integration/backend.js'])
  .pipe(jasmine());
});

gulp.task('testE', function(){
  gulp.src(['./spec/e2e/spec.js'])
  .pipe(protractor({
    'configFile': './spec/e2e/conf.js',
    'args': ['--baseUrl', 'http://127.0.0.1:3000'],
    'autoStartStopServer': true,
    'debug': true
  }));
});

gulp.task('testify', function() {
  var bundler = browserify({
    entries: ['./spec/unit/frontend.js'],
    transform: [babelify], // We want to convert JSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  var watcher = watchify(bundler);

  return watcher
  .on('update', function () { // When any files update
    var updateStart = Date.now();
    console.log('Updating!');
    watcher.bundle() // Create new bundle that uses the cache for high performance
    .on('error', notify.onError(function(error) {
      console.log(error.message);
      this.emit('end');
    }))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./spec/build'));
    console.log('Updated!', (Date.now() - updateStart) + 'ms');
  })
  .bundle() // Create the initial bundle when starting the task
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./spec/build'));
})

gulp.task('testifyWatchless', function(){
  browserify({
    entries: ['./spec/unit/frontend.js'],
    transform: [babelify]
  })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./spec/build'));
});

gulp.task('testf', function() {
  gulp.src(['./spec/build/bundle.js'])
  .pipe(jasmine());
})

gulp.task('browserifyWatchless', function(){
  browserify({
    entries: ['./client/js/app.js'],
    transform: [babelify]
  })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./client/build'));
});

gulp.task('browserify', function() {
  var bundler = browserify({
    entries: ['./client/js/app.js'],
    transform: [babelify], // We want to convert JSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });
  var watcher = watchify(bundler);

  return watcher
  .on('update', function () { // When any files update
    var updateStart = Date.now();
    console.log('Updating!');
    watcher.bundle() // Create new bundle that uses the cache for high performance
    .on('error', notify.onError(function(error) {
      console.log(error.message);
      this.emit('end');
    }))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./client/build'));
    console.log('Updated!', (Date.now() - updateStart) + 'ms');
  })
  .bundle() // Create the initial bundle when starting the task
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./client/build'));
});

gulp.task('build', [/*'jshint',*/ 'test']);
gulp.task('default',['browserify']);
