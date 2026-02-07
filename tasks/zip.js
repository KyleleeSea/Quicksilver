'use strict';

const gulp      = require('gulp');
const gulp_tar       = require('gulp-tar');
const rename    = require('gulp-rename');
const log       = require('fancy-log');
const colors    = require('ansi-colors');
const htmlmin   = require('gulp-htmlmin');
const fs        = require('fs');
const zlib      = require('zlib');
const { spawn } = require('child_process');
const buildTasks = require('./build.js');
const templateTasks = require('./template.js');
const merge = require('merge-stream');
const terser = require('terser');
const maxkb = 15360;

// Source files matching the concatenation order in build.js
const sourceFiles = [
  { name: 'engine',   path: './src/js/engine/engine.all.release.js' },
  { name: 'consts',   path: './src/js/consts.js' },
  { name: 'levels',   path: './src/js/levels.js' },
  { name: 'objects',  path: './src/js/objects.js' },
  { name: 'input',    path: './src/js/input.js' },
  { name: 'screens',  path: './src/js/screens.js' },
  { name: 'powerups', path: './src/js/powerups.js' },
  { name: 'hud',      path: './src/js/hud.js' },
  { name: 'main',     path: './src/js/main.js' },
];

async function sizeBreakdown() {
  const terserOpts = {
    compress: { passes: 2, toplevel: true },
    mangle:   { toplevel: true, properties: {} },
    format:   { comments: false },
  };

  log(colors.cyan.bold('\n── Per-file size breakdown ──'));
  log(colors.gray('  File         │  Raw    │ Minified │ Brotli'));
  log(colors.gray('  ─────────────┼─────────┼──────────┼───────'));

  let totalRaw = 0, totalMin = 0, totalBr = 0;

  for (const f of sourceFiles) {
    const raw = fs.readFileSync(f.path, 'utf8');
    const rawBytes = Buffer.byteLength(raw);
    let minBytes = 0, brBytes = 0;
    try {
      const result = await terser.minify(raw, terserOpts);
      const minBuf = Buffer.from(result.code);
      minBytes = minBuf.length;
      const brBuf = zlib.brotliCompressSync(minBuf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } });
      brBytes = brBuf.length;
    } catch (_) {
      minBytes = rawBytes;
      brBytes = rawBytes;
    }
    totalRaw += rawBytes; totalMin += minBytes; totalBr += brBytes;
    const label = f.name.padEnd(12);
    log(`  ${label} │ ${String(rawBytes).padStart(7)} │ ${String(minBytes).padStart(8)} │ ${String(brBytes).padStart(5)}`);
  }

  // PNG
  const pngFiles = ['./src/assets/t.png'];
  for (const p of pngFiles) {
    try {
      const stat = fs.statSync(p);
      const raw = stat.size;
      const data = fs.readFileSync(p);
      const brBuf = zlib.brotliCompressSync(data, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } });
      log(`  ${'t.png'.padEnd(12)} │ ${String(raw).padStart(7)} │      n/a │ ${String(brBuf.length).padStart(5)}`);
      totalRaw += raw; totalBr += brBuf.length;
    } catch (_) {}
  }

  // CSS
  try {
    const css = fs.readFileSync('./dist/main.css', 'utf8');
    const cssBytes = Buffer.byteLength(css);
    const cssBr = zlib.brotliCompressSync(Buffer.from(css), { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } });
    log(`  ${'css'.padEnd(12)} │ ${String(cssBytes).padStart(7)} │      n/a │ ${String(cssBr.length).padStart(5)}`);
    totalRaw += cssBytes; totalBr += cssBr.length;
  } catch (_) {}

  // HTML overhead
  try {
    const html = fs.readFileSync('./dist/index.min.html', 'utf8');
    const htmlBytes = Buffer.byteLength(html);
    const htmlBr = zlib.brotliCompressSync(Buffer.from(html), { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } });
    log(`  ${'html(total)'.padEnd(12)} │ ${String(htmlBytes).padStart(7)} │      n/a │ ${String(htmlBr.length).padStart(5)}`);
  } catch (_) {}

  log(colors.gray('  ─────────────┼─────────┼──────────┼───────'));
  log(colors.yellow.bold(`  ${'TOTAL'.padEnd(12)} │ ${String(totalRaw).padStart(7)} │ ${String(totalMin).padStart(8)} │ ${String(totalBr).padStart(5)}`));
  log(colors.yellow(`  (individual brotli sum ≠ archive; joint compression is better)\n`));
}

