'use strict';
 
const gulp        = require('gulp');
const terser      = require('gulp-terser');
const rename      = require('gulp-rename');
const livereload  = require('gulp-livereload');
const log         = require('fancy-log');
const colors      = require('ansi-colors');
const fs          = require('fs-extra');
 
// Order matters — concatenation only
const scriptsToInline = [
  './src/js/engine/engine.all.release.js',
  './src/js/consts.js',
  './src/js/levels.js',
  './src/js/objects.js',
  './src/js/input.js',
  './src/js/screens.js',
  './src/js/powerups.js',
  './src/js/hud.js',
  './src/js/main.js',
];
 
function onError(err, pipeline) {
  log(colors.red(`Error: ${err.message}`));
  import('beeper').then(m => m.default());
  if (pipeline) pipeline.emit('error', err);
}
 
async function concatenateScripts(files, outputName) {
  try {
    let concatenated = '';
 
    for (const file of files) {
      concatenated += await fs.readFile(file, 'utf8') + '\n';
    }
 
    const outPath = `./dist/${outputName}`;
    await fs.outputFile(outPath, concatenated);
 
    log(colors.green(`Concatenated → ${outputName}`));
    return outPath;
  } catch (err) {
    onError(err);
    throw err;
  }
}
 
/* =======================
   DEV
   ======================= */
 
function buildDevFull() {
  return concatenateScripts(scriptsToInline, 'main.js')
    .then(() =>
      gulp.src('./dist/main.js')
        .pipe(livereload())
    );
}
 
function buildDevMin() {
  return gulp.src('./dist/main.js')
    .pipe(terser({
      compress: true,
      mangle: {
        properties: {}
      }
    }))
    .on('error', onError)
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./dist'));
}
 
/* =======================
   RELEASE
   ======================= */
 
function buildReleaseFull() {
  return concatenateScripts(scriptsToInline, 'main.release.js')
    .then(() =>
      gulp.src('./dist/main.release.js')
        .pipe(livereload())
    );
}
 
function buildReleaseMin() {
  return gulp.src('./dist/main.release.js')
    .pipe(terser({
      compress: {
        passes: 5,
        toplevel: true,
        unsafe: true,
        pure_getters: true,
        booleans_as_integers: true,
      },
      mangle: {
        toplevel: true,
        properties: {},
      },
      format: {
        comments: false,
      },
    }))
    .on('error', onError)
    .pipe(rename('main.release.min.js'))
    .pipe(gulp.dest('./dist'));
}
 
/* =======================
   TASKS
   ======================= */
 
exports.build = gulp.series(buildDevFull, buildDevMin);
exports.buildRelease = gulp.series(buildReleaseFull, buildReleaseMin);