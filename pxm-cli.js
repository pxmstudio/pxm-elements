#!/usr/bin/env node

const { program } = require('commander');
const pkg = require('./package.json');

program
  .name('pxm')
  .description('PixelMakers Elements CLI')
  .version(pkg.version || '0.1.0');

program
  .command('init')
  .description('Initialize PixelMakers Elements configuration')
  .action(() => {
    console.log('pxm init: Not yet implemented.');
  });

program
  .command('copy <component>')
  .description('Copy a component to your project')
  .action((component) => {
    console.log(`pxm copy: Not yet implemented for component: ${component}`);
  });

program.parse(process.argv); 