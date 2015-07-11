var gulp = require('gulp');

var watch = require('gulp-watch');

var bower = require('bower');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');

var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');

var notify = require('gulp-notify');

var shell = require('gulp-shell');

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

gulp.task('build', ['jshint', 'test']);

gulp.task('default', ['build']);

// gulp.task('watch', function(){
//   gulp.src(['./client/**/*.js']);
//   watch('./server/**/*.js', function(){

//   });
// });

//gulp.task('',[]);