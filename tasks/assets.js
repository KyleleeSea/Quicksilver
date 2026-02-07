const gulp = require('gulp');
const livereload = require('gulp-livereload');

function assets() {
  return gulp.src([ 'src/assets/**/*'])
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./docs'))
    .pipe(livereload());
}

exports.assets = assets;
