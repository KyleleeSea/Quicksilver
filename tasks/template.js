'use strict';

const gulp        = require('gulp');
const handlebars  = require('handlebars');
const fs          = require('fs-extra');
const srcmaps     = require('gulp-sourcemaps');
const buffer      = require('vinyl-buffer');
const source      = require('vinyl-source-stream');
const buildTasks  = require('./build.js');
const cssTasks    = require('./css.js');

function getJS() {
  return readFile('./dist/main.min.js');
}

function getReleaseJS() {
  return readFile('./dist/main.release.min.js');
}

function getCSS() {
  return readFile('./dist/main.css');
}

function writeFile( fname, data ) {
  return new Promise(( resolve, reject ) => {
    fs.writeFile( fname, data, err => {
      if ( err ) {
        return reject( err );
      }
      resolve();
    });
  });
}

function readFile( fname ) {
  return new Promise(( resolve, reject ) => {
    fs.readFile( fname, ( err, data ) => {
      if ( err ) {
        return reject( err );
      }
      resolve( data.toString('utf8') );
    });
  });
}

async function template() {
  const str = await readFile('./src/index.hbs');

  // development index.html
  const result = handlebars.compile(str)();
  return await writeFile('./dist/index.html', result);
};

async function templateRelease() {
  const js = await getReleaseJS();
  const css = await getCSS();
  const str = await readFile('./src/index.hbs');
  // Inline/minified index file
  let inlineResult = handlebars.compile(str)({ js, css });
  await writeFile('./dist/index.min.html', inlineResult);
  await fs.ensureDir('./docs');
  return await fs.copyFile('./dist/index.min.html', './docs/index.html');
}

exports.template = template;
exports.templateRelease = templateRelease;
