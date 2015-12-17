#! /usr/bin/env node

/* eslint-disable no-console */

import { resolve } from 'path';
import lintLocked from '../index';

const packageFile = resolve('./package.json');
let packageJson;
try {
  packageJson = require(packageFile);
} catch (err) {
  console.error(`Error loading package.json: ${err.message}`);
  process.exit(1);
}

try {
  lintLocked(packageJson);
} catch (err) {
  console.error(err.stack);
  process.exit(1);
}
