const { spawn } = require('child_process');
const path = require('path');
const assume = require('assume');
const { describe, it } = require('mocha');
const concat = require('concat-stream');

describe('chonk', function () {
  function verifyStd(whichStd, expected) {
    return function (std) {
      if (expected) {
        if (Array.isArray(expected)) {
          let lastFound = -1;
          expected.forEach(o => {
            const idx = std.indexOf(o);
            assume(idx).not.equals(-1, `'${o}' not found in ${whichStd}`);
            assume(idx).is.gt(lastFound, `'${o}' was found, but not in the right order`);
            lastFound = idx;
          });
        } else {
          assume(std).includes(expected);
        }
      }
    };
  }

  function assumeOutput(expectedOut, expectedErr, expectedExitCode, ...args) {
    return function (done) {
      const proc = spawn(path.join(__dirname, '../../index.js'), args);
      const stdoutVerifier = concat({
        encoding: 'string'
      }, verifyStd('stdout', expectedOut));
      const stderrVerifier = concat({
        encoding: 'string'
      }, verifyStd('stderr', expectedErr));
      proc.stdout.pipe(stdoutVerifier);
      proc.stderr.pipe(stderrVerifier);
      proc.on('close', code => {
        assume(code).equals(expectedExitCode);
        done();
      });
    };
  }

  it('errors when no parameters specified', assumeOutput(
    null,
    'Wat? No files specified',
    1
  ));

  it('prints usage', assumeOutput(
    'Options:',
    null,
    0,
    '--help'
  ));

  it('prints files in order', assumeOutput(
    [
      '0.027.txt', 'A fine file',
      '50.txt', 'It chonk',
      '500.txt', 'A heckin\' chonker',
      '2000.txt', 'HEFTYCHONK',
      '10000.txt', 'MEGACHONKER',
      '50001.txt', 'OH LAWD, IT COMIN\'!'
    ],
    null,
    0,
    ...[
      '0.027.txt',
      '50.txt',
      '500.txt',
      '2000.txt',
      '10000.txt',
      '50001.txt'
    ].map(filename => path.join(__dirname, 'fixtures', filename))
  ));

  it('accepts chonkiness override flags', assumeOutput(
    [
      '50.txt', 'A fine file',
      '500.txt', 'It chonk',
      '2000.txt', 'A heckin\' chonker',
      '10000.txt', 'HEFTYCHONK',
      '50001.txt', 'MEGACHONKER'
    ],
    null,
    0,
    ...[
      '-c 51',
      '-h 510',
      '-H 3000',
      '-M 11000',
      '-L 52000'
    ].concat([
      '50.txt',
      '500.txt',
      '2000.txt',
      '10000.txt',
      '50001.txt'
    ].map(filename => path.join(__dirname, 'fixtures', filename)))
  ));

  it('bails on invalid path', assumeOutput(
    null,
    'Error:',
    1,
    'someNonExistantFile.txt'
  ));
});
