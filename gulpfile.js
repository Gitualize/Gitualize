var gulp = require('gulp');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var notify = require('gulp-notify');
var shell = require('gulp-shell');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var source = require('vinyl-source-stream');




var paths = {
  backend: ['./server/**/*.js'],
  frontend: ['./client/**/*.js']
};

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
  gulp.src(['./spec/unit/backend.js', './spec/unit/frontend.js'])
    .pipe(jasmine());
});

gulp.task('browserify', function() {
    var bundler = browserify({
        entries: ['./client/js/app.js'],
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    });
    var watcher  = watchify(bundler);

    return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now();
        console.log('Updating!');
        watcher.bundle() // Create new bundle that uses the cache for high performance
        .pipe(source('./client/js/app.js'))
    // This is where you add uglifying etc.
        .pipe(gulp.dest('./client/build'));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('./client/js/app.js'))
    .pipe(gulp.dest('./client/build'));
});

gulp.task('build', [/*'jshint',*/ 'test']);

gulp.task('default',['browserify', 'build']);
