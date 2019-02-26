#!/usr/bin/env node

const async = require('async');
const chalk = require('chalk');
const fs = require('fs');
const prettyBytes = require('pretty-bytes');
const argv = require('yargs')
  .option('lawd', {
    alias: 'L',
    default: '50000',
    describe: 'Minimum size in kilobytes for OH LAWD, OT COMIN\'!',
    type: 'number'
  })
  .option('mega', {
    alias: 'M',
    default: '10000',
    describe: 'Minimum size in kilobytes for MEGACHONKER',
    type: 'number'
  })
  .option('hefty', {
    alias: 'H',
    default: '2000',
    describe: 'Minimum size in kilobytes for HEFTYCHONK',
    type: 'number'
  })
  .option('heck', {
    alias: 'h',
    default: '500',
    describe: 'Minimum size in kilobytes for A heckin\' chonker',
    type: 'number'
  })
  .option('chonk', {
    alias: 'c',
    default: '50',
    describe: 'Minimum size in kilobytes for It chonk',
    type: 'number'
  })
  .argv;

if (!argv._ || argv._.length < 1) {
  console.error(chalk.red('Wat? No files specified 😿'));
  process.exit(1);
}

async.eachSeries(argv._, (filePath, next) => {
  fs.stat(filePath, (statErr, stats) => {
    if (statErr) return next(statErr);

    const { size } = stats;
    const chonkiness = getChonkiness(size);
    console.log(chalk.white(filePath + ':'), chalk[chonkiness.color](chonkiness.text), `(${prettyBytes(size)})`);
    next();
  });
}, err => {
  if (err) {
    console.error(chalk.red('Error:'), err.message);
    process.exit(1);
    return;
  }
});

const KB = 1000;

function getChonkiness(size) {
  // @ts-ignore
  if (size > argv.lawd * KB) {
    return {
      color: 'red',
      text: 'OH LAWD, IT COMIN\'!'
    };
  }
  // @ts-ignore
  if (size > argv.mega * KB) {
    return {
      color: 'red',
      text: 'MEGACHONKER'
    };
  }
  // @ts-ignore
  if (size > argv.hefty * KB) {
    return {
      color: 'yellow',
      text: 'HEFTYCHONK'
    };
  }
  // @ts-ignore
  if (size > argv.heck * KB) {
    return {
      color: 'yellow',
      text: 'A heckin\' chonker'
    };
  }
  // @ts-ignore
  if (size > argv.chonk * KB) {
    return {
      color: 'cyan',
      text: 'It chonk'
    };
  }
  return {
    color: 'green',
    text: 'A fine file'
  };
}