function beep() {
  import('beeper').then(module => module.default());
}

function indexRename() {
  return gulp.src('./dist/index.min.html')
    .pipe( htmlmin({ collapseWhitespace: true }) )
    .pipe( rename('index.html') )
}

function assetsFetch() {
  return gulp.src('./dist/*.png');
}

function zip() {
  // create a tarball from the built index and assets
  const merged = merge(indexRename(), assetsFetch())
    .pipe( gulp_tar('game.tar') )
    .pipe( gulp.dest('dist') );
  return merged;
}

function report(done) {
  // report sizes for tar.br and tar.zst (fall back to tar if compressed not found)
  const reportPath = (path) => new Promise((resolve) => {
    fs.stat(path, (err, data) => {
      if (err) return resolve(null);
      return resolve(data.size);
    });
  });

  Promise.all([
    reportPath('./dist/game.tar.br'),
    reportPath('./dist/game.tar.zst'),
    reportPath('./dist/game.tar')
  ]).then(sizes => {
    const [brSize, zstSize, tarSize] = sizes;
    if (brSize) {
      log(colors.yellow.bold(`Current game size (.tar.br): ${brSize} bytes`));
      let percent = parseInt((brSize / maxkb) * 100, 10);
      log(colors.yellow.bold(`${percent}% of total game size used`));
      return done();
    }
    if (zstSize) {
      log(colors.yellow.bold(`Current game size (.tar.zst): ${zstSize} bytes`));
      let percent = parseInt((zstSize / maxkb) * 100, 10);
      log(colors.yellow.bold(`${percent}% of total game size used`));
      return done();
    }
    if (tarSize) {
      log(colors.yellow.bold(`Current game size (.tar): ${tarSize} bytes`));
      let percent = parseInt((tarSize / maxkb) * 100, 10);
      log(colors.yellow.bold(`${percent}% of total game size used`));
      return done();
    }
    beep();
    return done(new Error('No archive found'));
  }).catch(err => done(err));
}

function compressTar(done) {
  // compress using Node's Brotli for .tar.br
  const tarPath = './dist/game.tar';
  fs.readFile(tarPath, (err, data) => {
    if (err) return done(err);

    const brPromise = new Promise((resolve) => {
      zlib.brotliCompress(data, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }, (err2, brData) => {
        if (err2) {
          log(colors.red('Brotli compression failed:'), err2.message);
          return resolve();
        }
        fs.writeFile('./dist/game.tar.br', brData, (werr) => {
          if (werr) log(colors.red('Writing .tar.br failed:'), werr.message);
          else log(colors.green('Created ./dist/game.tar.br'));
          return resolve();
        });
      });
    });

    const zstPromise = new Promise((resolve) => {
      const zstd = spawn('zstd', ['-q', '-o', './dist/game.tar.zst', tarPath]);
      zstd.on('error', () => {
        log(colors.yellow('zstd not available; skipping .tar.zst output'));
        return resolve();
      });
      zstd.on('close', (code) => {
        if (code === 0) log(colors.green('Created ./dist/game.tar.zst'));
        else log(colors.yellow('zstd exited with code', code, '; .tar.zst may not have been created'));
        return resolve();
      });
    });

    Promise.all([brPromise, zstPromise]).then(() => {
      // remove the intermediate tarball
      fs.unlink(tarPath, (uerr) => {
        if (uerr) log(colors.yellow('Could not delete game.tar:'), uerr.message);
        else log(colors.green('Removed ./dist/game.tar'));
        return done();
      });
    }).catch(e => done(e));
  });
}

exports.zip = zip;
exports.compress = compressTar;
exports.report = gulp.series(report, sizeBreakdown);
